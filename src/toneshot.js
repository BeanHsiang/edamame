var re_content = /[^\u4e00-\u9fa5a-zA-Z]/g;
var pinyin = new Pinyin();
var timeHtml = '<div>服务器时间：<span style="font-size: 20px;margin-left: 10px;border:3px solid #FF6701" data-bind="text: currentFormatTime"></span><span style="font-size: 14px;margin-left: 15px" data-bind="visible: useTime() > 0"><span data-bind="text: useTime"></span>s</span></div>';
var localTime, serverTime, diffTime, intTimer;
var refreshBtn, stopTicks;
var intCaptchaId;
var startTime, endTime, useTime;

var timer = {
    currentTime: null,
    currentFormatTime: ko.observable(),
    useTime: ko.observable(0)
};

timer.setTime = function (time) {
    if (time) {
        timer.currentTime = time;
    }
    if (timer.currentTime.getSeconds() % 10 === 0) {
        localTime = new Date();
        timer.currentTime.setTime(localTime.getTime() + diffTime);
    }
    timer.currentFormatTime(timer.currentTime.Format("hh:mm:ss"));
};

timer.start = function () {
    timer.currentTime.setSeconds(timer.currentTime.getSeconds() + 1);
    timer.setTime();
};


//    var submitLimitTime = 2000;

function handleCaptcha() {
    var answer = $("#J_SecKill input.answer-input")[0];
    var btn = $$("#J_SecKill .J_Submit")[0];
    if (answer) {
        window.clearInterval(intCaptchaId);
        window.clearInterval(intTimer);
        startTime = new Date();
        $(answer).focus();
        $(answer).unbind("input").bind("input", function () {
            var ans = $(answer).val();
            //console.log(ans);
            if (re_content.test(ans)) {
                ans = ans.replace(re_content, "");
                $(answer).val(ans);
            }
        });
        $(answer).unbind("keydown").bind("keydown", function (e) {
            e.stopPropagation();
            if (e.keyCode == 13) {
                btn.click();
                endTime = new Date();
                useTime = endTime.getTime() - startTime.getTime();
                timer.useTime(useTime / 1000);
//                    console.log(useTime);
//                    if (useTime < submitLimitTime) {
//                        console.log("延迟时间");
//                        window.setTimeout(function () {
//                            btn.click();
//                        }, submitLimitTime - useTime);
//                    } else {

//                    }
                return false;
            }
            var ans = $(answer).val();
            if (e.keyCode == 49) {
                $(answer).val(pinyin.getFullChars(ans).toLowerCase());
                btn.click();
                return false;
            } else if (e.keyCode == 50) {
                $(answer).val(pinyin.getCamelChars(ans).toLowerCase());
                btn.click();
                return false;
            }
        });
//            $(answer).bind("keyup keypress", function (e) {
//                e.stopPropagation();
//            });
    } else if (timer.currentTime.getTime() >= stopTicks) {
        refreshBtn.click();
    }

//    if (refreshBtn.style.display == "none" || $("#J_SecKill").text().indexOf("秒杀已结束") > -1) {
//        window.clearInterval(intCaptchaId);
//        window.clearInterval(intTimer);
//        return;
//    }
}

$(function () {
    if (location.href.indexOf("http://miao.item.taobao.com/") > -1) {
        serverTime = $.getServerTime();
        localTime = new Date();
        diffTime = serverTime.getTime() - localTime.getTime();
        localTime = serverTime;
        timer.setTime(localTime);
//    timer.setTime($.getServerTime());
        $(timeHtml).insertAfter("#detail ul.tb-ms-end");
//        $("#J_isku").parent().append(timeHtml);
        ko.applyBindings(timer, $("#detail").get(0));
        intTimer = window.setInterval(timer.start, 1000);

        var timeStrArr = $("#J_SecKill .upper .time").text().split(":");
        var stopTime = new Date();
        stopTime.setHours(parseInt(timeStrArr[0]));
        stopTime.setMinutes(parseInt(timeStrArr[1]) - 1);
        stopTime.setSeconds(40);
        stopTime.setMilliseconds(0)
        stopTicks = stopTime.getTime();

        refreshBtn = $$("#J_SecKill .J_RefreshStatus")[0];
        if (refreshBtn) {
            intCaptchaId = window.setInterval(handleCaptcha, 80);
        }
    }
});