/**
* @require style.css
 *
*/
var $ = require("zepto");
var native = require('modules/common/native');
var api = require('modules/api/api');
var Service = require('modules/common/service');

var evt = {
    init: function () {
        var self = this;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token = data || "";
                if(self.token){
                    self.getUserInfo();
                }else{
                    $("#shareBtn").on('click',function(){
                        native.action('tokenExpired')
                    })
                }
                if(native.source === 'ios'){
                    // self.showTopRightText();
                    // native.setupWebViewJavascriptBridge(function(bridge){
                    //     bridge.registerHandler('skipInvitePlanner', function(data, responseCallback) {
                    //         window.history.go(-1)
                    //         responseCallback(data)
                    //     })
                    // })
                }
            });
        } else {
            self.token = sessionStorage.getItem('__token__');
        }
    },
    showTopRightText:function(){
        native.action('removeLocalSharedBtn');
        native.action("showTopRightText",{
            rightText : '邀请理财师',
            url:publicConfig.static + 'pages/guide/plannerInvitation.html'
        })
    },
    addNavRightBtn:function(){
        native.action("addNaviRightBtn",{
            title:"邀请理财师",
            jsMethod:"skipInvitePlanner"
        })
    },
    //获取用户信息
    getUserInfo:function(){
        var self = this;
        var userInfoService = new Service();
        userInfoService.api = api.getUserInfo;
        userInfoService.data = {
            token: self.token
        };
        userInfoService.success = function (result) {
            self.recommendCode = result.mobile;
            self.name = result.userName;
            $("#shareBtn").on('click',function(){
                self.appShareRegEvent();
            })
        };
        userInfoService.send();
    },
    appShareRegEvent: function () {
        var appShareData = {
            shareTitle: '能用钱解决的 我们都来帮你', // 分享标题
            shareDesc: '注册T呗就送528元大礼包，理财收益高、产品全、更有私人理财师专业服务！',
            shareLink: publicConfig.toobeiDomain + 'pages/user/inviteRegister.html?recommendCode=' + this.recommendCode + '&name=' + encodeURIComponent(this.name),
            shareImgurl: 'f7d12f11e9647acb043948c030fc169e' // 分享图标
        }
        native.appShare(appShareData);
    }
};

evt.init();