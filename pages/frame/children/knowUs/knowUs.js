/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 * 
*/
var $       = require("zepto");
var comm    = require('modules/common/common');
var Swiper = require('modules/library/swiper/swiper');

var know = {
    init:function(){
        $(".swiper-container").height($(window.parent).height());
        $(".lazy-preloader").eq(0).show();
        var mySwiper = new Swiper ('.swiper-container', {
            direction : 'vertical',
            mousewheelControl : true,
            lazyLoading : true,
            lazyLoadingInPrevNext : true,
            lazyLoadingOnTransitionStart : true
        })        
    },
};
know.init();