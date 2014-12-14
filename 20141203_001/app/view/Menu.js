/**
 *
 * @class App.view.Menu
 * @extend Ext.Container
 * @author tnker
 */
Ext.define('App.view.Menu', {
    extend: 'Ext.Container',
    xtype: 'slidemenu',
    config: {
        cls     : 'sidemenu',
        docked  : 'left',
        top     : 0,
        left    : 0,
        bottom  : 0,
        zIndex  : 0,
        padding : '0 0 0 0',
        open    : false,
        scrollable: 'vertical',
        defaults: {
            xtype       : 'button',
            textAlign   : 'left'
        },
        items: [{
            text: 'button1'
        }, {
            text: 'button2'
        }]
    },
    initialize: function() {
        var me = this;
        me.setWidth(200);
        me.callParent(arguments);
    },
    setParent: function(c) {
        var me = this;
        me.callParent(arguments);
        me.maskCmp = c.add({
            xtype   : 'component',
            cls     : 'sidemenu-mask',
            top     : 0,
            left    : me.getWidth(),
            bottom  : 0,
            width   : 9999,
            zIndex  : 5000,
            hidden  : true
        });
        me.maskCmp.element.on({
            scope   : me,
            touchend: 'onMaskRelease'
        });
    },
    onMaskRelease: function() {
        var me = this;
        me.setOpen(false);
    },
    destroy: function() {
        var me = this;
        me.maskCmp.destroy();
        delete me.maskCmp;
        me.callParent(arguments);
    },
    toggle: function(v) {
        var me = this;
        me.setOpen(Ext.isEmpty(v) ? !me.getOpen() : v);
    },
    updateOpen: function(v) {
        var me = this,
            up = me.up(),
            el;
        if (!up) {
            return;
        }
        el = up.innerElement;
        if (v) {
            el.translate(me.getWidth(), 0, 0);
            me.maskCmp.show();
        } else {
            el.translate(0, 0, 0);
            me.maskCmp.hide();
        }
    }
});
