var $ = require("zepto");
var comm = require("modules/common/common");
var api = require('modules/api/api');
var native = require('modules/common/native');
var Render = require('modules/common/render');
var wechatShare = require('modules/common/wechatShare')

var handbook = {
    init: function () {
        var query = comm.getQueryString();
        this.id = query.id;
        this.getRenderData();
    },

    getRenderData: function () {
        var self = this;
        new Render({
            ele: $('.main'),
            api: api.handbook,
            data: {
                id:self.id
            },
            isShowLoading: true,
            callback: function (data) {
                document.title = data.title;
                native.action('setAppWebTitle', {title: data.title});
                $(".main").css('visibility','visible');
                if(comm.isWebChat()){
                    // 微信分享信息
                    var wechatShareData = {
                        title: data.title, // 分享标题
                        desc: data.summary, // 分享描述
                        link: window.location.href, // 分享链接
                        imgUrl: publicConfig.imageUrl + data.shareIcon +'?f=png' // 分享图标
                    };
                    new wechatShare(wechatShareData);
                }
            }
        })
    }
};

handbook.init();
