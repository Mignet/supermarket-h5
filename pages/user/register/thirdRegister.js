/**
 * @require thirdRegister.css
 */
var $ = require("zepto");
var comm = require("modules/common/common");
var checkForm = require("modules/common/checkForm");
var service = require('modules/common/service');
var api = require('modules/api/api');
var tipBox = require('modules/widget/tipBox/tipBox');

var thirdRegister = {

    // 初始化
    init: function () {
        var _this = this;
        var source = JSON.parse(sessionStorage.getItem('registerPageData')) || {};

        // 上次登录信息
        $('#loginMob').val(source.mobile || '');
        if (source.regSource) {
            $('#login2Title').text('您是' + source.regSource + '用户，' + '输入登录密码可直接激活');
            $('#loginPwd').attr('placeholder', '请输入您的' + source.regSource + '登录密码');
        }

        // 表单配置
        new checkForm({
            formEle: $('#loginFrom'),
            buttonEle: $('#loginSub'),
            isShowErrorMsg: true,
            isCheckPassword: false,
            callback: function (formData) {
                if ($('#isAgree').prop('checked')) {
                    _this.register($.extend({}, source, formData));
                } else {
                    new tipBox().show('请先同意《猎财大师用户使用协议》');
                }
            }
        });
    },

    // 登录操作
    register: function (formData) {
        var _this = this;
        var registerService = new service();
        registerService.isHttps = true;
        registerService.api = api.register;
        registerService.data = formData;
        registerService.success = function (result) {
            var theTip = new tipBox({
                msg: '注册成功,下载app即可使用',
                callback: function () {
                    comm.goUrl('../download/download.html');
                }
            })
            theTip.show();
        }
        registerService.send();
    }

};

thirdRegister.init();
