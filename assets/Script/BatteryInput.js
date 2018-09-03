// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var DeviceInput = require('DeviceInput');

cc.Class({
    extends: DeviceInput,

    properties: {
        image1: cc.Node,
        image2: cc.Node,
        image3: cc.Node,
        image4: cc.Node,
        image5: cc.Node,
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.image1_ani = this.image1.getComponent("PipeAnimation");
        this.image2_ani = this.image2.getComponent("PipeAnimation");
        this.image3_ani = this.image3.getComponent("PipeAnimation");
        this.image4_ani = this.image4.getComponent("PipeAnimation");
        this.image5_ani = this.image5.getComponent("PipeAnimation");
        this.image1 = this.image1.getComponent(cc.Sprite);
        this.image2 = this.image2.getComponent(cc.Sprite);
        this.image3 = this.image3.getComponent(cc.Sprite);
        this.image4 = this.image4.getComponent(cc.Sprite);
        this.image5 = this.image5.getComponent(cc.Sprite);
    },

    start () {

    },

    update (dt) {
        this._super(dt);
    },
    on_value_change(value) {
        this._super();
        var ani1 = this.image1_ani;
        var ani2 = this.image2_ani;
        var ani3 = this.image3_ani;
        var ani4 = this.image4_ani;
        var ani5 = this.image5_ani;
        ani1.stop();
        ani2.stop();
        ani3.stop();
        ani4.stop();
        ani5.stop();

        if (value == '主路供电') {
            ani5.play = 'image5_2';
            ani4.play = 'image4_2_2_2';
            ani3.play = 'image3_0_2_2';
        }
        if (value == '电池供电') {
            ani4.play = 'image4_0_2_3';
            ani3.play = 'image3_0_2_2';
        }
    },
});
