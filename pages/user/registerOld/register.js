/**
 * @require register.css
 */
var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var checkForm = require("modules/common/checkForm");
var service 	= require('modules/common/service');
var api 	= require('modules/api/api');
var tipBox 		= require('modules/widget/tipBox/tipBox');
var registerTip = new tipBox();
var register = {
	// 初始化
	init: function () {
		var _this = this;
		var getQueryString = comm.getQueryString();
		var recommendCode = '';
		if( getQueryString.recommendCode ){
			recommendCode = comm.hideMiddleStr( getQueryString.recommendCode );
		}
		var recommendText = getQueryString.name || recommendCode;
		if(recommendText == 'null' && recommendCode){
			recommendText = recommendCode;
		}

		if(recommendText == 'undefined' && recommendCode){
			recommendText = recommendCode;
		}

		if( !(getQueryString && getQueryString.recommendCode) ){
			$('.registerMobile .lineHeight3').show();
		}else{
			$('#recommendMob').html(  recommendText );
			$('.recommendText').show();
		}

		if(getQueryString.saleOrgCode){
			$('.recommendText').hide();
			$(".loginText").hide();
		}

		if(getQueryString.userFlag){
			$('.recommendText').hide();
			$(".loginText").hide();			
		}

		sessionStorage.removeItem( 'registerPageData' );

		// 注册表单校验
		new checkForm({
			isSetButtonState : true,
			formEle : $('#loginFrom'),
			buttonEle : $('#loginSub'),
			callback : function(data){
				_this.getUserType(data);
			}
		});
		$('#loginFrom input').on('focus',function(){
			$('.bodyBottom').hide();
		})
		.on('blur',function(){
			$('.bodyBottom').show();
		});

	},


	// 判断用户类型
	getUserType: function (formData) {
		var _this = this;
		var registerService = new service();
		var queryString = comm.getQueryString();
		registerService.api = api.checkMobile;
		registerService.data = $.extend( {},queryString,formData);
		registerService.success = function(result){
				formData.accessUrl = location.href;
				formData.fromUrl   = ""; //现在还没有开发自己的微信公众号，没有推广，所以没有来源
				var registerPageData = JSON.stringify( $.extend( {},queryString,formData,result));
				sessionStorage.setItem('registerPageData', registerPageData);
				switch ( result.regFlag.toString() ){
					// 已注册为理财师
					case '2':
						var theTip = new tipBox({
						 	msg : '你已经是猎财大师用户，可直接登录',
						 	callback : function(){
						 		// 跳转到下载页面
						 		comm.goUrl('../download/download.html');
						 	}
						});
						theTip.show();
						break;
					// 注册第三方
					case '1':
						comm.goUrl('thirdRegister.html' );
						break;
					// 未注册
					case '0':
						comm.goUrl( 'register2.html' );
						break;
				}
		}
		registerService.send();
	}

};

register.init();
