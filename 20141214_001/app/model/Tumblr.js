/**
 *
 *
 */
Ext.define('App.model.Tumblr', {

    extend: 'Ext.data.Model',

    config: {

        fields: [{
            name    : 'url',
            type    : 'string',
            mapping : 'original_size.url'
        }, {
            name    : 'thumbnail',
            type    : 'string',
            mapping : 'alt_sizes[4].url'
        }, {
            name    : 'width',
            type    : 'int',
            mapping : 'original_size.width'
        }, {
            name    : 'height',
            type    : 'int',
            mapping : 'original_size.height'
        }],

        proxy: {
            type    : 'ajax',
            url     : 'resources/mock/tumblr.json',
            reader  : {
                type: 'json'
            }
        }

    }

});
