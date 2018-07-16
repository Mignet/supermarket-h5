/**
 * @require style.css  
 */


var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var checkForm = require("modules/common/checkForm");
var service 	= require('modules/common/service');
var api 	= require('modules/api/api');

var login = {

	// 初始化
	init: function () {
		var _this = this;
		// 上次登录信息
		$('#mobile').val(sessionStorage.getItem("__mobile__") || '');
		// 登录暂不校验密码
		new checkForm({
			isCheckPassword : false,
			isSetButtonState : true,
			formEle : $('#loginFrom'),
			buttonEle : $('#loginSub'),
			callback : function(data){
				_this.goLogin(data);
			}
		});

		this.events();
	},

	events : function(){
		var _this = this;

		$('#loginFrom input').on('focus',function(){
			$('.bodyBottom').hide();
		})
		.on('blur',function(){
			$('.bodyBottom').show();
		});
		

		$('#eyes').on('click',function(){
			if( $(this).hasClass('openEyes') ){
				$(this).removeClass('openEyes');
				$('#loginPwd').prop('type','password');
			}else{
				$(this).addClass('openEyes');
				$('#loginPwd').prop('type','text');
			}
		});

	},

	// 登录操作
	goLogin : function(formData){
		var _this = this;
		var loginService = new service();
		loginService.isHttps = true;
		loginService.api = api.login;
		loginService.data = formData;
		loginService.success = function(result){
			console.log(result);
			sessionStorage.setItem("__mobile__",formData.mobile);
			sessionStorage.setItem("__token__",result.token);
			comm.setCookie("__token__",result.token,3000);
			var  productDetailBuy = sessionStorage.getItem('productDetailBuy');			
			if(productDetailBuy){
				var obj = JSON.parse(productDetailBuy);
				if(obj.productId){
					sessionStorage.removeItem('productDetailBuy');
					comm.goUrl('../financing/product_detail.html?productId=' + obj.productId);		
				}else{
					if( sessionStorage.getItem('__backUrl__') ) {
						comm.goUrl(sessionStorage.getItem('__backUrl__'));
						sessionStorage.removeItem('__backUrl__')
					}
					comm.goUrl('index.html',true);
				}
			}else{
				if( sessionStorage.getItem('__backUrl__') ) {
					comm.goUrl(sessionStorage.getItem('__backUrl__'));
					sessionStorage.removeItem('__backUrl__')
				}
			}
		}
		loginService.send();
	}
};

login.init();
