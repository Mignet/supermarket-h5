	/**
	 * @require understand.css  
	 * @require modules/library/swiper/swiper.css
	 */    
	var $ 	   = require("zepto");
  var Swiper = require('modules/library/swiper/swiper');
    var understand = {
    	init : function(){
           this.initEvent();
           this.initSwiper();
    	},

    	initSwiper:function(){
    		var self = this;
	        new Swiper('.swiper-container', {
	            direction       : 'vertical',
	            longSwipesRatio : 0.1,
              lazyLoading : true,
              lazyLoadingInPrevNext : true,
	            onSlideNextEnd : function(swiper){               	                                    
                  self.animation(swiper.activeIndex);
                  self.change(swiper.activeIndex);
	            },
	            onSlidePrevEnd:function(swiper){
                  self.animation(swiper.activeIndex);
                  self.change(swiper.activeIndex);
	            }            
	        });  		
    	},

    	initEvent : function(){
    		var self = this;
    		$(window).on('load',function(){
    			self.animation(0);
    		})
    	},

    	change : function(index){
        var self = this;
        $(".swiper-wrapper").find('.change').text(0);
        var arr = $(".swiper-wrapper").children().eq(index).find('.change');
        arr.each(function(index,obj){            
            if($(obj).attr("value").indexOf(".") > 0){
              self.numberChange($(obj),1);
            }else{
              self.numberChange($(obj),0);      	  	
            }
        });

    	},

      numberChange : function(obj,len){  
         var self = this;
         var i    = 0;
         var num  = parseFloat(obj.attr("value"));
         var increase = parseFloat(num/(600/25.01));          
         var timeout = window.setInterval(function(){
             i = parseFloat(parseFloat(i) + increase);
             obj.text(i.toFixed(len));
             if(parseFloat(i) >= num){  
                 clearTimeout(timeout);                  
                 obj.text(self.format(num));
             }
         },25.01)
       }, 

  		format : function(nStr){
  			nStr += '';
  			var x = nStr.split('.');
  			var x1 = x[0];
  			var x2 = x.length > 1 ? '.' + x[1] : '';
  			var rgx = /(\d+)(\d{3})/;
  			while (rgx.test(x1)) {
  				x1 = x1.replace(rgx, '$1' + ',' + '$2');
  			}		      
  			return x1 + x2;           	 
  		},

      animation : function(num){
        $(".animation").removeClass('active');
        $(".swiper-wrapper").children().eq(num).find(".animation").addClass('active');
      }    	
    }

	understand.init();



