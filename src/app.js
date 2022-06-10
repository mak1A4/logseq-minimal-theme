import '@logseq/libs';
import { startObserving } from "./lib/common";
import * as page from "./lib/page";
import * as prop from "./lib/properties";
import * as block from "./lib/block";
import * as sidebar from "./lib/sidebar";

const main = () => {

    const doc = parent.document;
    const appContainer = doc.getElementById("app-container");

    startObserving(() => {
        doc.querySelectorAll("div.ls-block:not([hasobs])").forEach((lsBlock) => {
            console.log("lsBlock: " + lsBlock);
            startObserving((mutationRecordArray, mutationObserver) => {
                console.log("lsBlock::mut");
                prop.updateProperties(doc);
                page.updateBreadcrumbs(doc);
                block.changeDoneMarkerChildBlocks(doc);
                block.updateExcalidraw(doc);
            }, lsBlock);
            lsBlock.setAttribute("hasobs", true);
        });
    }, appContainer, 100);

    startObserving(() => {
        sidebar.fixIndentation(doc);
        page.updateRecentItemNamespace(doc);
    }, doc.querySelector("div.left-sidebar-inner"), 100);
};
logseq.ready(main).catch(console.error);