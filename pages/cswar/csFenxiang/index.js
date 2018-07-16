/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var service = require('modules/common/service');
var render = require('modules/common/render');
var Swiper = require('modules/library/swiper/swiper');

var csFenxiang ={
    init:function(){
        this.query = comm.getQueryString();
        this.loginWeChat();
    },
    loginWeChat:function(){
        if(this.query.code){
            sessionStorage.setItem('__code__',this.query.code)
            this.getInfo(this.query.code);
            this.processName();
            this.swiperSlide();
        }else{
            this.getCode();
        }
    },
    //处理名字
    processName:function(){
        var shareName = this.query.shareName;
        var shareMobile = this.query.shareMobile;
        //处理名字
        if( shareName ) {
            sessionStorage.setItem("__shareName2__",shareName)
            shareName = comm.handleName(shareName);
        } 
        $("#shareName").text(shareName);
        if(shareMobile){
            sessionStorage.setItem("__shareMobile2__",shareMobile);
            shareMobile = shareMobile.replace(/./g, function(word, index){
                if( index > 2 && index < 7 ) {
                    return '*';
                } else {
                    return word;
                }
            });
        }
        $("#shareMobile").text(shareMobile);
    },
    getInfo:function(code){
        var self = this;
        var Service = new service();
        Service.api = 'helpRaiseRate/getLieCaiWeixinInfo';
        Service.isShowLoading = true;
        Service.isNeedToken = false;
        Service.data = {
            code: code
        }
        Service.success = function (result) {
            sessionStorage.setItem('__headimgurl__', result.headimgurl);
            sessionStorage.setItem('__nickname__', result.nickname);
            sessionStorage.setItem('__openid__', result.openid);
            self.getWelfare();
        }
        Service.error = function (msg, result) {
            self.getCode();
        }
        Service.send();
    },
    getWelfare:function(){
        var self = this;
        var openId = sessionStorage.getItem("__openid__");
        var welfareService = new service();
        welfareService.api = 'user/haveGetWelfare';
        welfareService.isShowLoading = true;
        welfareService.isNeedToken = false;
        welfareService.data = {
            openId: openId
        };
        welfareService.success = function (result) {
            if(result.isWelfare == 1){
                sessionStorage.setItem("__shareName__",result.userName)
                sessionStorage.setItem("__shareMobile__",result.mobile)
                if(self.query.shareMobile === result.mobile){
                    $("#support").addClass('have-support').on('click','a',function(){
                        location.href="./receiveSuccess.html"
                        return false;
                    })
                }else{
                    $("#support").addClass('other-support').on('click','a',function(){
                        location.href="./receiveSuccess.html"
                        return false;
                    })
                }
            }else{
                sessionStorage.setItem("__shareName__",self.query.shareName)
                sessionStorage.setItem("__shareMobile__",self.query.shareMobile)
                $("#support").addClass('support-ta')
            }
        };
        welfareService.error = function (msg, result) {
            self.getCode();
        };
        welfareService.send();
    },
    swiperSlide:function(){
        new Swiper('.banner', {
            paginationClickable: true,
            autoplayDisableOnInteraction: false,           
            prevButton:'.swiper-button-prev',
            nextButton:'.swiper-button-next',
            speed: 1000,
            autoplay: 2500,
            loop: true
        });
    },
    getCode:function(){
        var realUrl = location.href;
        var url = 'https://nliecai.toobei.com/redirect.html?appid=wx83677e6da548b99e&redirect_uri=' + encodeURIComponent(realUrl) + '&scope=snsapi_userinfo&state=getinfo#wechat_redirect';
        location.href = url;
    }
};

csFenxiang.init();