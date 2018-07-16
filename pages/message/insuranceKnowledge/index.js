/**
 * @require style.less
*/

var $ = require("zepto");
var ScrollList = require('modules/common/scrollList');
var iScroll = require('./iScroll')
var insuranceKnowledge = {
    init:function(){
    	for(var i=0;i<$(".contentTag").length;i++){
    		var contentTag = $(".contentTag").eq(i);
    		contentTag.html(contentTag.data('minhtml'))
    	}
    	this.bindEvent()
        this.renderScroll()
    },
    bindEvent:function(){
    	$(".seeMoreWrapper").on('click',function(){
    		if($(this).find('.seeMore').hasClass('isMore')){
    			$(this).find('.seeMore').prev('.contentTag').html($(this).find('.seeMore').prev('.contentTag').data('minhtml'))
    			$(this).find('.seeMore').removeClass('isMore').text('查看全部')
    		}else{
    			$(this).find('.seeMore').prev('.contentTag').html($(this).find('.seeMore').prev('.contentTag').data('maxhtml'))
    			$(this).find('.seeMore').addClass('isMore').text('收起')
    		}
    	})

    	$("#tabWrapper").on('click','li',function(){
            var index = $(this).index()
            if(index == 0){
                if (_hmt) {
                    _hmt.push(['_trackEvent', 'tab', 'click', 'T_4_3_1'])
                }
            }else if(index == 1){
                if (_hmt) {
                    _hmt.push(['_trackEvent', 'tab', 'click', 'T_4_3_2'])
                }
            }else if(index == 2){
                if (_hmt) {
                    _hmt.push(['_trackEvent', 'tab', 'click', 'T_4_3_3'])
                }
            }
    		$(this).siblings('li').removeClass('active')
    		$(this).addClass('active')
    		$('#tabContent').children('ul').hide()
    		$('#tabContent').children('ul').eq($(this).index()).show()
            $("#tabContent").scrollTop(1)
    	})

        $("#tabContent").on('scroll',function(){
            startTopScroll = $(this).scrollTop();
           //当滚动条在最顶部的时候
           if(startTopScroll <= 0){
               $(this).scrollTop(1)
           }
           //当滚动条在最底部的时候
           if(startTopScroll + $(this).offsetHeight >= $(this).scrollHeight){
               $(this).scrollTop($(this).scrollHeight() - $(this).offsetHeight() - 1)
           }
        })
    },
    _filter:function(result){
        result.forEach(function(item,index){
            item.img = publicConfig.imageUrl + item.img + '?f=png';
            item.href = publicConfig.leicaiDomain + 'pages/guide/handbook.html?id=' + item.id + '&isApp=liecai'
            return item;
        })
    	return result;
    },
    renderScroll:function(){
        var self = this;
        new iScroll({
            ele:$("#insuranceList"),
            api:'growthHandbook/classifyList/4.1.1',
            isNeedToken:false,
            data:{
                typeCode:5
            },
            show:false,
            dataFilter:self._filter,
            callback:function(result){
            }
        })
    }
}

insuranceKnowledge.init();