
// var ThingsRoot = require('ThingsRoot');
var ThingsRootWS = require('ThingsRootWS');

cc.Class({
    extends: cc.Component,

    properties: {
        user_code:  {
            default: "1234567890",
            type: cc.String,
            tooltip: 'User auth code.'
        },
        gate_sn:  {
            default: "",
            type: cc.String,
            tooltip: 'Gate SN.'
        },
        device_sn:  {
            default: "",
            type: cc.String,
            tooltip: 'Device SN.'
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
    },

    start () {
        var self = this;
        this._ws = new ThingsRootWS(this.user_code, {
            message: function(id, code, data) {
                console.log('MESSAGE', code, id, data);
            },
            device_data: function(id, code, data) {
                console.log('DEVICE_DATA', id, data);
                self.set_device_data(data);
            },
            device_event: function(id, code, data) {
                console.log('EVENT', id, data);
            },
            device_status: function(id, code, data) {
                console.log('STATUS', id, data);
            },
            data: function(id, code, data) {
                console.log('DATA', id, data);
                self.set_input_data(data);
            },
            device: function(id, code, data) {
                console.log('DEVICE', id, data);
            },
            device_sub: function(id, code, data) {
                console.log('DEVICE_SUB', id, data);
            },
            login: function(id, code, data) {
                self._ws.watch_device(self.gate_sn);
                self._ws.watch_device(self.device_sn);
            }
        })
        /*
        ThingsRoot.init(this.user_code);
        this.do_fetch_data();
        this.schedule(function() {
            // 这里的 this 指向 component
            this.do_fetch_data();
        }, this.refresh_period);
        */
    },

    // update (dt) {},
    /*
    do_fetch_data() {
        var self = this;
        ThingsRoot.get_device_data(function(r, data){
            if (r) {
                self.set_device_data(data);
            }
        }, this.gate_sn, this.device_sn)
    },
    */
    set_input_data(data) {
        if (data.device == this.device_sn) {
            let children = this.node.children;
            for (var i = 0;  i < children.length; i++) {
                var node = children[i];
                var node_name= node.name;
                if (node_name + "/value" == data.input) {
                    var input = node.getComponent("DeviceInput");
                    if(input) {
                        input.value = data.value[1];
                        input.quality = data.value[2];
                    } else {
                        var sw = node.getComponent("DeviceSwitch");
                        if (sw) {
                            if (data.value[2] == 0) {
                                sw.value = data.value[1];
                            } else {
                                sw.value = -1;
                            }
                        }
                    }
                }
            }
        }
    },
    set_device_data(data) {
        let children = this.node.children;
        for (var i = 0;  i < children.length; i++) {
            var node = children[i];
            var node_name= node.name;
            var input = node.getComponent("DeviceInput");
            if (input) {
                var value = data[node_name];
                if (value) {
                    input.value = value.PV;
                    input.quality = value.Q;
                }
            } else {
                var sw = node.getComponent("DeviceSwitch");
                if (sw) {
                    var value = data[node_name];
                    if (value) {
                        if (value.Q == 0) {
                            sw.value = value.PV;
                        } else {
                            sw.value = -1;
                        }
                    }
                }
            }
        }
    },
    send_output(callback, output, value, prop) {
        return this._ws.send_output(callback, this.gate_sn, this.device_sn, output, value, prop);
    },
    send_command(callback, cmd, param) {
        return this._ws.send_command(callback, this.gate_sn, this.device_sn, cmd, param);
    }
});
