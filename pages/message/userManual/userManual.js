/**
 * @require userManual.less
*/
var $ = require('zepto')
var limit = {
    init:function(){
        $("#tabContainer").on('click','li',function(item,index){
            if($(this).hasClass('active')) return;
            $(this).addClass('active').siblings('li').removeClass('active')
            $("#content").children('.tab').hide().eq($(this).index()).show()
        })
    }
}

limit.init();