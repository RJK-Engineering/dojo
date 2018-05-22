define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom'
], function (declare, lang, dom) {
    return declare("rjk.MyModule", [], {
        vari: 0,

        setText: function (id, text) {
            var node = dom.byId(id);
            node.innerHTML = text;

            console.log('this', this);
            console.log('vari', this.vari);
            this.myFunc(lang.hitch(this, function() {
                console.log('node', node);
                console.log('vari', this. vari);
            }));
            this.vari++;
                console.log(this.vari);

            var ab = this;
            setTimeout(lang.hitch(ab, function() {
                this.vari++;
                console.log(this.vari);
            }), 1000);

                console.log(this.vari);
            this.vari++;
                console.log(this.vari);

                window.test = this;
        },

        myFunc: function (callback) {
            //console.log('vari = ' + this.vari);
            callback();
        }
    });
});
