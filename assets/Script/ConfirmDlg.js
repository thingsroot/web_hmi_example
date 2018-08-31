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
        yes: cc.Button,
        no: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        this.yes.node.on("click", function(event) {
            if (self._on_ok) {
                self._on_ok(event);
            }
            self.node.active = false;
        })
        this.no.node.on("click", function(event){
            self.node.active = false;
        })
    },

    showDlg(info, ok_func) {
        this.node.active = true;
        this.label.string = info;
        this._on_ok = ok_func;
    },

    start () {

    },

    // update (dt) {},
});
