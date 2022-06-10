import { findParentNode } from "./common";

export function updateProperties(doc) {
    let pnCheck = (elem) => {
        if (!elem) return false;
        if (elem.classList.contains("flex-row")) {
            try {
                return elem.children[0].children[1].children[0].classList.contains("bullet-container");
            } catch (err) { }
        }
        return false;
    };
    doc.querySelectorAll(".block-properties").forEach((bp) => {
        let propParentBlock = findParentNode(bp, pnCheck);
        propParentBlock.style.fontFamily = "Courier Prime";
        propParentBlock.style.fontSize = "10pt";
        propParentBlock.children[0].children[1].style.display = "none";

        let propBlockContentWrapper = findParentNode(bp, (x) => {
            return x.classList.contains("block-content-wrapper");
        });
        propBlockContentWrapper.style.borderLeft = "4px solid #697885";
        propBlockContentWrapper.style.paddingLeft = "10px";
    });
}