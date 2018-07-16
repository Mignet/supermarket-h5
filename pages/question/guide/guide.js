/**
 * @require style.css
 */

 var $ 			= require("zepto");
 var comm 		= require("modules/common/common");

var oneMinute = {
    init: function() {
        this.bindEvent();
        this.showHisTab();
    },

    showHisTab: function() {
        var index = sessionStorage.getItem("__guideTabIndex__");
        if( index > 0 ) {
            $('.one-minute-nav a').eq(index).trigger('click');
        }
        sessionStorage.removeItem("__guideTabIndex__");
    },

    bindEvent: function() {
        $('.one-minute-nav a').on('click', function(e) {
            $(this).addClass('act').parent().siblings().children().removeClass('act');
            var index = $(this).parent().index() + 1;
            
            $('#nav-'+index).show().siblings().hide();
        });

        $('.arrow a').on('click', function(e) {
            var index = $('.one-minute-nav a.act').parent().index();
            sessionStorage.setItem("__guideTabIndex__",index);
        });
    }
};
oneMinute.init();
