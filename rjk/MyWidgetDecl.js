define([
    "dojo/_base/declare",
    "dijit/_WidgetBase"
], function (declare, _WidgetBase) {

    declare("rjk.MyWidgetDecl", [_WidgetBase], {

        postCreate: function () {
            console.log("postCreate");
        },

        hi: function () {
            console.log("hi");
        }
    });
});
