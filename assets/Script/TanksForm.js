// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var TanksForm = cc.Class({
    extends: cc.Component,

    properties: {
        Controls: cc.Node,
        ConfirmDlg: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    statics: {
        instance: null
    },

    // use this for initialization
    onLoad () {
        TanksForm.instance = this;
        this.Controls = this.Controls.getComponent('TanksControls');
        this.ConfirmDlg = this.ConfirmDlg.getComponent('ConfirmDlg');
    },

    start () {

    },

    // update (dt) {},
});
