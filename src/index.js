import '@logseq/libs';
import { startObserving } from "./lib/common";
import * as page from "./lib/page";
import * as prop from "./lib/properties";
import * as block from "./lib/block";
import * as sidebar from "./lib/sidebar";

logseq.useSettingsSchema([{
    key: "disableExcalidrawReplace",
    title: "Disable external VSCode Link",
    description: `Disable the replacement of excalidraw intergration with an external VSCode Link.
    Please do a reload after changing this setting!`,
    type: "boolean",
    default: "false"
},
{
    key: "disableAllScripts",
    title: "Disable all theme related scripts",
    description: `This script contains some script for stuff I couldn't do with CSS, this setting will disable all scripts.
    Please do a reload after changing this setting!`,
    type: "boolean",
    default: "false"
}]);

const main = () => {
    let disableAllScripts = Boolean(logseq.settings.disableAllScripts);
    let disableExcalidrawReplace = Boolean(logseq.settings.disableExcalidrawReplace);
    if (disableAllScripts == true) return;

    const doc = parent.document;
    const appContainer = doc.getElementById("app-container");

    startObserving(() => {
        doc.querySelectorAll("div.ls-block:not([hasobs])").forEach((lsBlock) => {
            startObserving((mutationRecordArray, mutationObserver) => {
                prop.updateProperties(doc);
                page.updateBreadcrumbs(doc);
                block.changeDoneMarkerChildBlocks(doc);
                if (disableExcalidrawReplace == false) {
                    block.updateExcalidraw(doc);
                }
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