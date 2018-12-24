
var silent = false;
function setresult(e) {
    if (silent) {
        return;
    }
    var lab = document.getElementsByName("request-output")[0];
    lab.innerText = e;
}

function query(key, value) {
    this.queries[key] = value;
    return this;
}

function header(key, value) {
    this.headers[key] = value;
    return this;
}

function method(m) {
    this.requestmethod = m;
    return this;
}

function get(path) {
    this.method("GET");
    this.path = path;
    return this;
}

function post(path) {
    this.method("POST");
    this.path = path;
    return this;
}

function del(path) {
    this.method("DELETE");
    this.path = path;
    return this;
}

function tls() {
    this.schema = "https";
    return this;
}

function json(obj) {
    this.jsonobj = obj;
    return this;
}

function timeout(milisecond) {
    this.timeout = milisecond;
    return this;
}

function onfailed(failedCallback) {
    this.failedCallback = failedCallback;
    return this;
}

function onsuccess(sucessCallback) {
    this.sucessCallback = sucessCallback;
    return this;
}

function dolog(enable) {
    this.enablelog = enable;
    return this;
}

function addr(a) {
    this.address = a;
    return this;
}

function dorequest() {
    url = this.schema + "://" + this.address + this.path;
    var queryForm = "";

    Object.keys(this.queries).forEach(key => {
        var value = this.queries[key];
        queryForm += '&' + key + "=" + value;
    });
    if (queryForm.length > 0) {
        url += '?' + queryForm.slice(1);
    }


    if (this.jsonobj != null) {
        this.body = JSON.stringify(this.jsonobj);
    }

    var xhr = this.request;
    xhr.timeout = this.timeout;
    var me = this;
    xhr.onload = function () {
        if (xhr.status != 200) {
            me.failedCallback("bad status:" + xhr.statusText);
            return;
        }
        var payload = JSON.parse(xhr.responseText);
        if (payload.result != true) {
            me.failedCallback("invoke failed,code：" + payload.mcode + " 附加信息：" + payload.message);
            return;
        }
        if (me.enablelog) {
            setresult("success");
        }
        me.sucessCallback(payload.data);
    }

    xhr.ontimeout = function () {
        me.failedCallback("invoke timeout");
    };

    xhr.error = function (e) {
        if (me.enablelog) {
            setresult("success");
        }
        me.failedCallback("unexpected error：" + e);
    }

    xhr.open(this.requestmethod, url);
    Object.keys(this.headers).forEach(key => {
        xhr.setRequestHeader(key, this.headers[key]);
    });
    xhr.send(this.body);
}

function Invoke() {
    this.queries = {};
    this.address = "127.0.0.1:8080";
    this.headers = { "Content-Type": "application/json" };
    this.json = json;
    this.query = query;
    this.header = header;
    this.addr = addr;
    this.post = post;
    this.get = get;
    this.header = header;
    this.dorequest = dorequest;
    this.method = method;
    this.onsuccess = onsuccess;
    this.dolog = dolog;
    this.del = del;

    this.enablelog = true;
    this.jsonobj = null;
    this.url = "";
    this.body = null;
    this.request = new XMLHttpRequest();
    this.schema = "http";
    this.timeout = 60000;
    this.requestmethod = "GET";
    this.failedCallback = function (e) {
        if (this.enablelog) {
            setresult(e);
        }
        return this;
    }
    this.sucessCallback = function (data) {
        return this;
    }
}   