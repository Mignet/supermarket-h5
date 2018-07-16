/**
 * @require findPwd2.css  
 */


var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var checkForm 	= require("modules/common/checkForm");
var service 	= require('modules/common/service');
var api 	= require('modules/api/api');
var tipBox      = require('modules/widget/tipBox/tipBox');
var findPwdTip  = new tipBox();

var findPwd2 = {
	// 初始化
	init: function () {
		var _this = this;
		// 获取手机号
		this.queryString = comm.getQueryString();
		// var codeImgSrc = publicConfig.host + '/rest/image/captcha?mobile='+ this.queryString.mobile;
		// console.log(publicConfig.host)
		// $('#imgCode img').attr('src',codeImgSrc).show();
		// 验证码表单配置
		this.sendCodeForm = new checkForm({
			isSetButtonState : true,
			formEle : $('#hadPhoneCode'),
			buttonEle : $('#phoneCode'),
			// 不可点击时的class名 
			// disButtonClass : 'hadSend',		
			callback : function(){
				// 还没有发送验证码出去
				if( !this.buttonEle.hasClass(this.disButtonClass) ){
					_this.sendCode();
				}				
			}
		} );
		this.events();
	},

	events : function(){
		var _this = this;
		// 点击刷新验证码
		// $('#imgCode').on('click',function(){
		// 	_this.refreshImg();
		// });
		var pwdMsg = '请输入6~20位数字、字母和字符组合登录密码';
		// 点击修改密码
		$('#findPasswordSub').on('click',function(){
			if( $.trim( $('#inputPhoneCode').val() ) == '' ){
				findPwdTip.show('请先输入手机验证码');
			}else{
				var registerPwd  =  $('#registerPwd').val();
				if( registerPwd == '' ){
					findPwdTip.show('请输入新密码');
				}else{
					if( isPwdReg( registerPwd ) ){
						_this.changePwd();
					}else{
						findPwdTip.show(pwdMsg);
					}
				}

			}
		});

		// 密码验证  返回正确或者错误
		function isPwdReg(val){
			var reg1 = /^\d{6,20}$/;
			var reg2 = /^[a-z]{6,20}$/i;
			var reg3 = /^[^0-9a-z]{6,20}$/i;
			if(val.length < 6 || val.length > 20){
				return false;
			}else{
				if( reg1.test(val) || reg2.test(val) || reg3.test(val) ){
					return false;
				}else{
					return true;
				}	
			}
		}

		// 显示隐藏密码
		$('#eyes').on('click',function(){
			if( $(this).hasClass('openEyes') ){
				$(this).removeClass('openEyes');
				$('#registerPwd').prop('type','password');
			}else{
				$(this).addClass('openEyes');
				$('#registerPwd').prop('type','text');
			}
		})


	},

	// // 刷新验证码
	// refreshImg : function (){
	// 	$('#imgCode').find('img').attr('src',$('#imgCode').find('img').attr('src'));
	// 	console.log($('#imgCode').find('img').attr('src'))
	// },

	// 校验图形验证码
	sendCode : function(){
		var _this = this;
		var checkImgService = new service();
		checkImgService.api = api.sendVcode;
		checkImgService.data = {
			mobile : this.queryString.mobile,
			type : 2
		};

		checkImgService.success = function(result){			
			$('#formTitle').text('已发送短信验证码至' + comm.hideMiddleStr( _this.queryString.mobile, 3, 4 ));
			_this.sendCodeForm.countdown();
		}
		checkImgService.error = function(msg){
            comm.alert(msg);
		}
		checkImgService.send();

	},

	// 重置密码
	changePwd : function(){
		var _this = this;
		var registerService = new service();
		registerService.isHttps = true;
        registerService.api     = api.resetLoginPwd
		registerService.data    = {
			mobile : this.queryString.mobile,
			vcode : $('#inputPhoneCode').val(),
			newPwd : $('#registerPwd').val()
		}
		registerService.success = function(result){
			var theTip = new tipBox({
				msg : '恭喜，重置密码成功！',
				callback : function(){
					comm.goUrl('login.html');
				}
			});
			sessionStorage.setItem("__mobile__", _this.queryString.mobile);
			theTip.show();
		}
		registerService.send();
	}

};

findPwd2.init();
