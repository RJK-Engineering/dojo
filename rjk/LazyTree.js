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
                return this.query({parent: this.getIdentity(object)});
            };
            aspect.around(loaded, "put", function(originalPut){
                return function (obj, options) {
                    if (options && options.parent) {
                        obj.parent = options.parent.id;
                    }
                    return originalPut.call(loaded, obj, options);
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
            on(this.tree, "click", function (item, node) {
                array.forEach(store.getChildren(item), function (child) {
                    if (! loaded.get(loaded.getIdentity(child)))
                        loaded.put(child);
                });
            });
        },

        placeAt: function (node) {
            this.tree.placeAt(node);
        }
    });
});
