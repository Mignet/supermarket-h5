/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 * 
*/
var $ = require('zepto');
var Swiper = require('modules/library/swiper/swiper');

var know = {
    init:function(){
        $(".swiper-container").height($(window.parent).height());
        new Swiper ('.swiper-container', {
            direction : 'vertical',
            mousewheelControl : true,
            freeModeSticky :true,
            lazyLoading : true,
            lazyLoadingInPrevNext : true,
            lazyLoadingOnTransitionStart : false,
            lazyPreloaderClass : 'lazy-preloader',
            onTouchStart: function(swiper,event){
                if(swiper.activeIndex === 0){
                    swiper.lockSwipeToPrev();
                }else{
                    swiper.unlockSwipeToPrev();
                }

                if(swiper.isEnd){
                    swiper.lockSwipeToNext();
                }else{
                    swiper.unlockSwipeToNext();
                }
            }
          })        
    },
};

know.init();