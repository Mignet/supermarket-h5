/**
 * @require invite_enroll.less
 */
var $         = require("zepto");
var comm      = require("modules/common/common");
var tipBox    = require('modules/widget/tipBox/tipBox');
var tip       = new tipBox();
var service   = require('modules/common/service');
var api       = require('modules/api/api');
var registerForm = require("./registerForm.js");

var register  = {
    // 初始化
    init: function () {
        var self = this;
        this.mytimer = null
        var queryString = comm.getQueryString();
        this.mobile = queryString.recommendCode;
        this.recommendCode = queryString.recommendCode || "";
        this.name = queryString.name || "";
        this.registerPageData = JSON.parse( sessionStorage.getItem('registerPageData') ) || {};
        if(this.recommendCode){
            this.getUserInfo()
            if(this.name){
              $('#recommendMob').text(comm.hideName(this.name));
            }else{
              $('#recommendMob').text(comm.hideMiddleStr(this.recommendCode));
            }
        }else{
            $(".recommendText").add('.register-top').add('.register-reward-wrapper').hide()
        }
        this.bindEvent()

        // 注册表单校验
        this.registerMenu = new registerForm({
            isSetButtonState: true,
            formEle: $('#loginFrom'),
            buttonEle: $('#loginSub'),
            callback: function (data) {
                self.goRegister();
            },
        });
    },
    bindEvent:function(){
        var self = this;
        $("#goRegister").on('click',function(){
            if(self.registerMenu.isMobile($("#telephone"))){
                self.getUserType($("#telephone").val())
            }
        })

        // 回到顶部按钮
        $(".footer").on('click',function(){
            comm.backToTop()
        })

        // 是否同意协议 
        $("#select").on('click', function () {
            if ($(this).hasClass('select')) {
                $(this).removeClass('select')
            } else {
                $(this).addClass('select')
            }
        })

        // 填写密码处,眼睛的开闭
        $("#eye").on('click',function(){
            if($(this).hasClass('eye-open')){
                $(this).removeClass('eye-open');
                $("#password").attr('type','password')
            }else {
                $(this).addClass('eye-open');
                $("#password").attr('type','text')
            }
        })

        var buttonTop = Math.ceil($(".button-wrapper").offset().top)
        $(window).on('scroll',function(){
            if(comm.scrollTop() < buttonTop){
                $('.footer').addClass('translate-status')
            }else{
                $('.footer').removeClass('translate-status')
            }
        })
    },
    // 判断用户手机号类型
    getUserType: function (mobile) {
        var _this = this;
        var registerService = new service();
        var queryString = comm.getQueryString();
        registerService.api = api.checkMobile;
        registerService.data = {
            mobile:mobile,
            recommendCode:queryString.recommendCode || ""
        }
        registerService.success = function(result){
            var queryString = comm.getQueryString();
            var registerPageData = JSON.stringify($.extend({}, queryString, {recommendCode:_this.recommendCode,mobile:mobile}));
            sessionStorage.setItem('registerPageData', registerPageData);
            switch ( result.regFlag.toString() ){
                // 未注册
                case '0':
                    $("#mobContainer").hide()
                    $("#mobile").val(mobile)
                    $("#trueRegisterContainer").show();
                break;
                // 注册第三方
                case '1':
                    comm.goUrl('thirdRegister.html' );
                break;
            }
        }
        registerService.send();
    },
    // 获取用户信息
    getUserInfo : function(){
        var self = this;
        var userInfoService = new service();
        var queryString = comm.getQueryString();
        userInfoService.api = api.inviteRegInfo;
        userInfoService.data = {
            mobile:queryString.recommendCode
        }
        userInfoService.success = function(result){
            self.recommendCode = result.mobile
            $("#regTime").text(result.regTime)
            $("#totalIncome").text(result.totalIncome)
            var newRegList = result.newRegList;
            var liHtml =""
            newRegList.forEach(function(item){
                item = item.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                liHtml += '<li>' + item + '领取了528元红包</li>'
            })
            $("#firstScroll").html(liHtml)
            self.roll()
        }
        userInfoService.send();
    },
    // 注册
    goRegister: function () {
        var _this = this;
        var getQueryString = comm.getQueryString();
        var registerService = new service();
        registerService.isHttps = true;
        registerService.api = api.register;
        registerService.data = {};
        registerService.data.mobile = $("#mobile").val();
        registerService.data.password = $('#password').val();
        registerService.data.vcode = $('#vcode').val();
        registerService.data.accessUrl = sessionStorage.getItem('__href__');
        registerService.data.fromUrl = sessionStorage.getItem('__referer__');
        registerService.data.recommendCode = _this.recommendCode;
        registerService.success = function (result) {
            comm.setCookie("__mobile__",$("#mobile").val(),2);
            comm.setCookie("__token__",result.token,2);
            sessionStorage.setItem("__mobile__",$("#mobile").val());
            sessionStorage.setItem("__token__",result.token);
            location.href = "https://liecai.toobei.com/pages/download/download.html"
        };
        registerService.send();
    },
    roll:function(){
        var self = this;
        clearInterval(this.mytimer)
        var area =document.getElementById('scrollInner');
        var record1 = document.getElementById('firstScroll');
        var itemHeight = $('#firstScroll').children().eq(0).height();
        var record2 = document.getElementById('secondScroll');
        record2.innerHTML=record1.innerHTML;         
        var time = 50;
        this.mytimer=setInterval(scrollUp,time);
        function scrollUp(){
            if(area.scrollTop>=record1.offsetHeight){
                area.scrollTop=0;
            }else{
                area.scrollTop++
            }
            if(area.scrollTop % itemHeight == 0 ){
                clearInterval(self.mytimer);
                setTimeout(function(){
                    self.mytimer=setInterval(scrollUp,time)
                },3000)
            }
        }
    }
};

register.init();