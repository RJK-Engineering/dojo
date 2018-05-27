define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",

    "dojo/_base/fx",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/mouse",
    "dojo/on"
], function (declare, _WidgetBase, _TemplatedMixin,
    bfx, lang, win, constr, style, mouse, on) {

    declare("rjk.PopupBox", [_WidgetBase, _TemplatedMixin], {
        timeout: 5000,
        showDuration: 500,
        hideDuration: 200,
        hideAlertDuration: 200,

        width: 400,
        height: 200,
        margin: 10,
        border: "1px solid black",
        backgroundColor: "#fff",
        iconSize: 20,
        iconColor: "#73ad21",

        alertContainerNode: null,
        iconNode: null,
        timer: null,
        alerts: 0,

        templateString: "<div></div>",

        buildRendering: function(){
            this.inherited(arguments);

            this._getIconNode();
            this._getPopupNode();
        },

        _getIconNode(node) {
            var size = this.iconSize * 2;
            this.iconNode = constr.create("div", {
                style: {
                    display: "none",
                    position: "absolute",
                    width: size + "px",
                    height: size + "px",
                    right: this.margin + "px",
                    bottom: this.margin + "px",
                    'border-radius': this.iconSize + "px",
                    background: this.iconColor,
                    'z-index': 998
                }
            }, win.body(), "first");

            on(this.iconNode, mouse.enter, lang.hitch(this, "show"));
        },

        _getPopupNode: function(node) {
            this.alertContainerNode = constr.create("div", {
                style: {
                    border: this.border,
                    height: "100%"
                }
            });
            constr.place(this.alertContainerNode, this.domNode);
            style.set(this.domNode, {
                position: "absolute",
                overflow: "hidden",
                width: this.width + 'px',
                right: this.margin + "px",
                bottom: 0,
                opacity: 0,
                'background-color': this.backgroundColor,
                'z-index': 999
            });
            constr.place(this.domNode, win.body(), "first");

            // on(this.domNode, mouse.enter, lang.hitch(this, "show"));
            on(this.domNode, mouse.leave, lang.hitch(this, "hide"));
        },

        alert: function (text) {
            var node = constr.toDom('<div style="overflow: hidden">' + text + "<hr></div>");
            constr.place(node, this.alertContainerNode, "first");

            on(node, "click", lang.hitch(this, function (e) {
                bfx.animateProperty({
                    node: node,
                    properties: { height: 0 },
                    duration: this.hideAlertDuration,
                    onEnd: lang.hitch(node, function () {
                        this.parentNode.removeChild(this);
                    })
                }).play();

                this.alerts--;
                this.refeshIcon();
             }));

            this.alerts++;
            this.refeshIcon();
            this.show(this.timeout);
        },

        show: function (timeout) {
            clearTimeout(this.hideTimer);

            bfx.animateProperty({
                node: this.domNode,
                properties: {
                    height: this.height,
                    bottom: 0,
                    opacity: 1
                },
                duration: this.showDuration
            }).play();

            if (timeout != null)
                this.hideTimer = setTimeout(lang.hitch(this, function () {
                    this.hide();
                }), timeout + this.showDuration);
        },

        hide: function () {
            bfx.animateProperty({
                node: this.domNode,
                properties: {
                    height: 0,
                    bottom: 0,
                    opacity: 1
                },
                duration: this.hideDuration
            }).play();
        },

        refeshIcon() {
            style.set(this.iconNode, {
                display: this.alerts ? "inline-block" : "none"
            });
        }
    });
});
