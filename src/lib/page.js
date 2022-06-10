export function updateBreadcrumbs(doc) {
    let breadc = doc.querySelectorAll(".breadcrumb")[0];
    if (!breadc) return;
    breadc.querySelectorAll(".mx-2").forEach((m) => {
        m.innerHTML = "-->";
    });
};

export function updateRecentItemNamespace(doc) {
    doc.querySelectorAll(".recent-item").forEach((r) => {
        let linkEl = r.children[0];
        if (!linkEl) return;

        let titleAttr = r.getAttribute("title");
        let htmlContent = linkEl.innerHTML.replace(linkEl.innerText, "");
        if (linkEl.innerText.indexOf("/") >= 0) {
            linkEl.innerHTML = htmlContent + ".." + linkEl.innerText.substring(linkEl.innerText.lastIndexOf("/"));
        }
        else if (titleAttr && titleAttr.indexOf("_") >= 0) {
            linkEl.innerHTML = htmlContent + r.getAttribute("title");
        }
    });
}