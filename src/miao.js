var list = {};
var keywords = {
    "yurongfu": ["羽绒服"],
    "mianyi": ["棉衣", "棉袄", "棉服"],
    "waitao": ["外套", "大衣", "夹克", "卫衣", "风衣", "冲锋衣"],
    "dadishan": ["打底衫"],
    "dadiku": ["打底裤", "一体裤", "裤袜"],
    "qun": ["连衣裙", "包臀裙", "短裙", "羊绒裙", "打底裙"],
    "zhenzhishan": ["针织衫", "毛衣", "羊绒衫", "蝙蝠衫", "T恤", "羊毛衫"],
    "chenshan": ["衬衫"],
    "neiyi": ["内衣", "文胸", "胸罩", "内裤", "塑身裤"],
    "ku": ["牛仔裤", "休闲裤", "卫裤", "运动裤", "裤"],
    "xie": ["鞋", "靴"],
    "majia": ["马甲"],
    "baobao": ["女包", "背包", "挎包", "子母包", "双肩包", "电脑包"],
    "jiashiqi": [ "加湿器"],
    "yidongdianyuan": [ "移动电源", "充电宝"],
    "xiaodianqi": [ "火锅", "电饭煲", "电磁炉", "电热锅", "婴儿锅", "儿童锅"]
};

var keywordlist = {
    "yurongfu": [],
    "mianyi": [],
    "waitao": [],
    "dadishan": [],
    "dadiku": [],
    "qun": [],
    "zhenzhishan": [],
    "chenshan": [],
    "neiyi": [],
    "ku": [],
    "xie": [],
    "majia": [],
    "baobao": [],
    "jiashiqi": [],
    "yidongdianyuan": [],
    "xiaodianqi": [],
    "other": []
};

var dict = {
    "yurongfu": "羽绒服",
    "mianyi": "棉衣",
    "waitao": "外套",
    "dadishan": "打底衫",
    "dadiku": "打底裤",
    "qun": "裙",
    "zhenzhishan": "针织衫",
    "chenshan": "衬衫",
    "neiyi": "内衣",
    "ku": "裤",
    "xie": "鞋",
    "majia": "马甲",
    "baobao": "包",
    "jiashiqi": "加湿器",
    "yidongdianyuan": "移动电源",
    "xiaodianqi": "小电器",
    "other": "其它"
}
var filterInfo = {
    filterWord: ko.observable(),
    lastObj: null,
    show: function (cnt, data, event) {
        this.filterWord(cnt);
        for (var attr in list) {
            var arr = list[attr];

            for (var index in  arr) {
                if (cnt == attr) {
                    arr[index].show();
                } else {
                    arr[index].hide();
                }
            }
        }
    },
    showWord: function (word, data, event) {
        this.filterWord(word);
        for (var attr in keywordlist) {
            var arr = keywordlist[attr];

            for (var index in  arr) {
                if (word === attr) {
                    arr[index].show();
                } else {
                    arr[index].hide();
                }
            }
        }
    }
}

function handleWord(name, ele) {
    var flag = false;
    for (var word in keywords) {
        var arr = keywords[word];
        for (var index in arr) {
            if (name.indexOf(arr[index]) > -1) {
                flag = true;
                keywordlist[word].push(ele);
                break;
            }
        }
        if (flag) {
            break;
        }
    }
    if (!flag) {
        flag = false;
        keywordlist["other"].push(ele);
    }
}

function showFilter(lst, klst) {
    var qfilter = $("#tejiaContent div.quick-filter");
    var html = [];
    var html2 = [];
    html.push('<div class="quick-filter-bd"><h5>限量</h5><p>');
    for (var attr in lst) {
        html2.push('<a href="javascript:void(0);" data-bind="click: show.bind($data,' + attr + '),css:{cur:filterWord()==' + attr + '}">' + attr + '件(' + lst[attr].length + ')</a>');
    }
    html.push(html2.join('|'));
    html.push('</p></div>');
    qfilter.append(html.join(''));

    var html3 = [], html4 = [];
    html3.push('<div class="quick-filter-bd"><h5>关键词</h5><p>');
    for (var attr in klst) {
        var singleCount = klst[attr].length;
        if (singleCount > 0) {
            html4.push('<a href="javascript:void(0);" data-bind=\'click: showWord.bind($data,"' + attr + '"),css:{cur:filterWord()=="' + attr + '"}\'>' + dict[attr] + '(' + klst[attr].length + ')</a>');
        }
    }
    html3.push(html4.join('|'));
    html3.push('</p></div>');
    qfilter.append(html3.join(''));

    $("#tejiaContent div.quick-filter p").css("float", "none");
    ko.applyBindings(filterInfo, qfilter.get(0));
}

$(function () {
    if (location.href.indexOf("http://tejia.taobao.com/one.htm") > -1) {
        var content = $("#tejiaContent");
        var details = $("#tejiaContent div.filter-list-detail > ul > li");
        var re = /限量(\d+)件/;
        details.each(function (i, ele) {
            $(ele).removeClass("col5");
            var text = $(ele).text();
            var matchs = text.match(re);
            if (matchs.length > 0) {
                var count = matchs[1];
                if (!list[count]) {
                    list[count] = [];
                }
                list[count].push($(ele));
            }
            handleWord(text, $(ele));
            if (i === details.length - 1) {
                showFilter(list, keywordlist);
            }
        });
    }
})

