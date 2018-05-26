define([
    "dojo/_base/declare",
    "dojo/ready",
    "dijit/_WidgetBase",

    "dojo/_base/window",
    "dojo/dom-construct",
], function (declare, ready, _WidgetBase, win, constr) {

    declare("rjk.MyWidget", [_WidgetBase], {

        buildRendering: function(){
            this.domNode = constr.create("button", {innerHTML: "push me"});
            console.log("buildRendering");
        },

        postCreate: function () {
            console.log("postCreate");
        },

        hi: function () {
            console.log("hi");
        }
    });

    ready(function(){
        (new rjk.MyWidget()).placeAt(win.body(), "first");
    });
});
