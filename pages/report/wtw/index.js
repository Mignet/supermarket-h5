/**
 * @require style.less
 *
*/
var $  = require("zepto");

var evt = {
    init:function(){
        var isClick = false;
        var idArr = ['first','second','third','four','five','six','seven','eight','nine','ten']
        var topHeight = $(".header-container").height()
        $(document).ready(function(){
            $(window).scrollTop(0)
        })
        $("#header").on('click','li',function(){
            var self = this;
            isClick = true;
            var id = '#' + idArr[$(this).index()]
            document.documentElement.scrollTop = document.body.scrollTop  = $(id).offset().top - topHeight;
            setTimeout(function(){
                $(self).addClass('active').siblings('li').removeClass('active');
                isClick = false;
            },20)
        })

        var winHeight = $(window).height();
        var liWidth = $("#header").children('li').eq(0).width();
        var topArr = [];
        var heightArr = [];

        setTimeout(function(){
            for(var i=0;i<$(".container").length;i++){
                var offset= $(".container").eq(i).offset();
                heightArr.push(offset.height)
                topArr.push(offset.top)
            }
        },1000)

        $(window).on('scroll',scrollEvent)

        function scrollEvent(){
            var scrollTop = $(window).scrollTop();
            for(var i=0;i<topArr.length;i++){
                if(scrollTop >= topArr[i] -winHeight && scrollTop <  topArr[i] + heightArr[i] - winHeight){
                    $("#header").children('li').eq(i).addClass('active').siblings('li').removeClass('active');
                    if(isClick){return}
                    if(i>4){
                        document.getElementById('headerWrapper').scrollLeft=(i-4)*liWidth;
                    }else{
                        document.getElementById('headerWrapper').scrollLeft=0;
                    }
                }
            }
        }

    }
};

evt.init();
