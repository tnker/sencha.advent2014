/**
 *
 * @class App.plugin.ToolbarAutoHide
 * @extend Ext.plugin.Abstract
 * @author tnker
 */
Ext.define('App.plugin.ToolbarAutoHide', {
    alias: 'plugin.toolbarautohide',
    config: {
        cmp: null,
        bar: null
    },
    _startPoint: {
        x: 0,
        y: 0
    },
    init: function(c) {
        var me = this, items, bar;
        if (c) {
            me.setCmp(c);
            items = c.getDockedItems();
            bar = Ext.Array.filter(items, function(item) {
                return item.getDocked() === 'top';
            });
            bar = bar.length ? bar[0] : null;
            me.events();
        }
        if (bar) {
            me.setBar(bar);
            bar.setConfig({
                zIndex  : 100,
                width   : '100%',
                style   : {
                    'position'  : 'absolute',
                    'opacity'   : '0.9'
                }
            });
            c.setConfig({
                padding: '50 0 0 0'
            });
        }
    },
    events: function() {
        var me  = this,
            cmp = me.getCmp(),
            scl = cmp.getScrollable().getScroller();
        scl.on({
            scrollstart : me.onStart,
            scroll      : me.onScroll,
            scrollend   : me.onEnd,
            scope       : me
        });
    },
    onStart: function(c, x, y) {
        var me = this,
            bar = me.getBar(),
            el  = bar.element;
        me._startPoint = {
            x: x,
            y: y + (el.translateY || 0)
        };
    },
    onScroll: function(c, x, y) {
        var me  = this,
            sp  = me._startPoint,
            bar = me.getBar(),
            el  = bar.element,
            offset;
        if (!Ext.isEmpty(sp)) {
            if (y < 0) {
                offset = 0;
            } else {
                offset = sp.y - y;
                if (offset > 0) {
                    offset = 0;
                }
                if (offset < -el.getHeight()) {
                    offset = -el.getHeight();
                }
            }
            el.translate(0, offset, 0);
            el.translateY = offset;
        }
    },
    onEnd: function(c, x, y) {
        var me = this;
        me.onScroll(c, x, y);

    }
});
