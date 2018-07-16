

var $ 			= require("zepto");
var checkForm = require("modules/common/checkForm");
var api 	= require('modules/api/api');
var service 	= require('modules/common/service');
var tipBox      = require('modules/widget/tipBox/tipBox');
var comm 		= require("modules/common/common");
var findPwdTip = new tipBox();

var findPwd = {

	// 初始化
	init: function () {
		var _this = this;

		// 注册表单校验
		new checkForm({
			isSetButtonState : true,
			formEle : $('#loginFrom'),
			buttonEle : $('#loginSub'),
			callback : function(data){
				_this.getUserType( data );
			}
		});
	},


	// 判断用户类型
	getUserType: function (formData) {
		var _this = this;
		var findPwdService = new service();
		findPwdService.isHttps = true;
		findPwdService.api     = api.checkMobile;
		findPwdService.data    = formData;
		findPwdService.success = function(result){
			if( result.regFlag != 2 ){
				findPwdTip.show('用户未注册，请先注册！');
			}else{
				comm.goUrl('findPwd2.html?mobile=' + formData.mobile);
			}
		}
		findPwdService.send();
	}

}

findPwd.init();
