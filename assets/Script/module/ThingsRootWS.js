
let msg_id = 10000;
let auth_code = '123456789';
//let websocket_server = "ws://172.30.11.139:17654";
let websocket_server = "ws://cloud.thingsroot.com:17654";
let websocket = null;
let callback_map = {};

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


function init_websocket(code, options) {
    if (websocket) {
        return;
    }
    auth_code = code;
    try {
        websocket = new WebSocket(websocket_server);
    } catch(err) {
        console.error(err);
        setTimeout(function () {
            init_websocket(code, options);
        }, 3);
    }

    websocket.onopen = function (event) {
        console.log("Send Text WS was opened.");
        websocket.send(JSON.stringify({
            id: msg_id++,
            code: "login",
            data: auth_code
        }));
        if (options.open) {
            options.open(event);
        }
    };
    websocket.onmessage = function (event) {
        //console.log("response text msg: " + event.data);
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
        console.log("Send Text fired an error");
        if (options.error) {
            options.error(event);
        }
    };
    websocket.onclose = function (event) {
        console.log("WebSocket instance closed.");
        if (options.close) {
            options.close(event);
        }
        websocket = null;
        setTimeout(function () {
            init_websocket(code, options);
        }, 3);
    };
}

function close_websocket() {
    if (websocket) {
        websocket.close();
        websocket = null;
    }
}

function state_websocket() {
    if (websocket) {
        return websocket.readyState 
    }
}

function get_device() {
    gate_sn = get_url_param("gate");
    device_sn = get_url_param("device");

    gate_sn = gate_sn != null ? gate_sn : cc.sys.localStorage.getItem('gate');
    gate_sn = gate_sn != null ? gate_sn : cc.sys.localStorage.getItem('device');
    if (gate_sn == null || device_sn == null) {
        return null;
    }
    return gate_sn, device_sn;
}

function send_ws_request(callback, code, data) {
    if (data && websocket.readyState === WebSocket.OPEN) {
        if (callback) { callback_map[msg_id] = callback; }
        websocket.send(JSON.stringify({
            "id": msg_id++,
            "code": code,
            "data": data
        }));
        return true;
    } else {
        console.log("Data missing or WebSocket is not ready!");
    }
    return false;
}

function ping(callback) {
    send_ws_request(callback, "ping", "");
}

function device_data(device_sn, callback=null) {
    send_ws_request(callback, "device_data", device_sn);
}

function watch_device(device_sn) {
    send_ws_request(null, "device_sub", device_sn);
}

function unwatch_device(device_sn) {
    send_ws_request(null, "device_unsub", device_sn);
}

/*
 * gate_sn: FreeIOE device serial number: e.g. 2-30002-001813-00075
 * device_sn: Real device serial number: e.g. 2-30002-001813-00075.mobus1
 * output: Output name e.g. output_tag1
 * value: Output value
 * prop: Output property e.g. value  int_value string_value
*/
function send_output(callback, gate_sn, device_sn, output, value, prop) {
    var data = {
        device: gate_sn,
        data: {
            device: device_sn,
            output: output,
            value: value,
            prop: prop
        }
    }
    if (websocket.readyState === WebSocket.OPEN) {
        if (callback) { callback_map[msg_id] = callback; }
        websocket.send(JSON.stringify({
            "id": msg_id++,
            "code": "send_output",
            "data": data
        }));
        return true;
    }
    return false;
}

/*
 * gate_sn: FreeIOE device serial number: e.g. 2-30002-001813-00075
 * device_sn: Real device serial number: e.g. 2-30002-001813-00075.mobus1
 * cmd: Command name e.g. close_pump
 * param: Command param in dict.
*/
function send_command(callback, gate_sn, device_sn, cmd, param) {
    var data = {
        device: gate_sn,
        data: {
            device: device_sn,
            cmd: cmd,
            param: param,
        }
    }
    if (websocket.readyState === WebSocket.OPEN) {
        if (callback) { callback_map[msg_id] = callback; }
        websocket.send(JSON.stringify({
            "id": msg_id++,
            "code": "send_command",
            "data": data
        }));
        return true;
    }
    return false;
}

module.exports = {
    get_url_param: get_url_param,
    init: init_websocket,
    close: close_websocket,
    state: state_websocket,
    send_ws_request: send_ws_request,
    ping: ping,
    device_data: device_data,
    watch_device: watch_device,
    unwatch_device: unwatch_device,
    send_output, send_output,
    send_command, send_command,
};