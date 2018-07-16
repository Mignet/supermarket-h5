/**
 * @require register2.css
 */

var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var checkForm = require("modules/common/checkForm");
var service 	= require('modules/common/service');
var api 	= require('modules/api/api');
var tipBox 		= require('modules/widget/tipBox/tipBox');

var register2 = {

	// 初始化
	init: function () {
		var _this = this;
		// 上一步注册数据
		this.registerPageData = JSON.parse( sessionStorage.getItem('registerPageData') ) || {};
		// 产品详情页数据
		this.proDetailSearch = JSON.parse( sessionStorage.getItem( 'proDetailSearch' ) ) || {};
		this.recommendCode = this.registerPageData.recommendCode || this.proDetailSearch.recommendCode;
		if( !this.registerPageData.mobile ){
			$('.wraper').hide();
			new tipBox().show('获取数据失败，请返回重试。');
			return false;
		}

		// 有推荐码，则隐藏邀请人输入框
		if( this.recommendCode ){
			$('#recommendManFrom').hide();
		}

		if(this.registerPageData.saleOrgCode){
			$('#recommendManFrom').hide();
		}
		
		// var codeImgSrc = publicConfig.host + '/rest/image/captcha?mobile='+ this.registerPageData.mobile;
		// $('#imgCode img').attr('src',codeImgSrc).show();
		// 短信验证码表单处理
		this.sendCodeForm = new checkForm({
			isSetButtonState : true,
			formEle : $('#hadPhoneCode'),
			buttonEle : $('#phoneCode'),
			// disButtonClass : 'hadSend',
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
			// 附加自行定义规则
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
						comm.alert('注册领会，需勾选服务协议');
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


		// 点击刷新验证码
		$('#imgCode').on('click',function(){
			_this.refreshImg();
		});

		// 改变勾选协议的时候，再次校验是否可以登录';
		$('#isAgree').on('click',function(){
			_this.passwordForm.setButtonState();
		});


	},

	// 刷新验证码
	// refreshImg : function (){
	// 	$('#imgCode').find('img').attr('src',$('#imgCode').find('img').attr('src'));
	// },

	// 校验图形验证码
	sendCode : function(){
		var _this = this;
		var checkImgService  = new service();
        checkImgService.api  = api.sendVcode;
		checkImgService.data = {
			mobile : _this.registerPageData.mobile,
			type   : 1
		};
		checkImgService.success = function(result){
			$('#formTitle').text('已发送短信验证码短信至' + comm.hideMiddleStr( _this.registerPageData.mobile, 3, 4 ));
			_this.sendCodeForm.countdown();
			// $('#showPhoneCode').show();
		}
		checkImgService.error = function(msg){
			comm.alert(msg);
		}
		checkImgService.send();

	},

	// 注册
	goRegister : function(){
		var _this = this;
		var registerService = new service();
		registerService.isHttps       = true;
		registerService.api           = api.register;
		registerService.data          = {};
		registerService.data.mobile   = _this.registerPageData.mobile;
		registerService.data.saleOrgCode   = _this.registerPageData.saleOrgCode;
		registerService.data.password = $('#registerPwd').val();
		registerService.data.vcode    = $('#inputPhoneCode').val();
		registerService.data.accessUrl  = _this.registerPageData.accessUrl;
		registerService.data.fromUrl    = _this.registerPageData.fromUrl;

		if(_this.recommendCode ){
			registerService.data.recommendCode =_this.recommendCode;
		}else{
			registerService.data.recommendCode = $('#recommendMan').val() || undefined;
		}
		registerService.success = function(result){
			 // sessionStorage.setItem('__mobile__',_this.registerPageData.mobile);
			 // sessionStorage.setItem('__token__',result.token);
			 // var theTip = new tipBox({
			 // 	msg : '注册成功,下载app即可使用',
			 // 	callback : function(){
	 		 // 		comm.goUrl('../download/downloadMidware.html');
			 // 	}
			 // });
			 // theTip.show();			         
			location = publicConfig.liecaiUrl + '?tk=' + result.token;
		}
		registerService.send();
	}
};

register2.init();
