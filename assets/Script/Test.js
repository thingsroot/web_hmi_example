// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var ThingsRoot = require('ThingsRoot')

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        button: {
            default: null,
            type: cc.Button
        },
        pipe: {
            default: null,
            type: cc.Sprite
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Second!',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.label.string = this.text;
        var label2 = this.node.getChildByName("label2").getComponent(cc.Label);

        var name_str = ThingsRoot.get_url_param("name");
        if (name_str != null) {
            label2.string = name_str;
        }
        // 
        this.button.node.on("click", this.on_button_click, this)

        this.node.getChildByName("goto_tanks").on("click", function(event){
            cc.director.loadScene("tanks");
        })

        // Load pipes
        var self = this;
        cc.loader.loadRes("pipe/blue", cc.SpriteFrame, function (err, spriteFrame) {
            self.pipe.spriteFrame = spriteFrame;
        });
    },

    start () {
        this.schedule(function() {
            // 这里的 this 指向 component
            this.do_fetch_data();
        }, 5);
    },

    onDisable() {
        this.unschedule(this.do_fetch_data);
    },

    // update (dt) {},

    on_button_click(event) {
        event.interactable = false;

        // Load pipes
        var self = this;
        cc.loader.loadRes("pipe/red", cc.SpriteFrame, function (err, spriteFrame) {
            self.pipe.spriteFrame = spriteFrame;
        });
    },
    do_fetch_data() {
        this.label.string = "Before Query";
        var self = this;

        ThingsRoot.ping(function () {
            self.label.string = "Query 调用success";
        });
    }
});
