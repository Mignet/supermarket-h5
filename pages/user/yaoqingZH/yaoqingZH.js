	/**
	 * @require yaoqingZH.css
	 * @require modules/library/swiper/swiper.css
	 */    
	var $ 	   = require("zepto");
    var comm 		= require("modules/common/common");
    var Swiper = require('modules/library/swiper/swiper');
    var checkForm = require("modules/common/checkForm");
    var service 	= require('modules/common/service');

    var understand = {
    	init : function(){
           this.initEvent();
           this.initSwiper();
            var self = this;
            new checkForm({
                isCheckPassword : false,
                isSetButtonState : true,
                formEle : $('#loginFrom'),
                buttonEle : $('#loginSub'),
                callback : function(data){
                    self.goLogin(data);
                }
            });
    	},

        goLogin: function(formData) {
    	    var self = this;
            formData.activityType = 1;
            var loginService = new service();
            loginService.api = 'user/saveShareUser';
            loginService.data = formData;
            loginService.success = function(result){
                self.compelte();
            }
            loginService.send();

        },

        compelte: function() {
            $('.login-div').hide();
            $('.login-complete').show();
            $('.login-pop').show();
            setTimeout(function(){
                $('.login-pop').hide();
            }, 2000);
        },

    	initSwiper:function(){
    		var self = this;
	        new Swiper('.swiper-container', {
	            direction       : 'vertical',
	            longSwipesRatio : 0.1,
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
    		});
            $('input').on('focus', function(){
                $('.title').hide();
                $('.loginForm').css('margin-top', '0');
            }).on('blur', function(){
                $('.title').show();
                $('.loginForm').css('margin-top', '.8rem');
            });
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



