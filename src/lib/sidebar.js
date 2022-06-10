import '@logseq/libs';

export function fixIndentation(doc) {
    const leftSidebar = doc.getElementById("left-sidebar");
    setTimeout(() => {
        if (!leftSidebar) return;
        leftSidebar.querySelectorAll(".ui__dropdown-trigger").forEach((e) => {
            let item = e.querySelector("a");
            if (!item) return;
            item.classList.remove("px-1");
            item.classList.add("px-2");
        });
    }, 250);
}