var comm = require('modules/common/common');

function LazyLoad() {
    if( LazyLoad.unique ){    // 启用单例模式，保证实例为同一个
        return LazyLoad.unique;
    }
    LazyLoad.unique = this;
    this.init();
}

var download_count = 0,
    ele_obj = [];

LazyLoad.prototype = {
    init: function () {
        this.initElementMap();
        this.lazy();
        window.onscroll = window.onload = LazyLoad.prototype.lazy;
    },
    getPosition: {
        /*
         获取屏幕可视窗口大小
         document.documentElement.clientHeight    IE/CH支持
         document.body.client    低版本混杂模式
         获取当前元素相对于窗口顶部的距离
         element.offsetTop
         滚动条滚动的距离
         document.documentElement.scrollTop   兼容ie低版本的标准模式
         document.body.scrollTop 兼容混杂模式；
         */
        Viewport: function () {
            if (document.compatMode == "BackCompat") {
                //此时浏览器客户区宽度是document.body.clientWidth；
                var Height = document.body.clientHeight;
            } else {
                //浏览器客户区宽度是document.documentElement.clientWidth。
                var Height = document.documentElement.clientHeight;
            }
            return Height;
        },
        ScrollTop: function () {
            if (document.compatMode == "BackCompat") {
                var elementScrollTop = document.body.scrollTop;
            } else {
                var elementScrollTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
            }
            return elementScrollTop;
        },
        ElementViewTop: function (ele) {
            if (ele) {
                var actualTop = ele.offsetTop;
                var current = ele.offsetParent;
                while (current !== null) {
                    actualTop += current.offsetTop;
                    current = current.offsetParent;
                }
                return actualTop - this.ScrollTop();
            }
        }
    },
    //从所有相关元素中找出有data-src属性的元素
    initElementMap: function () {
        var el = document.getElementsByClassName('lazy');
        for (var j = 0, len2 = el.length; j < len2; j++) {
            //查找有data-src标签的img
            if (typeof (el[j].getAttribute("data-src"))) {
                ele_obj.push(el[j]);
                download_count++;
            }
        }
    },
    //防止多次加载
    lazy: function () {
        if (!download_count) return;
        var innerHeight = LazyLoad.prototype.getPosition.Viewport();
        for (var i = 0, len = ele_obj.length; i < len; i++) {
            var t_index = LazyLoad.prototype.getPosition.ElementViewTop(ele_obj[i]); //得到图片相对document的距上距离
            if (t_index < innerHeight + 100) {
                if(ele_obj[i].getAttribute("data-src")){
                    ele_obj[i].src = ele_obj[i].getAttribute("data-src");
                    ele_obj[i].removeAttribute("data-src");
                    delete ele_obj[i];
                    download_count--;
                }
            }
        }
    }
};

module.exports = new LazyLoad();