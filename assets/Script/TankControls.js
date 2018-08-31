// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Form = require('TanksForm');

cc.Class({
    extends: cc.Component,

    properties: {
        ValueTopLeft: cc.Sprite,
        ValueTopRight: cc.Sprite,
        ValueMiddle: cc.Sprite,
        ValueBottomLeft: cc.Sprite,
        ValueBottomRight: cc.Sprite,
        RightMotor: cc.Sprite,
        LeftMotor: cc.Sprite,
        TextLeft: cc.RichText,
        TextRight: cc.RichText,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {

    },

    // update (dt) {},
});
