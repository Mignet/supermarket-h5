var tipBox 		= require('modules/widget/tipBox/tipBox');
var tip = new tipBox();
var comm 		= require("modules/common/common");
var service 	= require('modules/common/service');
var api 	= require('modules/api/api');
// 初始化
function registerForm( options ){
	for( key in options ){
		this[key] = options[key];
	}
	this.init();
};

registerForm.prototype = {

	// 修正constructor
	constructor : registerForm,

	// 输出json数据元素来源
	inputStr : 'input,textarea,select',

	// 需要验证的表单元素
	checkStr : 'input[required],input[pattern],textarea[required],textarea[pattern],input[type=password]',

	//是否获取了验证码
	isGetVcode :false,

	// 不可点击时按钮class名
	disButtonClass : 'disButton',

	// 获取验证码倒计时默认时间
	countdownTime : 60,

	regs : {
		// 手机号正则
	    mobile : '^1\\d{10}$',

	    // 邮箱正则
	    email : '^(\\w-*\\.*)+@(\\w-?)+(\\.\\w{2,})+$',

	    // 数字
	    number : '^[0-9]*$',

	    // 中文
	    chinese : '^[\\u4e00-\\u9fa5],{0,}$'
	},

	// 初始化
	init : function(){
		this.events();
	},

	// 事件绑定
	events : function(){
		var _this = this;
		var formEle = formEle || this.formEle;
		var checkEles = formEle.find(this.checkStr)

		var buttonEle = this.buttonEle;
		// 验证码
		var getVcodeEle = formEle.find("#getVcode");

		/*
		* 点击后退按钮清空输入框里面的值
		*/
		// for(var i=0;i<checkEles.length;i++){
		// 	checkEles[i].value = "";
		// }

		// 提交表单
		buttonEle.on('click',function(){
			if( _this.isChecked() && typeof _this.callback == 'function' ){
				_this.callback();
			}
		});

		/*
		* 获取验证码
		*/
		getVcodeEle.on('click',function(){
			if($(this).hasClass(_this.disButtonClass)){
				return;
			}
			_this.getVcode();
		})
	},

	// 检测表单,暂时只支持正则与必填的校验
	isChecked : function(formEle){
		var _this = this;
		var formEle = formEle || this.formEle;
		var isSuccess = true;

		/*
		* 检测手机号码
		*/
		var mobileEle = formEle.find("#mobile")
		if(!this.isMobile(mobileEle)){
			isSuccess = false;
			return false;
		}

		/*
		* 验证密码
		*/
		var passwordEle = formEle.find("#password");
		if(!this.isPassword(passwordEle)){
			isSuccess = false;
			return false;
		}

		/*
		* 获取验证码
		*/
		var vcodeButton = formEle.find("#getVcode");
		var vcodeEle = formEle.find("#vcode");
		if(!this.isVcode(vcodeEle)){
			isSuccess = false;
			return false;
		}

		/*
		* 协议是否同意
		*/
		var agreementEle = formEle.find("#select");
		if(!this.isAgreement(agreementEle)){
			isSuccess = false;
			return false;
		}
		return true;
	},

	// 必填项校验
	isRequired : function(ele){
		var val = ele.val();
		if( val.trim() != '' ){
			return true;
		}else{
			return false;
		}
	},

	/*
	* 密码校验  : 6~20数字、字母、特殊符号组合
	*/
	isPassword : function(ele){
		// var val = ele.val();
		if(!this.isRequired(ele)){
			tip.show("请输入密码")
			return false;
		}else if(!this.isPattern(ele)){
			tip.show("请输入正确的密码");
			return false;
		}else{
			return true
		}
	},

	// 是否为手机号码
	isMobile : function(ele){
		if(!this.isRequired(ele)){
			tip.show("手机号码不能为空")
			return false;
		}else if(!this.isPattern(ele)){
			tip.show("请输入正确的手机号码");
			return false;
		}else{
			return true
		}
	},

	isVcode :function(ele){
		if(!this.isGetVcode){
			tip.show("请先获取验证码")
			return false;
		}else if(!this.isRequired(ele)){
			tip.show("验证码不能为空")
			return false;
		}else if(!this.isPattern(ele)){
			tip.show("请输入正确的验证码");
			return false;
		}else{
			return true
		}
	},

	isAgreement:function(ele){
		if(!ele.hasClass("select")){
			tip.show("请同意貅比特服务协议");
			return false
		}else {
			return true;
		}
	},

	// 正则项校验
	isPattern : function(ele,regStr){
		var val = ele.val();
		regStr = regStr || ele.attr('pattern');
		var reg = new RegExp( regStr,'i' );
		if( reg.test( val.trim() ) ){	// 正则匹配通过
			return true;
		}else{	// 正则匹配未通过
			ele.val("");
			return false;
		}
	},

	// 获取表单json数据
	getFormJson : function(formEle){
		var formEle = formEle || this.formEle;
		var inputEles = formEle.find( this.inputStr );
		var jsonData ={};
		inputEles.each(function(){
			var key = this.name;
			var val = $(this).val();
			if(  key ){
				if( key in jsonData ){	//多个值的控件处理（如checkbox）
					if($.isArray(jsonData[key])){
						jsonData[key].push(val);
					}else{
						jsonData[key]=[jsonData[key],val];
					}
				}else{
					jsonData[key]=val;
				}
			}
		});
		return jsonData;
	},

	//获取验证码
	getVcode:function(formEle){
		var _this = this;
		var formEle = formEle || this.formEle;
		var mobileEle = formEle.find("#mobile");
		var vCodeButton = formEle.find("#getVcode");
		if(!_this.isMobile(mobileEle)){
			return false;
		}
		this.getUserType(mobileEle.val());
	},

	// 判断用户类型
	getUserType: function (mobile) {
		var _this = this;
		var formData = {mobile:mobile};
		var registerService = new service();
		var queryString = comm.getQueryString();
		registerService.api = api.checkMobile;
		registerService.data = $.extend({},queryString,formData);
		registerService.success = function(result){
				formData.accessUrl = location.href;
				formData.fromUrl   = ""; //现在还没有开发自己的微信公众号，没有推广，所以没有来源
				var registerPageData = JSON.stringify( $.extend( {},queryString,formData,result));
				sessionStorage.setItem('registerPageData', registerPageData);
				switch ( result.regFlag.toString() ){
					// 已注册为理财师
					case '2':
						var theTip = new tipBox({
						 	msg : '你已经是貅比特用户，可直接登录',
						 	callback : function(){
						 		// 跳转到下载页面
						 		comm.goUrl('/pages/download/download.html');
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
						// comm.goUrl( 'register2.html' );
						_this.sendCode(mobile);
						break;
				}
		}
		registerService.send();
	},

	// 校验图形验证码
	sendCode : function(mobile){
		var _this = this;
		var checkImgService  = new service();
        checkImgService.api  = api.sendVcode;
		checkImgService.data = {
			mobile : mobile,
			type   : 1
		};
		checkImgService.success = function(result){
			_this.isGetVcode = true;
			_this.countdown();
		};
		checkImgService.error = function(msg){
			comm.alert(msg);
			setTimeout(function(){
				window.location.reload();
			},2000)
		};
		checkImgService.send();
	},

	// 验证码倒计时
	countdown : function(){
		var _this = this;
		var buttonEle = this.formEle.find("#getVcode");
		var time = this.countdownTime;
		buttonEle.addClass(this.disButtonClass);
		if( typeof _this.countdownTimer != 'undefined'){
			clearInterval(_this.countdownTimer);
		}
		this.countdownTimer = setInterval(function(){
			if(time>1){
				buttonEle.text( (--time)+'s重新发送' );
			}else{
				_this.clearCountdown(buttonEle);
			}
		},1000);
	},

	// 停止倒计时
	clearCountdown : function(buttonEle){
		var buttonEle = buttonEle || this.buttonEle;
		buttonEle.removeClass(this.disButtonClass);
		buttonEle.text('重新获取验证码');
		this.formEle.find('#getVcode').trigger('click');
		if( typeof this.countdownTimer != 'undefined'){
			clearInterval(this.countdownTimer);
		}
	}

};

module.exports = registerForm;
