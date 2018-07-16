  /**
  * @require  style.css
  * @require ../swiper/swiper.css
  */    
  var $ 	   = require("zepto");
  var Swiper = require('../swiper/swiper');

  var april = {
      initSwiper:function(){
        new Swiper('.swiper-container', {
            direction: 'vertical',
            longSwipesRatio:0.1          
        });  		
      }    	
  }

  april.initSwiper();



