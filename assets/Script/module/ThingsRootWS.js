

function get_url_param(name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    //匹配目标参数
    var r = location.search.substr(1).match(reg);
    //返回参数值
    if (r != null) return unescape(r[2]);
    //不存在时返回null
    return null; 
}

class ThingsRootWS {
    constructor(auth_code, options) {
        this._auth_code = auth_code;
        this._options = options;
        this._websocket_server = "ws://cloud.thingsroot.com:17654";
        this._init_websocket();
        this._msg_id = 10000;
    }

    _init_websocket() {
        var self = this;
        var websocket = this._websocket;
        var auth_code = this._auth_code;
        var options = this._options;
        var websocket_server = this._websocket_server;
        var callback_map = {};
        var reinit = function() {
            this._init_websocket();
        }

        if (websocket) {
            return;
        }
        
        try {
            websocket = new WebSocket(websocket_server);
        } catch(err) {
            console.error(err);
            setTimeout(reinit, 3);
            return;
        }

        websocket.onopen = function (event) {
            console.log("Send Text WS was opened.");
            websocket.send(JSON.stringify({
                id: self._msg_id++,
                code: "login",
                data: auth_code
            }));
            if (options.open) {
                options.open(event);
            }
        };
        websocket.onmessage = function (event) {
            //show_log("response text msg: " + event.data);
            var data = Object.assign({}, JSON.parse(event.data));

            // Trigger callback if there is any.
            var cb = callback_map[data.id];
            if (cb) {
                if (cb(data.id, data.code, data.data) != false) {
                    callback_map[data.id] = null;
                }
            }

            var func = options[data.code];
            if (func) {
                func(data.id, data.code, data.data);
            } else {
                if (options.message) {
                    options.message(data.id, data.code, data.data);
                }
            }
        };
        websocket.onerror = function (event) {
            console.error("Send Text fired an error", event);
            if (options.error) {
                options.error(event);
            }
        };
        websocket.onclose = function (event) {
            console.log("WebSocket instance closed.", event);
            if (options.close) {
                options.close(event);
            }
            self._websocket = null;
            setTimeout(reinit, 3);
        };
        this._websocket = websocket;
    }
        
    close_websocket() {
        if (this._websocket) {
            this._websocket.close();
            this._websocket = null;
        }
    }

    state_websocket() {
        if (this._websocket) {
            return this._websocket.readyState;
        }
    }

    get_device() {
        gate_sn = get_url_param("gate");
        device_sn = get_url_param("device");

        gate_sn = gate_sn != null ? gate_sn : cc.sys.localStorage.getItem('gate');
        gate_sn = gate_sn != null ? gate_sn : cc.sys.localStorage.getItem('device');
        if (gate_sn == null || device_sn == null) {
            return null;
        }
        return gate_sn, device_sn;
    }

    send_ws_request(callback, code, data) {
        var websocket = this._websocket;
        if (data && websocket && websocket.readyState === WebSocket.OPEN) {
            if (callback) { callback_map[msg_id] = callback; }
            websocket.send(JSON.stringify({
                "id": this.msg_id++,
                "code": code,
                "data": data
            }));
            return true;
        } else {
            this._log("Data missing or WebSocket is not ready!");
        }
        return false;
    }

    ping(callback) {
        return this.send_ws_request(callback, "ping", "");
    }

    device_data(device_sn, callback=null) {
        return this.send_ws_request(callback, "device_data", device_sn);
    }

    watch_device(device_sn) {
        return this.send_ws_request(null, "device_sub", device_sn);
    }

    unwatch_device(device_sn) {
        return this.send_ws_request(null, "device_unsub", device_sn);
    }

    /*
    * gate_sn: FreeIOE device serial number: e.g. 2-30002-001813-00075
    * device_sn: Real device serial number: e.g. 2-30002-001813-00075.mobus1
    * output: Output name e.g. output_tag1
    * value: Output value
    * prop: Output property e.g. value  int_value string_value
    */
    send_output(callback, gate_sn, device_sn, output, value, prop) {
        var data = {
            device: gate_sn,
            data: {
                device: device_sn,
                output: output,
                value: value,
                prop: prop
            }
        }
        return this.send_ws_request(callback, 'send_output', data);
    }

    /*
    * gate_sn: FreeIOE device serial number: e.g. 2-30002-001813-00075
    * device_sn: Real device serial number: e.g. 2-30002-001813-00075.mobus1
    * cmd: Command name e.g. close_pump
    * param: Command param in dict.
    */
    send_command(callback, gate_sn, device_sn, cmd, param) {
        var data = {
            device: gate_sn,
            data: {
                device: device_sn,
                cmd: cmd,
                param: param,
            }
        }
        return this.send_ws_request(callback, 'send_command', data);
    }
}

module.exports = ThingsRootWS;