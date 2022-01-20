/**
 *
 * @param el {node} - subject node
 * @param tag {string|null} - tag name
 * @param classNames{[]} - class name
 * @returns {{node}|*|null} - returns element or null
 */
export function walkParents(el, tag, classNames) {
    tag = tag ? tag.toUpperCase() : null;

    while (el.parentNode) {
        el = el.parentNode;
        if (tag && el.tagName === tag) {
            return el;
        }

        if (classNames && el.classList) {
            // Convert to array if it isn't one.
            if (!Array.isArray(classNames)) classNames = [classNames];

            if ([...el.classList].some((subject) => classNames.includes(subject))) return el;
        }
    }
    return null;
}
