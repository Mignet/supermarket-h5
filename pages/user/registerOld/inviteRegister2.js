/**
 * @require inviteRegister2.css  
 */

var $       = require("zepto");
var comm    = require("modules/common/common");
var checkForm = require("modules/common/checkForm");
var service   = require('modules/common/service');
var api   = require('modules/api/api');
var tipBox    = require('modules/widget/tipBox/tipBox');

var inviteRegister2 = {

  // 初始化
  init: function () {
    var _this = this;
    // 上一步注册数据
    this.registerPageData = JSON.parse( sessionStorage.getItem('registerPageData') ) || {};
    // 产品详情页数据
    this.recommendCode = this.registerPageData.recommendCode;
    if( !this.registerPageData.mobile ){
      $('.wraper').hide();
      new tipBox().show('获取数据失败，请返回重试。');
      return false;
    }

    // 有推荐码，则隐藏邀请人输入框
    if( this.recommendCode ){
      $('#recommendManFrom').hide();
    }
    // var codeImgSrc = publicConfig.host + '/rest/image/captcha?mobile='+ this.registerPageData.mobile;   
    // $('#imgCode img').attr('src',codeImgSrc).show();

    // 短信验证码表单处理
    this.sendCodeForm = new checkForm({
      isSetButtonState : true,
      formEle : $('#hadPhoneCode'),
      buttonEle : $('#phoneCode'),
      callback : function(data){
        if( !this.buttonEle.hasClass(this.disButtonClass) ){
          _this.sendCode();
        }
      }
    });

    // 密码表单处理
    this.passwordForm = new checkForm({
      isSetButtonState : true,
      formEle : $('#findPasswordFrom'),
      buttonEle : $('#findPasswordSub'),
      specialCheck : function(){
        return $('#isAgree').prop('checked');
      },
      callback : function(data){
        if( !$('#inputPhoneCode').val() ){
          comm.alert('请先输入手机验证码');
        }else{
          if( $('#isAgree').prop('checked') ){
            if( $('#registerPwd').val() != $('#registerPwdAgain').val() ){
              comm.alert('两次密码输入不一致');
            }else{
              _this.goRegister(data);
            }
          }else{
            comm.alert('注册貅比特，需勾选服务协议');
          }
        }
      }
    });

    this.events();
  },

  events : function(){
    var _this = this;
    // 获取焦点后，隐藏客服电话
    $('input').on('focus',function(){
      $('.bodyBottom').hide();
    })
    .on('blur',function(){
      $('.bodyBottom').show();
    });
    
    // 改变勾选协议的时候，再次校验是否可以登录';
    $('#isAgree').on('click',function(){
      _this.passwordForm.setButtonState();
    });


  },

  // 校验图形验证码
  sendCode : function(){
    var _this = this;
    var sendVcodeService  = new service();
    sendVcodeService.api  = api.sendVcode;
    sendVcodeService.data = {
      mobile : _this.registerPageData.mobile,
      type   : 1
    };
    sendVcodeService.success = function(result){
      $('#formTitle').text('已发送短信验证码短信至' + comm.hideMiddleStr( _this.registerPageData.mobile, 3, 4 ));
      _this.sendCodeForm.countdown();
    }
    sendVcodeService.error = function(msg){
       comm.alert(msg);
    }
    sendVcodeService.send();

  },

  // 注册
  goRegister : function(){
    var _this = this;
    var registerService = new service();
    registerService.api           = api.register;
    registerService.data          = {};
    registerService.data.mobile   = _this.registerPageData.mobile;
    registerService.data.password = $('#registerPwd').val();
    registerService.data.vcode    = $('#inputPhoneCode').val();
    registerService.data.accessUrl = sessionStorage.getItem('__href__');
    registerService.data.fromUrl   = sessionStorage.getItem('__referer__'); 
    if(_this.recommendCode ){
      registerService.data.recommendCode =_this.recommendCode;
    }else{
      registerService.data.recommendCode = $('#recommendMan').val() || undefined;
    }   
    registerService.success = function(result){
        // comm.setCookie("__mobile__",_this.registerPageData.mobile,2);
        // comm.setCookie("__token__",result.token,2);   
        // comm.goRealUrl('pages/user/recommend.html?isPush=2');
        location = config.liecaiUrl + '?tk=' + result.token;
    }
    registerService.send();
  }

};

inviteRegister2.init();
