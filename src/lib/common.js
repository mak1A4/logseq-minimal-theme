function _throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = setTimeout(() => (inThrottle = false), limit);
        }
    };
}
export function startObserving(obsFn, target, throttleLimit) {
    if (throttleLimit) {
        obsFn = _throttle(obsFn, throttleLimit);
    }
    const obs = new MutationObserver(obsFn);
    obs.observe(target, {
        subtree: true,
        attributes: true,
    });
    setTimeout(obsFn, 100);
}
export function findParentNode(el, checkFn) {
    while (el.parentNode) {
        el = el.parentNode;
        if (checkFn(el)) return el;
    }
    return null;
}
export function findAllChildByClass(element, className) {
    var foundElements = [], found;
    function recurse(element, className, found) {
        if (!element || !element.childNodes) return;
        for (var i = 0; i < element.childNodes.length && !found; i++) {
            var el = element.childNodes[i];
            var classes = el.className != undefined ? el.className.toString().split(" ") : [];
            for (var j = 0, jl = classes.length; j < jl; j++) {
                if (classes[j] == className) {
                    foundElements.push(element.childNodes[i]);
                }
            }
            recurse(element.childNodes[i], className, found);
        }
    }
    recurse(element, className, false);
    return foundElements;
}
export function findFirstChildByClass(element, className) {
    var foundElement = null, found;
    function recurse(element, className, found) {
        if (!element || !element.childNodes) return;
        for (var i = 0; i < element.childNodes.length && !found; i++) {
            var el = element.childNodes[i];
            var classes = el.className != undefined ? el.className.toString().split(" ") : [];
            for (var j = 0, jl = classes.length; j < jl; j++) {
                if (classes[j] == className) {
                    found = true;
                    foundElement = element.childNodes[i];
                    break;
                }
            }
            if (found) break;
            recurse(element.childNodes[i], className, found);
        }
    }
    recurse(element, className, false);
    return foundElement;
}