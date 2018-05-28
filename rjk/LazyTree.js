define([
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/on",
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dijit/Tree",
    "dijit/tree/ObjectStoreModel",
    "dijit/tree/dndSource",
], function (array, declare, lang, aspect, on, Memory, Observable, Tree, ObjectStoreModel, dndSource) {
    return declare("rjk.LazyTree", [], {

        tree: null,
        store: null,

        constructor: function (store, root) {
            this.store = store;
            var loaded = new Memory({
                data: [ store.get(root) ]
            });

            console.log(loaded.idProperty);

            loaded.getChildren = function(object) {
                console.log(this.getIdentity(object));
                var children = this.query({parent: this.getIdentity(object)});
                // if (! children.length) {
                //     children = store.getChildren(object);
                //     array.forEach(children, function (child) {
                //         loaded.put(child);
                //     });
                // }
                return children;
            };
            aspect.around(loaded, "put", function(original){
                return function (obj, options) {
                    if (options && options.parent) {
                        obj.parent = options.parent.id;
                    }
                    return original.call(loaded, obj, options);
                }
            });

            loaded = new Observable(loaded);

            var model = new ObjectStoreModel({
                store: loaded,
                query: {id: 'world'}
            });

            this.tree = new Tree({
                model: model,
                dndController: dndSource
            });
            // var l = on(this.tree, "getChildren", function (item, node) {
            //     // console.log("sdf");
            //     console.log(item, node);
            //     // window.th = this;
            //     array.forEach(store.getChildren(item), function (child) {
            //         // // TODO remove click event instead of loaded check
            //         if (! loaded.get(loaded.getIdentity(child)))
            //             loaded.put(child);
            //     });
            //     // l.remove();
            // });
        },

        placeAt: function (node) {
            this.tree.placeAt(node);
        }
    });
});
