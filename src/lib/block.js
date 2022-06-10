import '@logseq/libs';
import * as c from "./common";

export function changeDoneMarkerChildBlocks(doc) {
    (async () => {
        let currentPage = await logseq.Editor.getCurrentPage();
        if (!currentPage.name) {
            currentPage = await logseq.Editor.getPage(currentPage.page.id);
        }
        if (!currentPage) {
            console.warn("Couldn't find current page");
        }
        let currentPageName = currentPage.name;

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
    })();
}

function _updateExcalidrawBlock(doc, ex) {
    let fel = ex.parentNode.parentNode.parentNode.parentNode.parentNode.children[1];
    if (fel) return;

    let parentBlockEl = c.findParentNode(ex, (e) => {
        let blockId = e.getAttribute("blockid");
        return blockId !== "" && blockId !== null && blockId !== undefined;
    });
    if (!parentBlockEl) return;
    let parentBlockId = parentBlockEl.getAttribute("blockid");
    doc.querySelectorAll(".draw").forEach((d) => {
        d.parentNode.style.display = "none";
        d.style.display = "none";
    });

    //let graphPathObj = await logseq.App.getCurrentGraph();
    //let graphPath = graphPathObj.path.toString();
    let graphPath = parent.window.logseq.api.get_user_configs().currentGraph.replaceAll("logseq_local_", "");
    if (!graphPath) return;
    graphPath = graphPath.replaceAll("logseq_local_", "");

    //let parentBlock = await logseq.Editor.getBlock(parentBlockId);
    let parentBlock = parent.window.logseq.api.get_block(parentBlockId); 
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
        try {
            let elm = ex;
            /*let pnode = findParentNode(elm, (e) => {
                if (e.className.toString() == "flex-1") {
                    return e.children[1].className == "external-link";
                }
                return false;
            });
            pnode.appendChild(excaliLink);*/
            let foundExtLink = elm.parentNode.parentNode.parentNode.parentNode.parentNode.children[1];
            if (!foundExtLink) {
                elm.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(excaliLink);
            }
        } catch (err) { }
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