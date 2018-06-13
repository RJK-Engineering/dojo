var exports = {};

// https://github.com/evilstreak/markdown-js

define([
    "dojo/query",
    "dojo/_base/array",
    "lib/markdown",
    "dojo/domReady!"
], function (query, array) {
    array.forEach(query('.markdown'), function (e) {
        e.innerHTML = exports.toHTML(e.innerHTML, 'Maruku');
    });
    return exports.Markdown;
});
