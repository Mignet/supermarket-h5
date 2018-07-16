/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 **/
var $ = require('zepto');
var comm = require('modules/common/common');
var native = require('modules/common/native');
var service = require('modules/common/service');
var Swiper = require('modules/library/swiper/swiper');
var api = require('modules/api/api')
var loading = require('modules/widget/loading/loading');

var card = {
    init: function () {
        var self = this;
        var query = comm.getQueryString();
        this.type = query.type;
        if (native.isApp && native.source === 'android') {
            if (native.source === 'android') {
                native.getAppToken(function (data) {
                    self.token = data || query.token || '';
                    if(!self.token){
                        try{
                            native.action('tokenExpired')
                        }catch(err){}
                    }
                    self.render();
                });
            }
        } else {
            this.token = query.token || sessionStorage.getItem("__token__");
            this.render();
        }
    },
    /**
     * 数据渲染并执行轮播
     **/
    render: function () {
        var self = this;
        var username = $(".username");
        var mobile = $('.mobile');
        var qrcode = $(".qrcode")
        var renderService = new service();
        renderService.api = api.userInfo;
        renderService.data = {
            token: self.token,
            type: self.type || 1
        };
        renderService.success = function (result) {
            loading.show();
            var userName;
            if (result.userName.length > 3) {
                userName = result.userName.substr(0, 1) + '**' + result.userName.substr(-1, 1)
            } else {
                userName = result.userName;
            }
            username.text(userName);
            mobile.text(result.mobile);
            qrcode.attr('src', comm.getServerImg(result.qrcode))
            native.appController(function () {
                return new Swiper('.card-container', {
                    spaceBetween: 20,
                    loop: true,
                    speed: 1000,
                    centeredSlides: true,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    lazyLoading: true,
                    onInit: function () {
                        loading.hide();
                    }
                })
            });
        };
        renderService.send();
    }
}
card.init();