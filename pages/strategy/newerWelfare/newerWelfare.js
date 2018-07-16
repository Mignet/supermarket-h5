/**
* @require newerWelfare.less
* @require modules/library/swiper/swiper.css
 *
 */
var $ = require("zepto");
var comm = require('modules/common/common');
var api = require('modules/api/api');
var Service = require('modules/common/service');
var native = require('modules/common/native');
var Swiper = require('modules/library/swiper/swiper');
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');
var newer = {
    init: function () {
        var self = this;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token  = data || "";
                if(self.token){
                    self.isLogin();
                }else{
                    self.unLogin()
                }
            });
        } else {
            self.token  = sessionStorage.getItem("__token__");
            if(self.token){
                this.isLogin();
            }else{
                this.unLogin()
            }
        }
    },
    //未登录状态
    unLogin:function(){
        this.unLoginImages()
        this.unLoginSwiperSlide();
        this.unLoginEvent();
    },
    //未登录状态下的图片
    unLoginImages:function(){
        $("#regStatus").attr('src',$("#statusOne").children('img').eq(0).data('src'))
        $("#bindcardStatus").attr('src',$("#statusTwo").children('img').eq(2).data('src'))
        $("#investStatus").attr('src',$("#statusThree").children('img').eq(2).data('src'))
        $("#inviteCfpStatus").attr('src',$("#statusFour").children('img').eq(2).data('src'))
        $("#inviteCfpInvestStatus").attr('src',$("#statusFive").children('img').eq(2).data('src'))
        $(".progress-circle").addClass('un-finish')
    },
    //未登录状态下的事件
    unLoginEvent:function(){
        var self = this
        $("#handleClick").text('立即注册').on('touchstart',function(){
            $(this).parent().css('backgroundImage','url('+$("#btnStatus").children('img').eq(1).data('src')+")")
        }).on('touchend',function(){
            $(this).parent().css('backgroundImage','url('+$("#btnStatus").children('img').eq(0).data('src')+")")
            self.skipRegisterPage()
        })

        $("#progressBtn").on('click',function(){
            self.unFinishTip();
        })
    },
    //登录状态
    isLogin:function(){
        this.getUserInfo();
    },
    //未登录状态下的轮播
    unLoginSwiperSlide:function(){
        $("#welfareSwiperContainer").addClass('status-1')
        var mySwiper = new Swiper('.swiper-container',{
            slidesPerView: 3,
            spaceBetween: 5,
            observeParents:true,
            observer:true,
        })
    },
    //登录状态下的轮播
    //需要配置从哪一个开始的参数
    isLoginSwiperSlide:function(initialSlide){
        $("#welfareSwiperContainer").addClass('status-2')
        $(".slideLast").remove()
        var mySwiper = new Swiper('.swiper-container',{
            slidesPerView: 3,
            spaceBetween: 5,
            centeredSlides:true,
            initialSlide:initialSlide
        })
    },
    //获取用户信息,完成到第几步
    getUserInfo: function () {
        var self = this;
        var userInfoService = new Service();
        userInfoService.api = api.newerWelfareFinishStatus;
        userInfoService.data = {
            token: self.token
        };
        userInfoService.success = function (result,allResult) {
            //现在需要完成的状态从0开始
            var initialSlide =  result.nextStatus - 1;
            // 不同得状态加载不同图片和样式
            self.handleInfo(result);
            //默认激活页面
            $(".swiper-slide").eq(initialSlide).children('img').eq(0).attr('src',$("#allStatus").children('div').eq(initialSlide).children('img').eq(0).data('src'))
            //轮播图
            self.isLoginSwiperSlide(initialSlide);
            //按钮文字
            var _text = '';
            switch(result.nextStatus){
                case 1: _text = '立即注册' ; break;
                case 2: _text = '立即绑卡' ; break;
                case 3: _text = '立即购买' ; break;
                case 4: _text = '立即邀请' ; break;
                case 5: _text = '引导理财师投资' ; break;
                case 6: _text = '终极大奖' ; break;
                case 7: _text = '已全部完成' ; break;
                default: _text = '点击'
            }
            //按钮点击事件
            $("#handleClick").text(_text).on('touchstart',function(event){
                event.preventDefault();
                if(result.nextStatus == 7) return;
                $(this).parent().css('backgroundImage','url('+$("#btnStatus").children('img').eq(1).data('src')+")")
            }).on('touchend',function(){
                event.preventDefault();
                if(result.nextStatus == 7) return;
                $(this).parent().css('backgroundImage','url('+$("#btnStatus").children('img').eq(0).data('src')+")")
                self.handleClick(result.nextStatus)
            })

            //领取终极大奖
            if(result.nextStatus == 6){
                $("#progressBtn").addClass("receive").on('touchstart',function(){
                    event.preventDefault();
                    $(this).addClass("receive-active");
                }).on('touchend',function(){
                    event.preventDefault();
                    $(this).removeClass("receive-active");
                    self.sendFinalPrize();
                })
            }else if(result.nextStatus  < 6){
                event.preventDefault();
                $("#progressBtn").on('click',function(){
                    self.unFinishTip();
                })
            }else if(result.nextStatus  == 7){
                $("#progressBtn").add("#handleClick").on('click',function(){
                    event.preventDefault();
                    self.finishedTip();
                })
            }
        };
        userInfoService.send();
    },
    //点击处理
    handleClick:function(nextStatus){
        var self = this;
        //已经完成
        switch(nextStatus){
            case 1: self.skipRegisterPage(); break;
            case 2: self.skipBindCardPage(); break;
            case 3: self.skipPlatformPagePlatformPage(); break;
            case 4: self.skipInvitePlannerRegisterPage();break;
            case 5:self.skipGuidePlannerInvestPage();break;
            case 6:self.sendFinalPrize();break;
        }
    },
    //跳转到注册页
    skipRegisterPage:function(){
        native.action('refreshPage')
        var data = {
            android:{
                name:'RegisterPhone',
                paramsKey:'',
                params:''
            },
            ios:{
                name:'UserValidateViewController',
                method:'initWithNibName:bundle:',
                params:'UserValidateViewController,nil'
            }
        }
        native.skipAppPage(data)
    },
    //跳转到绑卡页
    skipBindCardPage:function(){
        native.action('refreshPage')
        native.action("bindCardAuthenticate")
    },
    //跳转到邀请理财师注册页
    skipInvitePlannerRegisterPage:function(){
        native.action('refreshPage')
        native.action("invitedOperation")
    },
    //跳转到我的理财师团队页
    skipGuidePlannerInvestPage:function(){
        // native.action('refreshPage')
        // var data = {
        //     android:{
        //         name:'MyTeamActivity',
        //         paramsKey:'',
        //         params:''
        //     },
        //     ios:{
        //         name:'MIMyTeamController',
        //         method:'initWithNibName:bundle:',
        //         params:'MIMyTeamController,nil'
        //     }
        // }
        // native.skipAppPage(data)
        // var data2 = {
        //     android:{
        //         name:'CfgMemberActivity',
        //         paramsKey:'',
        //         params:''
        //     },
        //     ios:{
        //         name:'MyCfgViewController',
        //         method:'',
        //         params:''
        //     }
        // }
        // native.skipAppPage(data2)
        native.action('refreshPage')
        var data = {
            android:{
                name:'MyTeamActivity',
                paramsKey:'',
                params:''
            },
            ios:{
                name:'MIMyTeamController',
                method:'initWithNibName:bundle:',
                params:'MIMyTeamController,nil'
            }
        }
        native.skipAppPage(data)
        var data2 = {
            android:{
                name:'CfgMemberActivity',
                paramsKey:'',
                params:''
            },
            ios:{
                name:'MyCfgViewController',
                method:'initWithNibName:bundle:',
                params:'MyCfgViewController,nil'
            }
        }
        setTimeout(function(){
            native.skipAppPage(data2)
        },1000)
    },
    //跳转到投资列表网贷页
    skipPlatformPagePlatformPage:function(){
        native.action('refreshPage')
        var data = {
            android:{
                name:'MainActivity',
                paramsKey:'skipTab',
                params:'p1t1'
            },
            ios:{
                name:'AgentContainerViewController',
                method:'',
                params:'1'
            }
        }
        native.skipAppPage(data)
    },
    // 不同得状态加载不同图片和样式
    handleInfo:function(result){
        //注册
        if(result.regStatus == 0){
            $("#regStatus").attr('src',$("#statusOne").children('img').eq(2).data('src'))
            $(".progress-circle").eq(0).addClass('un-finish');
        }else if(result.regStatus == 1){
            $("#regStatus").attr('src',$("#statusOne").children('img').eq(1).data('src'))
        }
        //绑卡
        if(result.bindcardStatus == 0){
            $("#bindcardStatus").attr('src',$("#statusTwo").children('img').eq(2).data('src'))
            $(".progress-circle").eq(1).addClass('un-finish');
        }else if(result.bindcardStatus == 1){
            $("#bindcardStatus").attr('src',$("#statusTwo").children('img').eq(1).data('src'))
        }
        //自投
        if(result.investStatus == 0){
            $("#investStatus").attr('src',$("#statusThree").children('img').eq(2).data('src'))
            $(".progress-circle").eq(2).addClass('un-finish');
        }else if(result.investStatus == 1){
            $("#investStatus").attr('src',$("#statusThree").children('img').eq(1).data('src'))
        }
        //邀请理财师
        if(result.inviteCfpStatus == 0){
            $("#inviteCfpStatus").attr('src',$("#statusFour").children('img').eq(2).data('src'))
            $(".progress-circle").eq(3).addClass('un-finish');
        }else if(result.inviteCfpStatus == 1){
            $("#inviteCfpStatus").attr('src',$("#statusFour").children('img').eq(1).data('src'))
        }
        //邀请理财师投资
        if(result.inviteCfpInvestStatus == 0){
            $("#inviteCfpInvestStatus").attr('src',$("#statusFive").children('img').eq(2).data('src'))
            $(".progress-circle").eq(4).addClass('un-finish');
        }else if(result.inviteCfpInvestStatus == 1){
            $("#inviteCfpInvestStatus").attr('src',$("#statusFive").children('img').eq(1).data('src'))
        }
        if(result.nextStatus == 7){
            $("#handleClick").parent().css('backgroundImage','url('+$("#btnStatus").children('img').eq(2).data('src')+")")
        }
    },
    //领取终极大奖
    sendFinalPrize:function(){
        var self = this;
        var sendFinalPrizeService = new Service();
        sendFinalPrizeService.api = api.sendFinalPrize;
        sendFinalPrizeService.data = {
            token: self.token
        };
        sendFinalPrizeService.success = function (data,result) {
            if(result.code == 0 && result.msg == 'success'){
                self.skipRedPacketPop()
                $("#progressBtn").removeClass('receive')
            }
        };
        sendFinalPrizeService.send();
    },
    //跳转到红包页面弹窗
    skipRedPacketPop:function(){
        var self = this;
        var tip = new BubbleTip({
            msg: '恭喜您完成所有任务，领取了288元红包',
            buttonText: ['前往查看'],
            callback: function (index) {
                if(index === 0){
                    self.skipRedPacket()
                }
            }
        });
        tip.show();
    },
    //跳转到派发红包页面
    skipRedPacket:function(){
        native.action('refreshPage')
        var data = {
            android:{
                name:'MineRedPacketsActivity',
                paramsKey:'tab',
                params:'Int_1'
            },
            ios:{
                name:'DispatchRedPacketContainerViewController',
                method:'initWithNibName:bundle:currentRedPacketType:',
                params:'DispatchRedPacketContainerViewController,nil,1'
            }
        }
        native.skipAppPage(data)
    },
    // 未完成五步提示
    unFinishTip:function(){
        var tip = new BubbleTip({
            msg: '完成所有任务，才能领取哦~',
            buttonText: ['确定'],
            callback: function (index) {
            }
        });
        tip.show();
    },
    finishedTip:function(){
        var self = this;
        var tip = new BubbleTip({
            msg: '恭喜您所有的任务已完成',
            buttonText: ['确定'],
            callback: function (index) {
                if(index === 0){
                    self.skipHomePage()
                }
            }
        });
        tip.show();
    },
    //跳转到首页
    skipHomePage:function(){
        native.action('refreshPage')
        var data = {
            android:{
                name:'MainActivity',
                paramsKey:'skipTab',
                params:'p0'
            },
            ios:{
                name:'HomeViewController',
                method:'',
                params:''
            }
        }
        native.skipAppPage(data)
    }
};

newer.init();