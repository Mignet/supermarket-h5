/**
 * @require style.less
 * @require modules/library/swiper/swiper.css
 *
*/
var $       = require("zepto");
var comm = require('modules/common/common');
var swiper = require('modules/library/swiper/swiper');
var native = require('modules/common/native');

var know = {
    init:function(){
        var self = this;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.appSelfShare();
            });
        }
        this.bindEvent();
    },
    bindEvent:function(){
        $(".swiper-container").height($(window.parent).height());
        var pageIndex = comm.getQueryString().pageIndex || 0;
        new swiper ('.swiper-container', {
            direction : 'vertical',
            initialSlide:pageIndex,
            longSwipesRatio : 0.1,
            lazyLoading : true,
            lazyLoadingInPrevNext : true,
            iOSEdgeSwipeDetection:true,
            longSwipes:false,
            resistanceRatio:0
        });
    },
    appSelfShare:function(){
        var shareData = {
            shareDesc:"平台安全，资金更安全",
            shareImgurl:"dfa3e35be331f6ec67566130f67820b9",
            shareLink: publicConfig.static + 'pages/guide/safeShield.html',
            shareTitle:"貅比特安全保障"
        }
        native.action("getSharedContent",shareData)
    }
};

know.init();
