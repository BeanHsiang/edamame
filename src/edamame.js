function RebateInfo() {
    this.coupon = ko.observable();
    this.saving = ko.observable();
    this.isLogin = ko.observable();
    this.url = ko.observable();
    this.loginUrl = ko.observable();

    this.isEtaoLogin = ko.observable();
    this.loginEtaoUrl = ko.observable();

//    this.highPrice = ko.observable();
    this.lowPrice = ko.observable();
//    this.avgPrice = ko.observable();
    this.futurePrice = ko.observable();

    this.title = ko.computed(function () {
        return  !this.isLogin() ? "登录后重新点击此按钮" : !this.isEtaoLogin() ? "先登录一淘然后回到本页面重新点击此按钮" : "点击此按钮自动完成一淘优惠跳转";
    }, this);
    this.showUrl = ko.computed(function () {
        return  !this.isLogin() ? this.loginUrl() : !this.isEtaoLogin() ? this.loginEtaoUrl() : this.url();
    }, this);
    this.target = ko.computed(function () {
        return  !this.isLogin() ? "_self" : !this.isEtaoLogin() ? "_blank" : "_self";
    }, this);
//    this.jfVisible = ko.computed(function () {
//        return this.isEtaoLogin();
//    }, this);
    this.html = '<div id="etaor-info"><div>送集分宝：<span data-bind="text:saving"></span></div>'
        + '<div>优惠券：<span data-bind="text:coupon"></span></div>'
//        + '<div>商家均价：<span data-bind="text:avgPrice"></span></div>'
        + '<div>未来价格：<span data-bind="text:futurePrice"></span></div>'
        + '<div>历史最低价：<span data-bind="text:lowPrice"></span></div>'
//        + '<div>历史最高价：<span data-bind="text:highPrice"></span></div>'
        + '<div><a class="ebutton big eblue" data-bind="attr:{ href: showUrl, target:target, title:title }">使用一淘</a>'
//        + '<a class="ebutton big eblue" href=\"http://jf.etao.com/\" target=\"_blank\" data-bind=\"visible : jfVisible  \">签到集分宝</a>'
        + '</div></div>';
};

var page_taobao = {
    init: function (ri) {
        var login = $("#site-nav-bd .login-info").text();
        ri.isLogin(login.indexOf("请登录") == -1);
        if (!ri.isLogin()) {
            ri.loginUrl($("#site-nav-bd .login-info a:first").attr("href"));
        }
        $("#J_juValid").prepend(ri.html);
    }
};

var page_tmall = {
    init: function (ri) {
        var login = $("#site-nav #login-info").text();
        ri.isLogin(login.indexOf("请登录") == -1);
        if (!ri.isLogin()) {
            ri.loginUrl($("#site-nav #login-info a:first").attr("href"));
        }
        $("#J_LinkBuy").parent().parent().prepend(ri.html);
    }
};

function parseInfo(html) {
    var re = /<body[\s\S]*?>[\s\S]*?<\/body>/;
    var body = $(html.match(re).toString());
    var btn = body.find(".J_okButton:first");
    var ri = new RebateInfo();
    var coupon = body.find("#J_okSavingSku li.discount-item-coupon div.discount-item-cnt:first").text().replace(/\s+/g, '');
    ri.coupon(coupon.replace(/\s+/g, ''));

    var rebateSaving = body.find("#J_okSavingSku li.discount-item-rebate div.discount-item-cnt").text().replace(/\s+/g, '');
    ri.saving(rebateSaving);

    ri.url($(btn).attr("href"));

//    var trend = body.find("#J_section3 div.price-trend-info dl:first");
//    ri.avgPrice(trend.find("dd:first").text().replace(/\s+/g, ""));
//    trend = trend.next().find("dd:first").next().next();
//    var price = trend.text().replace(/\s+/g, "");
//    trend = trend.next().next();
//    price += trend.text().replace(/\s+/g, "");
//    ri.futurePrice(price);
//    var trend = body.find("#J_priceTrend > div.ks-chart-default > div > s > i");
//    ri.lowPrice(trend.text().replace(/\s+/g, ""));
//    ri.highPrice(trend.next().next().text().replace(/\s+/g, ""));
    return ri;
}


var curUrl = tool.getRebateUrl(location.href);
var query = location.search.substring(1);
var historyUrl = tool.getPriceHistoryUrl(query);

$.get(curUrl, function (data) {
    var ri = parseInfo(data);
    $.ajax({
        url: "http://i.etao.com/",
        success: function (data2) {
            if (data2.indexOf("我的一淘") != -1) {
                ri.isEtaoLogin(true);
            } else { //data.indexOf("标准登录框")!=-1)
                ri.isEtaoLogin(false);
                ri.loginEtaoUrl("http://login.etao.com/?redirect_url=" + encodeURIComponent(curUrl));
            }
            if (curUrl.indexOf(host.taobao) > -1) {
                page_taobao.init(ri);
            } else if (curUrl.indexOf(host.tmall) > -1) {
                page_tmall.init(ri);
            }
            ko.applyBindings(ri, $("#etaor-info").get(0));
            $.ajax({
                url: historyUrl,
                dataType: "html",
                success: function (history) {
                    var price = eval("(" + history + ")");
                    if (price.meta) {
                        ri.lowPrice(price.meta.lowest);
                        ri.futurePrice(price.future.price);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(textStatus);
                }
            });

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // 通常 textStatus 和 errorThrown 之中
            // 只有一个会包含信息
        }
    });
});

