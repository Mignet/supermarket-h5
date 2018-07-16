/**
 * @require style.css
 */
var $ = require("zepto");
var comm = require("modules/common/common");
var registerForm = require("modules/common/registerForm");
var service = require('modules/common/service');
var api = require('modules/api/api');
var tipBox = require('modules/widget/tipBox/tipBox');
var registerTip = new tipBox();
var register = {
    // 初始化
    init: function () {
        var _this = this;
        var getQueryString = comm.getQueryString();
        var recommendCode = '';
        if (getQueryString.recommendCode) {
            recommendCode = comm.hideMiddleStr(getQueryString.recommendCode);
        }

        var name = decodeURI(decodeURI(getQueryString2().name))
        var recommendText = comm.hideName(name) || recommendCode;

        if (recommendText == 'null' && recommendCode) {
            recommendText = recommendCode;
        }

        if (recommendText == 'undefined' && recommendCode) {
            recommendText = recommendCode;
        }

        if (!(getQueryString && getQueryString.recommendCode)) {
            $('.recommendText').hide();
        } else {
            $('#recommendMob').html(recommendText);
            $('.recommendText').show();
        }

        sessionStorage.removeItem('registerPageData');

        // 注册表单校验
        new registerForm({
            isSetButtonState: true,
            formEle: $('#loginFrom'),
            buttonEle: $('#loginSub'),
            callback: function (data) {
                _this.goRegister();
            },
        });
        this.bindEvent();

    },
    bindEvent: function () {
        $(".input-wrapper").on('click', "#eye", function () {
            if ($(this).hasClass("eye-close")) {
                $(this).removeClass("eye-close").addClass("eye-open");
                $("#password").attr("type", "text")
            } else if ($(this).hasClass("eye-open")) {
                $(this).removeClass("eye-open").addClass("eye-close")
                $("#password").attr("type", "password")
            }
        })

        $("#select").on('click', function () {
            if ($(this).hasClass('select')) {
                $(this).removeClass('select')
            } else {
                $(this).addClass('select')
            }
        })

        $(".register-to-top").on('click', function () {
            document.documentElement.scrollTop = document.body.scrollTop = 0;
        })
    },
    /*
     * 注册
     */
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
        registerService.data.recommendCode = getQueryString.recommendCode;
        registerService.success = function (result) {
            comm.setCookie("__mobile__",$("#mobile").val(),2);
            comm.setCookie("__token__",result.token,2);
            sessionStorage.setItem("__mobile__",$("#mobile").val());
            sessionStorage.setItem("__token__",result.token);
            location.href = "https://liecai.toobei.com/pages/download/download.html"
        };
        registerService.send();
    }
};

register.init();

//获取url中search部分字符串为json对象
function getQueryString2(search) {
    var url = search || location.search;
    var request = {};
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      arr = str.split("&");
      for(var i = 0; i < arr.length; i ++) {
         request[arr[i].split("=")[0]] = arr[i].split("=")[1];
      }
    }
    return request || {};
}
