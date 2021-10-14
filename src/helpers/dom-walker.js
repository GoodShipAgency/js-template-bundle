/**
 *
 * @param el {node} - subject node
 * @param tag {string} - tag name
 * @param className - class name
 * @returns {{node}|*|null} - returns element or null
 */
function walkParents(el, tag, className) {
    tag = tag ? tag.toUpperCase() : null;

    while (el.parentNode) {
        el = el.parentNode;
        if (tag && el.tagName === tag) {
            return el;
        }

        if (className && el.classList && el.classList.contains(className)) {
            return el;
        }
    }
    return null;
}

export default walkParents;