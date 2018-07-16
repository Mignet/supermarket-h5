// 初始化
function toCheckForm(options) {
    for (key in options) {
        this[key] = options[key];
    }
    this.init();
};

toCheckForm.prototype = {

    // 修正constructor
    constructor: toCheckForm,

    // 输出json数据元素来源
    inputStr: 'input,textarea,select',

    // 需要验证的表单元素
    checkStr: 'input[required],input[pattern],textarea[required],textarea[pattern],input[type=password]',

    // 是否启用密码校验
    isCheckPassword: true,

    // 校验提交按钮是否可以点击
    isSetButtonState: true,

    // 不可点击时按钮class名
    disButtonClass: 'disButton',

    // 获取验证码倒计时默认时间
    countdownTime: 60,

    regs: {
        // 手机号正则
        mobile: '^1\\d{10}$',

        // 邮箱正则
        email: '^(\\w-*\\.*)+@(\\w-?)+(\\.\\w{2,})+$',

        // 数字
        number: '^[0-9]*$',

        // 中文
        chinese: '^[\\u4e00-\\u9fa5],{0,}$'
    },

    // 初始化
    init: function () {
        if (this.isSetButtonState) {
            this.setButtonState();
            this.events();
        }
    },

    // 检测表单,暂时只支持正则与必填的校验
    isChecked: function (formEle) {
        var formEle = formEle || this.formEle;
        var _this = this;
        var checkEles = formEle.find(this.checkStr);
        var isSuccess = true;

        if (checkEles.size() > 0) {
            for (var i = 0; i < checkEles.size(); i++) {

                // 正则不匹配
                if (checkEles.eq(i).attr('pattern') && !_this.isPattern(checkEles.eq(i))) {
                    isSuccess = false;
                    break;
                }

                // 必填项有误
                if (checkEles.eq(i).attr('required') && !_this.isRequired(checkEles.eq(i))) {
                    isSuccess = false;
                    break;
                }

                // 开启密码校验
                if (_this.isCheckPassword) {
                    // 密码校验
                    if (checkEles.eq(i).attr('type') == 'password' && !_this.isPassword(checkEles.eq(i))) {
                        isSuccess = false;
                        break;
                    }
                }

            }
        }

        // 附加自行定义规则
        if (isSuccess && (typeof _this.specialCheck == 'function' && !_this.specialCheck())) {
            isSuccess = false;
        }

        return isSuccess;
    },

    // 必填项校验
    isRequired: function (ele) {
        var val = ele.val();
        if (val.trim() != '') {
            return true;
        } else {
            return false;
        }
    },

    // 密码校验
    // 6~20数字、字母、特殊符号组合
    isPassword: function (ele) {
        if (isPwdReg()) {
            return true;
        } else {
            return false;
        }


        // 密码验证
        function isPwdReg() {
            var val = ele.val();
            // var reg1 = /^\d{6,20}$/;
            // var reg2 = /^[a-z]{6,20}$/i;
            // var reg3 = /^[^0-9a-z]{6,20}$/i;
            // if(val.length < 6 || val.length > 20){
            // 	return false;
            // }else{
            // 	if( reg1.test(val) || reg2.test(val) || reg3.test(val) ){
            // 		return false;
            // 	}else{
            // 		return true;
            // 	}
            // }

            if (val.length < 6 || val.length > 20) {
                return false;
            } else {
                return true;
            }
        }
    },

    // 是否为手机号码
    isMobile: function (ele) {
        return this.isPattern(ele, this.regs.mobile);
    },

    // 是否全部为数字
    isNumber: function (ele) {
        return this.isPattern(ele, this.regs.number);
    },

    // 邮箱校验
    isEmail: function (ele) {
        return this.isPattern(ele, this.regs.email);
    },

    // 中文校验
    isChinese: function (ele) {
        return this.isPattern(ele, this.regs.chinese);
    },

    // 正则项校验
    isPattern: function (ele, regStr) {
        var val = ele.val();
        regStr = regStr || ele.attr('pattern');
        var reg = new RegExp(regStr, 'i');
        if (reg.test(val.trim())) {	// 正则匹配通过
            return true;
        } else {	// 正则匹配未通过
            return false;
        }
    },

    // 获取表单json数据
    getFormJson: function (formEle) {
        var formEle = formEle || this.formEle;
        var inputEles = formEle.find(this.inputStr);
        var jsonData = {};
        inputEles.each(function () {
            var key = this.name;
            var val = $(this).val();
            if (key) {
                if (key in jsonData) {	//多个值的控件处理（如checkbox）
                    if ($.isArray(jsonData[key])) {
                        jsonData[key].push(val);
                    } else {
                        jsonData[key] = [jsonData[key], val];
                    }
                } else {
                    jsonData[key] = val;
                }
            }
        });
        return jsonData;
    },

    // 输入的时候判断提交按钮是否可以点击
    setButtonState: function () {
        var _this = this;
        var buttonEle = this.buttonEle
        var checkEles = this.formEle.find(this.checkStr);

        if (_this.isChecked()) {
            buttonEle.removeClass(_this.disButtonClass);
        } else {
            buttonEle.addClass(_this.disButtonClass);
        }

    },

    // 事件绑定
    events: function () {

        var _this = this;
        var buttonEle = this.buttonEle
        var checkEles = this.formEle.find(this.checkStr);

        // 输入检测
        checkEles.on('input', function () {
            _this.setButtonState();
        });

        // 提交表单
        buttonEle.on('click', function () {
            if (_this.isChecked() && typeof _this.callback == 'function') {
                _this.callback(_this.getFormJson());
            }
        });
    },

    // 设置按钮状态
    setState: function () {

    },

    // 验证码倒计时
    countdown: function (buttonEle) {
        var buttonEle = buttonEle || this.buttonEle;
        var inputEles = this.formEle.find(this.inputStr);
        console.log(inputEles)
        var _this = this;
        var time = this.countdownTime;
        buttonEle.addClass(this.disButtonClass);
        if (typeof _this.countdownTimer != 'undefined') {
            clearInterval(_this.countdownTimer);
        }
        this.countdownTimer = setInterval(function () {
            if (time > 1) {
                buttonEle.text((--time) + 's重新发送');
            } else {
                _this.clearCountdown(buttonEle);
            }
        }, 1000);
    },

    // 停止倒计时
    clearCountdown: function (buttonEle) {
        var buttonEle = buttonEle || this.buttonEle;
        buttonEle.removeClass(this.disButtonClass);
        buttonEle.text('重新获取验证码');
        this.formEle.find('.imgCode').trigger('click');
        if (typeof this.countdownTimer != 'undefined') {
            clearInterval(this.countdownTimer);
        }
    }

};

module.exports = toCheckForm;
