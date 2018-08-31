///
// ThingsRoot cloud user api SDK
//

let using_jquery = true;
var auth_code = "123456789";

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

function getUrl() {
    var url_base = "http://172.30.11.235:8808/proxy/api/method/"
    //var url_base = "http://127.0.0.1:8808/proxy/api/method/"
    return url_base;
}

function init_http_request(code) {
    auth_code = code;
    if (using_jquery) {
        jQuery.ajaxSetup({
            headers: { // 默认添加请求头
                "AuthorizationCode": auth_code,
                "Accept": "application/json; charset=utf-8"
            }
        });
    }
}

function http_get_request(api, data, callback) {
    let url = getUrl() + api;
    if (using_jquery) {
        jQuery.ajax({
            url: url,
            type: "GET",
            data: data,
            dataType: "json",
            success: function (data) {
                callback(true, data.message);
                console.info("调用success");
            },
            error: function(err) {
                callback(false, err);
                console.info("调用failed");
            }
        });
    } else {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                console.info("调用success");
                var response = xhr.responseText;
                console.log(response);
            } else {
                callback(false, xhr);
                console.info("调用failed");
            }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", "application/json; charset=utf-8");
        xhr.setRequestHeader("AuthorizationCode", auth_code);
        xhr.send(data);
    }
}

function http_post_request(api, data, callback) {
    let url = getUrl() + api;
    if (using_jquery) {
        jQuery.ajax({
            url: url,
            type: "POST",
            data: data,
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                callback(true, data.message);
                console.info("调用success");
            },
            error: function(err) {
                callback(false, err);
                console.info("调用failed");
            }
        });
    } else {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                console.info("调用success");
                var response = xhr.responseText;
                console.log(response);
            } else {
                callback(false, xhr);
                console.info("调用failed");
            }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", "application/json; charset=utf-8");
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.setRequestHeader("AuthorizationCode", auth_code);
        xhr.send(data);
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

function ping(callback) {
    http_get_request('iot.user_api.ping', null, callback);
}

function device_data(callback, gate_sn, device_sn) {
    http_get_request('iot.user_api.device_data', {sn: gate_sn, vsn:device_sn}, callback);
}

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
    http_post_request('iot.device_api.send_output', data, callback);
}

function send_command(callback, gate_sn, device_sn, cmd, param) {
    var data = {
        device: gate_sn,
        data: {
            device: device_sn,
            cmd: cmd,
            param: param,
        }
    }
    http_post_request('iot.device_api.send_command', data, callback);
}

function action_result(callback, id) {
    http_get_request('iot.device_api.get_action_result', {id: id}, callback);
}

module.exports = {
    get_url_param: get_url_param,
    init: init_http_request,
    ping: ping,
    device_data: device_data,
    send_output: send_output,
    send_command: send_command,
    action_result: action_result,
};
