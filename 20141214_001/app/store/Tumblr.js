/**
 *
 *
 */
Ext.define('App.store.Tumblr', {

    extend: 'Ext.data.Store',

    requires: [
        'App.model.Tumblr'
    ],

    config: {

        storeId: 'Tumblr',

        model: 'App.model.Tumblr',

        autoLoad: true

    }

});
