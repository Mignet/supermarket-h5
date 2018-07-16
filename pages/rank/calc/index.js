/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 *
*/
var $       = require("zepto");
var Swiper = require('modules/library/swiper/swiper');
var native         = require('modules/common/native');

var calc = {
    init:function(){
        var self = this;
        this.swiperSlide();
        this.bindEvent();
        $(".wraper").css('visibility',"visible");
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.showTopRightText();
                $(".bottom").show();
            });
        }
    },
    bindEvent:function(){
        $("#calcButton").on('click',function(){
            native.action('jumpCfgLevelCalculate')
        });
    },
    showTopRightText:function(){
        native.action('removeLocalSharedBtn');
        native.action("showTopRightText",{
            rightText : '说明',
            url:publicConfig.static + 'pages/rank/rank_desc.html'
        })
    },
    swiperSlide:function(){
        var mySwiper = new Swiper('.swiper-container',{
            spaceBetween : 20,
            setWrapperSize:false,
            pagination : '.swiper-pagination',
            onTransitionEnd:function(swiper){
                $('.center').children("ul").hide();
                for(var i=0;i<$('.center').children("ul").length;i++){
                    if($('.center').children("ul").eq(i).data('id') === swiper.activeIndex){
                        $('.center').children("ul").eq(i).show();
                    }
                }
            }
        })
    }
};

calc.init();
