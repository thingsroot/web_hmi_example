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
        value: cc.EditBox,
        apply: cc.Button,
        confirm: {
            default: null,
            type: cc.Node,
            tooltip: "The warning dialog node which has 'ConfirmDlg' script"
        },
        warning: {
            default: "",
            type: cc.String,
            tooltip: "Warning tips"
        },
        prop: {
            default: "value",
            type: cc.String,
            tooltip: "Output property name"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.apply.node.on("click", this.on_apply_click, this);
        if (this.confirm)
            this.confirm = this.confirm.getComponent("ConfirmDlg");
    },

    start () {

    },

    // update (dt) {},

    on_apply_click(event) {
        if (!this.confirm) {
            this.send_output();
        } else {
            var warning = this.warning;
            if (warning.length == 0) {
                warning = "Do you want to change " + this.name + " to " + this.value.string;
            }
            var self = this;
            this.confirm.showDlg(warning, function() {
                self.send_output();
            });
        }
    },
    send_output() {
        var parent = this.node.parent;
        var device = parent.getComponent("Device");
        if (!device) {
            console.log("No device node found!");
            return;
        }
        var value = this.value.string;
        var prop = this.prop.string
        if (prop == 'value') {
            value = parseFloat(value);
        } else if (prop == 'int_value') {
            value = parseInt(value);
        }
        var self = this;
        var ret = device.send_output(function(id, code, data) {
            return self.output_callback(id, code, data);
        }, this.node.name, value, prop);
        
        if (ret) {
            this.apply.interactable = false;
        }
    },
    output_callback(id, code, data) {
        console.log(data.message);
        if (code == 'send_output') {
            if (data.result) {
                this.on_wait_result();
                return false; // Wait for output result
            }
            this.apply.interactable = true;
        }
        if (code == 'output_result') {
            this.on_wait_result_done();
            this.apply.interactable = true;
            if (data.result) {
                // TODO: Done!
            }
        }
    },
    on_wait_result() {
        this.apply.node.stopAllActions();
        var action = cc.blink(10, 30);
        this.apply.node.runAction(action);
    },
    on_wait_result_done() {
        this.apply.node.stopAllActions();
        this.apply.node.opacity = 0;
        var action = cc.fadeTo(1.0, 255);
        this.apply.node.runAction(action);
    }
});
