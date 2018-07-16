/**
 * @require morningPaper.less
 */
var $ = require("zepto");
var comm = require("modules/common/common");
var api = require('modules/api/api');
var service = require('modules/common/service');
var native = require('modules/common/native');
var wechatShare = require('modules/common/wechatShare')

var information = {
    init: function () {
        var self = this;
        var query = comm.getQueryString();
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token = data || null;
                self.render()
            });
        } else if(comm.isWebChat()){
            this.token = query.token || null;
            this.render()
        }else {
            this.token = query.token || sessionStorage.getItem("__token__");
            this.render()
        }
    },
    render:function (){
        var self = this;
        var detailServer = new service();
        detailServer.api = api.morningPaper;
        detailServer.data = {
            token: this.token
        };
        detailServer.success = function (result) {
            if(result.userName){
                $(".username").text(result.userName)
            }else{
                $("#header").add('#footer').hide()
            }
            if(result.headImg){
                $("#headerIcon").attr('src',publicConfig.imageUrl + result.headImg + '?f=png')
            }
            $("#content").html(result.morningPaper.content)
            $("#QRCode").attr('src',publicConfig.imageUrl + result.qrcode + '?f=png')
            document.title = result.morningPaper.title;
            if(native.isApp){
                self.appRightTopShare(result.morningPaper)
            }else if(comm.isWebChat()){
                self.wechatShareEvent(result.morningPaper);
            }
            $("body").show()
        };
        detailServer.send();
    },
    appRightTopShare:function(data){
        var link = "";
        var shareIcon = "";
        var reg = /^(https:\/\/)(preimage|image)\.toobei\.com\/([A-Za-z0-9]+)$/
        if(this.token){
            link = publicConfig.static + 'pages/information/morningPaper.html?token=' + this.token
        }else{
            link = publicConfig.static + 'pages/information/morningPaper.html'
        }
        if(data.shareIcon.indexOf('https') > -1){
            shareIcon = data.shareIcon + '?f=png'
        }else{
            shareIcon = data.shareIcon.replace(reg,'$3')
        }
        var shareData = {
            shareTitle: data.shareTitle,
            shareDesc: data.shareDesc,
            shareLink: link,
            shareImgurl: shareIcon
        }
        native.action("getSharedContent",shareData)
    },
    //微信分享
    wechatShareEvent:function(data){
        var link = "";
        var shareIcon = "";
        if(this.token){
            link = publicConfig.static + 'pages/information/morningPaper.html?token=' + this.token
        }else{
            link = publicConfig.static + 'pages/information/morningPaper.html'
        }
        if(data.shareIcon.indexOf('http') > -1){
            shareIcon = data.shareIcon + '?f=png'
        }else{
            shareIcon = publicConfig.imageUrl + data.shareIcon + '?f=png'
        }
        var wechatShareData = {
            title  : data.shareTitle,
            desc   : data.shareDesc,
            link   : link,
            imgUrl : shareIcon
        };
        new wechatShare(wechatShareData);
    }
};

information.init();
