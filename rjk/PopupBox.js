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

            this._getIcon();
            this._getNode(opts.node);
            this._setEvents();
            this.resetPosition();
        },

        _getIcon() {
            var size = this.iconSize * 2;
            this.iconNode = constr.create("div", {
                style: {
                    position: "absolute",
                    width: size + "px",
                    left: window.innerWidth - size - this.margin + "px",
                    top: window.innerHeight - size - this.margin + "px",
                    'border-radius': this.iconSize + "px",
                    background: this.iconColor
                }
            }, win.body(), "first");

            on(this.iconNode, mouse.enter, lang.hitch(this, function () {
                this.show();
            }));
        },

        _getNode(node) {
            if (node !== null)
                if (typeof(node) === "string") {
                    this.node = dom.byId(node);
                    if (! this.node)
                        console.error("Node id " + node + " not found.");
                } else if (typeof(node) === "object")
                    this.node = node;

            if (this.node) {
                this.resetPosition();
                style.set(this.node, {
                    position: "absolute",
                    width: this.width + "px",
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
            var g = this.geom = geom.position(this.node);
            g.x = -this.margin + window.innerWidth - g.w;
            g.y = window.innerHeight;

            style.set(this.node, {
                left: g.x + "px",
                top: g.y + "px"
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
                    top: window.innerHeight - this.height,
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
                    top: window.innerHeight,
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
