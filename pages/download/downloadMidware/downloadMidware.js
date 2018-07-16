  /**
  * @require style.css  
  * @require swiper.css
  */    
  var $ 	   = require("zepto");
  var Swiper = require('./swiper');
var comm    = require("modules/common/common");

  var dm = {
      initSwiper:function(){
        new Swiper('.swiper-container', {
            direction: 'vertical',
            longSwipesRatio:0.1                   
        });  		
        $('.btn').on('click', function(e){
          comm.goUrl('./download.html');
        });
      }    	
  }

  dm.initSwiper();



