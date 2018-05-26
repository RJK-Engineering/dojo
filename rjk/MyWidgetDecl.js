define([
    "dojo/_base/declare",
    "dojo/parser",
    "dijit/_WidgetBase"
], function (declare, parser, _WidgetBase) {

    declare("rjk.MyWidgetDecl", [_WidgetBase], {

        postCreate: function () {
            console.log("postCreate");
        },

        hi: function () {
            console.log("hi");
        }
    });
});
