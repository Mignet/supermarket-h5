/**
 * @require understand.less
 * @require modules/library/swiper/swiper.css
 */
var $ = require("zepto");
var native   = require('modules/common/native');
var service = require('modules/common/service')
var Swiper = require('modules/library/swiper/swiper');

var understand={
    init:function(){
        var self = this;
        if (native.isApp) {
            native.getAppToken(function (data) {
                for(var i=0;i<$(".link").length;i++){
                    $(".link").eq(i).attr('href',$(".link").eq(i).attr('href') + '?isApp=liecai')
                }
                self.appSelfShare();
            });
        }
    	$("#tab1").show()
        this.getCompanyInfo();
        this.swiperSlide();
    	this.bindEvent()
    },
    bindEvent:function(){
        $("#tabWrapper").on('click','p',function(){
            if($(this).hasClass('active')) return;
        	var id = $(this).data('id')
        	$("#conntentWrapper").children('div').hide()
        	$("#tab" + id).show()
            $(this).addClass('active').siblings().removeClass('active')
        })
        
        var _isBack = true;
        $("#learnMore").on('click',function(){
            if(_isBack){
                $("#twoCompanyDesc").show()
                $(this).html("收起&nbsp;&nbsp;<i class='iconfont'>&#xe60f;</i>")
                _isBack = false;
            }else{
                $("#twoCompanyDesc").hide()
                $(this).html("了解更多&nbsp;&nbsp;<i class='iconfont'>&#xe600;</i>")
                _isBack = true
            }
        })

        $("#maskBg").add("#maskImage").on('click',function(){
            $("#mask").hide()
            $("#maskImage").attr('src',"")
        })

        $(".enlarge").on('click',function(){
            $("#maskImage").attr('src',$(this).next().data('src'));
            $("#mask").show()
        })
    },
    //获取公司运营信息
    getCompanyInfo: function () {
        var self = this;
        var companyInfoService = new service();
        companyInfoService.api = 'homepage/lcs/achievement/4.3.0';
        companyInfoService.success = function (data) {
            $("#activeUserNumber").html(data.activeUserNumber+"<span>人</span>")
            var commissionAmount = parseInt(data.commissionAmount/100)/100
            $("#commissionAmount").html(commissionAmount+'<span>万</span>')
            $("#reInvestRate").text(data.reInvestRate)
            $("#safeOperationTime").html(data.safeOperationTime+"<span>天</span>")
        };
        companyInfoService.send();
    },
    swiperSlide:function(){
        //只有一张图片不需要按钮和切换
        if($(".swiper-slide").length == 1) {
            $(".swiper-button-next").add(".swiper-button-prev").hide();
            return
        }
        var mySwiper = new Swiper('.swiper-container',{
            observeParents:true,
            observer:true,
            // 如果需要前进后退按钮
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            loop:true,
            autoplay:2000
        })
    },
    appSelfShare:function(){
        var shareData = {
            shareDesc:"致力于为理财师打造的“一站式”理财、投顾服务的零门槛创业平台。",
            shareImgurl:"dfa3e35be331f6ec67566130f67820b9",
            shareLink:publicConfig.static + 'pages/frame/children/understand.html',
            shareTitle:"了解猎财大师"
        }
        native.action("getSharedContent",shareData)
    }
}
understand.init()
