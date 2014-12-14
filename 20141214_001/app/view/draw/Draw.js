/**
 *
 * @class App.view.draw.Draw
 * @extend Ext.draw.Component
 * @author tnker
 */
Ext.define('App.view.draw.Draw', {

    extend: 'Ext.draw.Component',

    requires: [
        'Ext.ActionSheet'
    ],

    xtype: 'exdraw',

    config: {

        /**
         * タッチ中の監視対象スプライト
         * @config {Ext.draw.sprite.Sprite}
         */
        touchSprite: null,

        startTouchPoint: null,

        startSpritePoint: null,

        sheet: {
            remove: {
                xtype: 'actionsheet',
                items: [{
                    text    : 'スプライトを削除する',
                    handler : function(c) {
                        var o = c.up('viewport').down('exdraw'),
                            a = c.up('actionsheet');
                        o.fireEvent('removesprite', a, o);
                    }
                }, {
                    text    : 'キャンセル',
                    handler : function(c) {
                        var o = c.up('viewport').down('exdraw'),
                            a = c.up('actionsheet');
                        o.fireEvent('actioncancel', a, o);
                    }
                }]
            }
        }

    },

    initialize: function() {

        var me = this;

        me.on({
            'removesprite': 'onRemoveAction',
            'actioncancel': 'onSheetHide'
        });

        me.callParent(arguments);

    },

    applyTouchSprite: function(v) {
        if (v === null || v.isSprite) {
            return v;
        } else {
            throw new Error('nessesary null or sprite');
        }
    },

    updateTouchSprite: function(n) {
        if (n !== null && n.isSprite) {
            this.setStartSpritePoint({
                x: n.attr.x,
                y: n.attr.y
            });
        }
    },

    /**
     * Surfaceに格納されているitemsを直接取得
     * するためのgetter
     *
     * @return {array}
     */
    getSurfaceItems: function() {
        return this.getSurface().getItems();
    },

    /**
     *
     * @param {number} x
     * @param {number} y
     * @return {object}
     */
    getMatrixXY: function(x, y) {
        var me      = this,
            items   = me.getSurfaceItems(),
            cx      = 0,
            cy      = 0,
            mat;

        if (items && items.length) {
            mat = items[0].attr.inverseMatrix;
            cx  = mat.x(x, y);
            cy  = mat.y(x, y);
        }

        return {
            x: cx,
            y: cy
        };
    },

    /**
     *
     * @param {number} x
     * @param {number} y
     * @return {Ext.draw.sprite.Sprite[]}
     */
    getPointItems: function(x, y) {
        var me      = this,
            items   = me.getSurfaceItems(),
            len     = items.length,
            sprites = [],
            item, bbox;

        for (var i = 0; i < len; i++) {
            item = items[i];
            bbox = item.getBBox(true);
            if (bbox.x <= x &&
                x <= bbox.x + bbox.width &&
                bbox.y <= y &&
                bbox.y <= bbox.y + bbox.height) {
                if (item.attr.path.isPointInPath(x, y)) {
                    sprites.push(item);
                }
            }
        }

        return sprites;
    },

    /**
     *
     * @param {number} x
     * @param {number} y
     * @return {Ext.draw.sprite.Sprite}
     */
    getPointItem: function(x, y) {
        var me      = this,
            comps   = me.getPointItems(x, y),
            cIndexs = me.pluckZIndex(comps),
            cMax    = Ext.Array.max(cIndexs),
            sprite;

        // 最上位のzIndexに該当するスプライを取得
        sprite = Ext.Array.filter(comps, function(comp) {
            return comp.attr.zIndex === cMax;
        });

        return Ext.isArray(sprite) ? sprite[0] : null;
    },

    /**
     *
     * @return {number} 
     */
    getTopIndex: function() {
        var me      = this,
            iIndexs = me.pluckZIndex(),
            iMax    = Ext.Array.max(iIndexs);

        return iMax + 1;
    },

    /**
     *
     *
     */
    pluckZIndex: function(v) {
        if (Ext.isEmpty(v)) {
            v = this.getSurfaceItems();
        }
        return Ext.Array.pluck(
            Ext.Array.pluck(v, 'attr'),
            'zIndex'
        );
    },

    showRemoveSheet: function(sprite) {

        var me      = this,
            sheet   = me.getSheet() || {},
            remove  = sheet.remove;

        if (remove) {
            sheet = Ext.Viewport.add(remove).show();
            sheet.actionTarget = sprite;
        }
    },

    onRemoveAction: function(c, o) {
        var s = c.actionTarget;
        if (s && s.isSprite) {
            s.destroy();
        }
        s = null;
        this.onSheetHide(c, o);
    },

    onSheetHide: function(c, o) {
        c.hide().destroy();
        o.getSurface().renderFrame();
    }

});
