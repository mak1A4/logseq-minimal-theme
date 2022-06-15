import '@logseq/libs';
import * as c from "./common";

export function changeDoneMarkerChildBlocks(doc) {
    (async () => {
        try {
            let currentPage = await logseq.Editor.getCurrentPage();
            if (!currentPage) return;
            if (currentPage.name) {
                currentPage = await logseq.Editor.getPage(currentPage.page.id);
            }
            let currentPageName = currentPage.name;
            if (!currentPageName) return;

            let queryResult = await logseq.DB.datascriptQuery(`
            [:find (pull ?b [*])
            :where
                [?b :block/page ?p]
                [?p :block/name "${currentPageName}"]
                [?b :block/parent ?h]
                [?h :block/marker "DONE"]]`
            );
            queryResult.forEach((b) => {
                let uuid = b[0].uuid.$uuid$;
                let blockEl = doc.querySelector(`[blockid="${uuid}"]`);
                let inlineChilds = c.findAllChildByClass(blockEl, "inline");
                inlineChilds.forEach((ic) => {
                    if (ic && !ic.classList.contains("done")) {
                        ic.classList.add("done");
                    }
                });
                let blockBodies = c.findAllChildByClass(blockEl, "block-body");
                blockBodies.forEach((bb) => {
                    if (bb && !bb.classList.contains("done")) {
                        bb.classList.add("done");
                    }
                });
            });
        } catch (err) { }
    })();
}

function _updateExcalidrawBlock(doc, ex) {
    let fel = ex.parentNode.parentNode.parentNode.parentNode.parentNode.children[1];
    if (fel) return;
    /*let externalLinkFound = c.findParentNode(ex, (p) => {
        return c.findAllChildByClass(p, "external-link").length > 0;
    });
    if (externalLinkFound) return;*/
    doc.querySelectorAll(".draw").forEach((d) => {
        d.parentNode.style.display = "none";
        d.style.display = "none";
    });
    
    let parentBlockEl = c.findParentNode(ex, (e) => {
        let blockId = e.getAttribute("blockid");
        return blockId !== "" && blockId !== null && blockId !== undefined;
    });
    console.log("parentBlockEl");
    console.log(parentBlockEl);
    if (!parentBlockEl) return;
    let parentBlockId = parentBlockEl.getAttribute("blockid");
    console.warn("parentBlockId: " + parentBlockId);
    //let graphPathObj = await logseq.App.getCurrentGraph();
    //let graphPath = graphPathObj.path.toString();
    let graphPath = parent.window.logseq.api.get_user_configs().currentGraph.replaceAll("logseq_local_", "");
    if (!graphPath) return;
    graphPath = graphPath.replaceAll("logseq_local_", "");

    //let parentBlock = await logseq.Editor.getBlock(parentBlockId);
    let parentBlock = parent.window.logseq.api.get_block(parentBlockId);
    let parentBlockNode = doc.querySelector("div[blockid='" + parentBlock.uuid + "']")
    console.log("parentBlockNode: " + parentBlockNode);
    console.log(parentBlockNode);
    if (!parentBlock) return;
    let blockContent = parentBlock.content;
    if (blockContent) {
        let drawPathMatch = blockContent.match(/\[(.*?)\]/);
        if (!drawPathMatch) return;
        let drawPath = drawPathMatch[1].replaceAll("[", "");

        let fullPath = "vscode://file" + graphPath + "/" + drawPath;
        let drawName = blockContent.match(/\(([^)]+)\)/);
        if (drawName) drawName = drawName[1];

        let excaliLink = doc.createElement("a");
        excaliLink.href = fullPath;
        if (drawName) excaliLink.text = drawName;
        else excaliLink.text = drawPath;
        excaliLink.target = "_blank";
        excaliLink.classList.add("external-link");
        let drawNode = parentBlockNode.querySelector(".draw");
        if (drawNode && drawNode.parentNode.parentNode) {
            let flexOneParent = drawNode.parentNode.parentNode; //flex-1
            flexOneParent.appendChild(excaliLink);
        }
    }
}

export function updateExcalidraw(doc) {
    doc.querySelectorAll(".excalidraw-container").forEach((ec) => {
        _updateExcalidrawBlock(doc, ec);
    });
    /*let ecList = [];
    doc.querySelectorAll(".excalidraw-container").forEach((ec) => {
        ecList.push(ec);
    });
    (async () => {
        await Promise.all(ecList.map(async (ex) => {
            await _updateExcalidrawBlock(doc, ex);
        }));
    })();*/
}