if (location.href.indexOf("http://miao.item.taobao.com/") > -1) {
    var re_quanpin = /(.+)(?=1)/g;
    var re_shouzimu = /(.+)(?=2)/g;
    var re_content = /[^\u4e00-\u9fa5a-zA-Z1-2]/g;
    var pinyin = new Pinyin();
    var timeHtml = '<div>服务器时间：<span style="font-size: 20px;margin-left: 10px" data-bind="text: currentFormatTime"></span></div>';
    var localTime, serverTime, diffTime, intTimer;
    var timer = {
        currentTime: null,
        currentFormatTime: ko.observable()
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

//    var startTime, endTime, useTime;
//    var submitLimitTime = 2000;

    function handleCaptcha() {
        var answer = $("#J_SecKill input.answer-input")[0];
        var btn = $$("#J_SecKill .J_Submit")[0];
        if (answer) {
            window.clearInterval(intRefreshId);
            window.clearInterval(intCaptchaId);
            window.clearInterval(intTimer);
//            startTime = new Date();
//            $(answer).unbind()
            $(answer).focus();
            $(answer).bind("input", function () {
                var ans = $(answer).val();
                //console.log(ans);
                if (re_content.test(ans)) {
                    ans = ans.replace(re_content, "");
                    $(answer).val(ans);
                }
                if (re_quanpin.test(ans)) {
                    var oldanswer = ans.match(re_quanpin)[0];
                    $(answer).val(pinyin.getFullChars(oldanswer).toLowerCase());
                    btn.click();
                } else if (re_shouzimu.test(ans)) {
                    var oldanswer = ans.match(re_shouzimu)[0];
                    $(answer).val(pinyin.getCamelChars(oldanswer).toLowerCase());
                    btn.click();
                }
            });
            $(answer).bind("keydown", function (e) {
//                e.stopPropagation();
                if (e.keyCode === 13) {
//                    endTime = new Date();
//                    useTime = endTime.getTime() - startTime.getTime();
//                    console.log(useTime);
//                    if (useTime < submitLimitTime) {
//                        console.log("延迟时间");
//                        window.setTimeout(function () {
//                            btn.click();
//                        }, submitLimitTime - useTime);
//                    } else {
                    btn.click();
//                    }
                }
            });
//            $(answer).bind("keyup keypress", function (e) {
//                e.stopPropagation();
//            });
        }
    }

    var refreshBtn = $$("#J_SecKill .J_RefreshStatus")[0];
    var intRefreshId, intCaptchaId;

    function handleRefresh() {
        refreshBtn.click();
    }

    if (refreshBtn && refreshBtn.style.display != "none" && $("#J_SecKill").text().indexOf("秒杀已结束") == -1) {
        intRefreshId = window.setInterval(handleRefresh, 100);
        intCaptchaId = window.setInterval(handleCaptcha, 80);
    }

    $(function () {
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
    });
}