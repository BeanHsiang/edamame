host = {
    taobao: "item.taobao.com",
    tmall: "detail.tmall.com"
};

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

tool = {
    getPriceHistoryUrl: function (src) {
        var ar = src.split("&");
        var nid = "";
        for (var i = 0; i < ar.length; i++) {
            var r = ar[i].split("=");
            if (r.length != 2) {
                continue;
            }
            var k = r[0];
            var v = r[1];
            if (k === "id") {
                nid = v;
                break;
            }
        }
        return "http://ok.etao.com/api/price_history.do?nid=" + nid;
    },
    getRebateUrl: function (src) {
        var d = document, e = encodeURIComponent,
//            s1 = window.getSelection,
//            s2 = d.getSelection,
//            s3 = d.selection,
//            s = s1 ? s1() : s2 ? s2() : s3 ? s3.createRange().text : '',
            r = 'http://ok.etao.com/item.htm?tb_lm_id=t_fangshan_wuzhao&url=' + e(src) + '&rebatepartner=182&initiative_id=' + new Date().Format("yyyyMMdd");
        return r;
    },
    isTargetPage: function (src) {
        var re = /\/\/([^\?]*)/;
        for (var name in host) {
            var r = src.match(re);
            if (r && r[1] && r[1].indexOf(host[name]) > -1) {
                return true;
            }
        }
        return false;
    }
};

jQuery.extend({
    //获取系统时间
    getSystemTime: function () {
        return new Date();
    },
    //异步获取服务器时间
    getServerTime_async: function (success) {
        $.ajax({
            type: "HEAD",
            cache: false,
            complete: function (xhr) {
                var str = xhr.getResponseHeader("Date");
                var now = null;
                if (str != null)
                    now = new Date(str);
                if ($.isFunction(success))
                    success(now);
            }
        });
    },
    //同步获取服务器时间
    getServerTime: function () {
        var xhr = $.ajax({
            url: "http://tejia.taobao.com/one.htm?" + Math.random(),
            type: "HEAD",
            cache: false,
            async: false
        });
        var str = xhr.getResponseHeader("Date");
        if (str == null)
            return null;
        return new Date(str);
    }
});