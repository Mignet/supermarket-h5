var $              = require("zepto");
var native         = require('modules/common/native');
var comm           = require('modules/common/common');
var Service        = require('modules/common/service');
var api        = require('modules/api/api');
var search = {
    init:function(){
        var self = this;
        self.shareInfo = {};
        if(native.isApp){
            native.getAppToken(function(data){
                self.token = data || '';
                self.getUserInfo();
                self.bindEvent();
            });
        }else{
            self.token = comm.getCookie("__token__");
            self.getUserInfo();
            self.bindEvent();
        }
    },
    bindEvent:function(){
        var self = this;
        try{
            native.action('removeLocalSharedBtn');
        }catch(err){
        }

        $("#fenxiang").on('click',function(event) {
            self.getBindCard();
        });

    },
    getBindCard:function(){
        var self  = this;
        var bindCardService = new Service();
        bindCardService.api = api.personAuthenticate;
        bindCardService.data = {
            token:self.token
        };
        bindCardService.success=function(result){
            var shareUrl;
            if(!native.isApp){
                shareUrl = "http://10.16.2.92:9003/pages/cswar/csFenxiang.html?shareName="+encodeURI(self.shareInfo.shareName) +"&shareMobile="+self.shareInfo.shareMobile
            }else{
                shareUrl = publicConfig.static + "pages/cswar/csFenxiang.html?shareName="+encodeURI(self.shareInfo.shareName) +"&shareMobile="+self.shareInfo.shareMobile
            }
            var shareData = {
                shareTitle  :  comm.handleName(self.shareInfo.shareName) +'邀请您成为创业伙伴，赶紧支持他！', // 分享标题
                shareDesc   : '小圈子，大生意！支持他有机会获得价值488元长沙高端金融沙龙一天及50元交通补贴',
                shareLink   : shareUrl, // 分享链接
                shareImgurl : '85886c560a1503c4b8edfade1812bdad' // 分享图标
            };
            console.log(shareData)
            if(result.bundBankcard){
                native.action('getAppShareFunction',shareData);
            }else{
                native.action('bindCardAuthenticate'); 
            }
            if(!native.isApp){
                location.href = shareUrl;
            }
        }
        bindCardService.send();
    },
    getUserInfo:function(){
        var self = this;
        var userInfoService = new Service();
        userInfoService.api = api.getUserInfo;
        userInfoService.data = {
            token : this.token
        };
        userInfoService.success = function(result){
            self.shareInfo.shareName = result.userName;
            self.shareInfo.shareMobile = result.mobile;
            sessionStorage.setItem("__sharename__",result.userName);
            sessionStorage.setItem("__sharemobile__",result.mobile);
        };
        userInfoService.send();
    },

}
search.init();