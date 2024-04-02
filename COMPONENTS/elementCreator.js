function createElement(type, attributes, ...children) {
    const elem = document.createElement(type);
    for (const [attr, value] of Object.entries(attributes)) {
        if (attr in elem) {
            elem[attr] = value;
        } else {
            elem.setAttribute(attr, value);
        }
    }
    for (const child of children) {
        if (typeof child === 'string') {
            elem.appendChild(document.createTextNode(child));
        } else {
            elem.appendChild(child);
        }
    }
    return elem;
}

module.exports = { createElement };