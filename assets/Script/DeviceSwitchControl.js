// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        unknown: cc.SpriteFrame,
        close: cc.SpriteFrame,
        open: cc.SpriteFrame,
        reverse: false,
        state: {
            get () {
                return this._state;
            },
            set (value) {
                this._state = value;
                this.on_change_value(value);
            }
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
        this.state = -1;
    },

    on_change_value(value) {
        var sprite = this.getComponent(cc.Sprite);
        if (this.state == 0) {
            sprite.spriteFrame = this.reverse? this.close : this.open;
        }
        if (this.state == 1) {
            sprite.spriteFrame = this.reverse? this.open : this.close;
        }
        if (this.state == -1) {
            sprite.spriteFrame = this.unknown;
        }
    },

    get_switch_value() {
        if (this.state == 0){ return 1; }
        if (this.state == 1){ return 0; }
        if (this.state == -1){ return -1; }
    },
    
    update (dt) {
    },
});
