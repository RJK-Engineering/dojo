define([
    "dojo/_base/declare",
    "dojo/_base/fx",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/mouse",
    "dojo/on",
], function (declare, bfx, lang, win, dom, constr, geom, style, mouse, on) {
    return declare("rjk.PopupBox", [], {
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

        node: null,
        iconNode: null,
        geom: null,
        timer: null,
        alerts: 0,

        constructor: function (opts) {
            lang.mixin(this, opts);
            if (! opts)
                opts = {};
            else if (typeof(opts) === "string")
                opts = { node: opts };

            this._getIconNode(opts.iconNode);
            this._getPopupNode(opts.node);
            this._setEvents();
            this.resetPosition();
        },

        _getIconNode(node) {
            this.iconNode = this._getNode(node);

            if (this.iconNode) {
                style.set(this.iconNode, {
                    position: "absolute",
                    width: this.iconSize * 2 + "px",
                    height: 0,
                    'z-index': 998
                });
            } else {
                var size = this.iconSize * 2;
                this.iconNode = constr.create("div", {
                    style: {
                        position: "absolute",
                        width: size + "px",
                        right: this.margin + "px",
                        bottom: this.margin + "px",
                        'border-radius': this.iconSize + "px",
                        background: this.iconColor,
                        'z-index': 998
                    }
                }, win.body(), "first");
            }

            on(this.iconNode, mouse.enter, lang.hitch(this, function () {
                this.show();
            }));
        },

        _getPopupNode(node) {
            this.node = this._getNode(node);

            if (this.node) {
                style.set(this.node, {
                    position: "absolute",
                    width: this.width + "px",
                    height: 0,
                    'z-index': 999
                });
            } else {
                var attrs = {};
                attrs.style = {
                    position: "absolute",
                    width: this.width + 'px',
                    border: this.border,
                    'background-color': this.backgroundColor,
                    'z-index': 999
                };
                this.node = constr.create("div", attrs, win.body(), "first");
            }
        },

        _getNode(node) {
            var n;
            if (node !== null)
                if (typeof(node) === "string")
                    if (! (n = dom.byId(node)))
                        console.error("Node id " + node + " not found.");
                else if (typeof(node) === "object")
                    n = node;

            return n;
        },

        _setEvents: function () {
            on(window, "resize", lang.hitch(this, function(e) {
                this.resetPosition();
            }));
            on(this.node, mouse.enter, lang.hitch(this, function (argument) {
                clearTimeout(this.timer);
            }));
            on(this.node, mouse.leave, lang.hitch(this, function (argument) {
                this.hide();
            }));
        },

        resetPosition: function () {
            style.set(this.node, {
                height: 0,
                right: this.margin + "px",
                bottom: 0
            });
            style.set(this.iconNode, {
                right: this.margin + "px",
                bottom: this.margin + "px",
            });
        },

        alert: function (text) {
            var node = constr.toDom('<div style="overflow: hidden">' + text + "<hr></div>");
            constr.place(node, this.node, "first");

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
            this.show();

            this.timer = setTimeout(lang.hitch(this, function () {
                this.hide();
            }), this.timeout + this.showDuration);
        },

        show: function () {
            clearTimeout(this.timer);
            this.resetPosition();

            bfx.animateProperty({
                node: this.node,
                properties: {
                    height: this.height,
                    bottom: 0,
                    opacity: 100
                },
                duration: this.showDuration
            }).play();
        },

        hide: function () {
            bfx.animateProperty({
                node: this.node,
                properties: {
                    height: 0,
                    bottom: 0,
                    opacity: 0
                },
                duration: this.hideDuration
            }).play();
        },

        refeshIcon() {
            style.set(this.iconNode, {
                height: (this.alerts ? this.iconSize * 2 : 0) + "px"
            });
        }
    });
});
