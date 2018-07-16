/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var swiper   = require('modules/library/swiper/swiper');
var wechatShare = require('modules/common/wechatShare')

var vFund = {
    init : function() {
        if(comm.isWebChat()){
            this.wechatShareEvent();
        }
        this.swiperEvent();
    },
    swiperEvent:function(){
        new swiper ('.swiper-container', {
            // 如果需要分页器
            pagination: '.swiper-pagination',
            loop: true,
            autoplay:2500,
            autoplayDisableOnInteraction:false,
            // 如果需要前进后退按钮
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
        }) 
    },
    //微信分享
    wechatShareEvent:function(){
        // 微信分享信息
        var wechatShareData = {
            title  : '猎财大师携手芒果V基金，为慈善助力', // 分享标题
            desc   : '帮助特殊孩子快乐阅读，奉献自己的一份力量', // 分享描述
            link   : window.location.href, // 分享链接
            imgUrl : publicConfig.imageUrl + 'a3fce851ea0b0687b0366f2c123abeea' + '?f=png' // 分享图标
        };
        new wechatShare(wechatShareData);
    }
};

vFund.init();
