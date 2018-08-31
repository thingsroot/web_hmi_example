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
        switch_control: cc.Node,
        switch_name: {
            default: "",
            type: cc.String,
            tooltip: "Devic switch name"
        },
        output: {
            default: "",
            type: cc.String,
            tooltip: "Device Output name"
        },
        confirm: {
            default: null,
            type: cc.Node,
            tooltip: "The warning dialog node which has 'ConfirmDlg' script"
        },
        value: {
            get () {
                if (this.switch_control)
                    return this.switch_control.state;
            },
            set (value) {
                if (this.switch_control)
                    this.switch_control.state = value;
            }
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.switch_control.on("click", this.on_apply_click, this);
        this._switch_control_node = this.switch_control;
        this.switch_control = this.switch_control.getComponent("DeviceSwitchControl");
        if (this.confirm)
            this.confirm = this.confirm.getComponent("ConfirmDlg");
    },

    update (dt) {
    },

    on_apply_click(event) {
        var value = this.switch_control.get_switch_value();
        if (value == -1) {
            return;
        }
        if (!this.confirm) {
            this.send_output(value);
        } else {
            var self = this;
            this.confirm.showDlg(this.confirm_info(), function() {
                self.send_output(value);
            });
        }
    },
    confirm_info() {
        var state = this.switch_control.state;
        if (state == 0){ return "Do you want to close " + this.switch_name}
        if (state == 1){ return "Do you want to open " + this.switch_name}
        if (state == -1){ return "Current statue is unknow for " + this.switch_name}
    },

    send_output(value) {
        var parent = this.node.parent;
        var device = parent.getComponent("Device");
        if (!device) {
            console.log("No device node found!");
            return;
        }
        var self = this;
        var ret = device.send_output(function(id, code, data) {
            return self.output_callback(id, code, data);
        }, this.node.name, value, "int_value");
        
        if (ret) {
            this._switch_control_node.interactable = false;
        }
    },
    output_callback(id, code, data) {
        console.log(data.message);
        if (code == 'send_output') {
            if (data.result) {
                this.on_wait_result();
                return false; // Wait for output result
            }
            this._switch_control_node.interactable = true;
        }
        if (code == 'output_result') {
            this.on_wait_result_done();
            this._switch_control_node.interactable = true;
            if (data.result) {
                // TODO: Done!
            }
        }
    },
    on_wait_result() {
        this._switch_control_node.stopAllActions();
        var action = cc.blink(10, 30);
        this._switch_control_node.runAction(action);
    },
    on_wait_result_done() {
        this._switch_control_node.stopAllActions();
        this._switch_control_node.opacity = 0;
        var action = cc.fadeTo(1.0, 255);
        this._switch_control_node.runAction(action);
    }
});
