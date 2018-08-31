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
        label: cc.RichText,
        quality:  {
            get () {
                return this._quality;
            },
            set (value) {
                this._quality = value;
            }
        },
        value: {
            get () {
                return this._value;
            },
            set (value) {
                this.on_value_change(value);
                this._value = value;
            }
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.value = 0;
        this.quality = -1;
    },

    update (dt) {
        if (this.quality == 0) {
            this.label.string = "<color=#00ff00>" + this.value +  "</color>";
        } else {
            this.label.string = "<color=#ff0000>" + this.value +  "</color>";
        }
    },
    on_value_change(value){
        this.label.node.stopAllActions();
        var action = cc.fadeIn(2.0);
        this.label.node.runAction(action);
    }
});
