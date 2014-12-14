/**
 *
 * @class App.view.draw.ListPreview
 * @extend Ext.dataview.DataView
 * @author tnker
 */
Ext.define('App.view.draw.ListPreview', {

    extend: 'Ext.Container',

    requires: [
        'App.view.draw.Draw',
        'Ext.draw.Component',
        'Ext.dataview.DataView'
    ],

    xtype: 'drawlistpreview',

    config: {

        cls: 'app-drawlistpreview',

        layout: 'fit',

        items: [{

            xtype: 'exdraw',

            listeners: {
                element: 'element',
                touchstart: function(e) {
                    var pos     = this.getMatrixXY(e.pageX, e.pageY),
                        x       = pos.x,
                        y       = pos.y,
                        sprite;

                    // タップ座標に該当するスプライトの取得
                    sprite = this.getPointItem(x, y);
                    // 該当するスプライトがあればzIndex再設定
                    if (sprite) {
                        sprite.setAttributes({
                            zIndex: this.getTopIndex()
                        });
                        // 監視対象に登録
                        this.setTouchSprite(sprite);
                        // 初期タッチ座標保持
                        this.setStartTouchPoint(pos);
                        // 再レンダリング
                        this.getSurface().renderFrame();
                    }
                },
                touchmove: function(e) {
                    var sprite  = this.getTouchSprite(),
                        pos     = this.getMatrixXY(e.pageX, e.pageY),
                        fpos    = this.getStartTouchPoint(),
                        fspos   = this.getStartSpritePoint();

                    // 監視対象のスプライトが登録されていれば座標計算処理
                    if (sprite) {
                        sprite.setAttributes({
                            x: fspos.x + (pos.x - fpos.x),
                            y: fspos.y + (pos.y - fpos.y)
                        });
                        // 再レンダリング
                        this.getSurface().renderFrame();
                    }

                },
                touchend: function(e) {
                    // 監視対象のスプライト解放
                    this.setTouchSprite(null);
                    // 再レンダリング
                    this.getSurface().renderFrame();
                },
                longpress: function(e) {
                    var sprite = this.getTouchSprite();

                    if (sprite) {
                        // 削除確認のアクションシート表示
                        this.showRemoveSheet(sprite);
                        // touchendが発火しないため先に参照削除
                        this.setTouchSprite(null);
                    }
                }
            }

        }, {

            xtype: 'dataview',

            docked: 'right',

            width: 70,

            store: 'Tumblr',

            itemTpl: '<div style="background-image:url({thumbnail})"></div>',

            listeners: {
                itemtap: function(c, i, item, r) {
                    var cvs = c.up('drawlistpreview').down('exdraw'),
                        idx = cvs.getTopIndex(),
                        sprite;

                    sprite = cvs.getSurface().add({
                        type: 'image',
                        width: 80,
                        height: 80,
                        src: r.get('thumbnail'),
                        zIndex: idx
                    }).show(true);

                    cvs.getSurface().renderFrame();
                }
            }

        }],

        listeners: {
            show: 'onShow',
            hide: 'onHide'
        }

    },

    /**
     *
     * @property _renderer
     */
    _renderer: null,

    /**
     *
     * @property _fps
     */
    _fps: 60,

    /**
     *
     *
     */
    initialize: function() {

        var me = this;

        me.callParent(arguments);

        me._surface = me.down('draw').getSurface('main');

    },

    /**
     *
     *
     */
    onShow: function() {

        var me = this;

        me._renderer = setInterval(me.onEnterFrame, 1000 / me._fps);

    },

    /**
     *
     *
     */
    onHide: function() {

        var me = this;

        if (me._renderer) {
            clearInterval(me._renderer);
            me._renderer = null;
        }

    },

    /**
     *
     *
     */
    onEnterFrame: function() {

        var me = this;

        if (me._surface) {
            me._surface.renderFrame();
        }

    }

});
