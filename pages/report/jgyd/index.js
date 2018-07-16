/**
 * @require style.less
 *
*/
var $  = require("zepto");

var evt = {
    init:function(){
        var topHeight = $(".top-gap").height()
        $(document).ready(function(){
            $(window).scrollTop(0)
        })
    	$("#first").on('click',function(){
    		$(this).addClass('active').siblings('li').removeClass('active')
    		document.documentElement.scrollTop = $('#firstContainer').offset().top - topHeight;
    		document.body.scrollTop =  $('#firstContainer').offset().top - topHeight;
    	})
    	$("#second").on('click',function(){
    		$(this).addClass('active').siblings('li').removeClass('active')
    		document.documentElement.scrollTop = $('#secondContainer').offset().top - topHeight;
    		document.body.scrollTop =  $('#secondContainer').offset().top - topHeight;
    	})
    	$("#third").on('click',function(){
    		$(this).addClass('active').siblings('li').removeClass('active')
    		document.documentElement.scrollTop = $('#thirdContainer').offset().top - topHeight;
    		document.body.scrollTop =  $('#thirdContainer').offset().top - topHeight;
    	})
    	$("#four").on('click',function(){
    		$(this).addClass('active').siblings('li').removeClass('active')
    		document.documentElement.scrollTop = $('#fourContainer').offset().top - topHeight;
    		document.body.scrollTop =  $('#fourContainer').offset().top - topHeight;
    	})
    	$("#five").on('click',function(){
    		$(this).addClass('active').siblings('li').removeClass('active')
    		document.documentElement.scrollTop = $('#fiveContainer').offset().top - topHeight;
    		document.body.scrollTop =  $('#fiveContainer').offset().top - topHeight;
    	})
    	$("#six").on('click',function(){
    		$(this).addClass('active').siblings('li').removeClass('active')
    		document.documentElement.scrollTop = $('#sixContainer').offset().top - topHeight;
    		document.body.scrollTop =  $('#sixContainer').offset().top - topHeight;
    	})

        $("#seven").on('click',function(){
            $(this).addClass('active').siblings('li').removeClass('active')
            document.documentElement.scrollTop = $('#sevenContainer').offset().top - topHeight;
            document.body.scrollTop =  $('#sevenContainer').offset().top - topHeight;
        })

        var winHeight = $(window).height();
        $(window).on('scroll',function(){
            var _scrollTop = $(window).scrollTop() 
            if($(window).scrollTop() >= 0 && $(window).scrollTop()< $('#secondContainer').offset().top-winHeight){
                document.getElementById('headerWrapper').scrollLeft=0;
               $("#first").addClass('active').siblings('li').removeClass('active')
           }else if(_scrollTop >= $('#secondContainer').offset().top - winHeight  && $(window).scrollTop()< $('#thirdContainer').offset().top-winHeight){
               $("#second").addClass('active').siblings('li').removeClass('active')
           }else if($(window).scrollTop() >= $('#thirdContainer').offset().top-winHeight && $(window).scrollTop()< $('#fourContainer').offset().top-winHeight){
               $("#third").addClass('active').siblings('li').removeClass('active')
           }else if($(window).scrollTop() >= $('#fourContainer').offset().top-winHeight && $(window).scrollTop()< $('#fiveContainer').offset().top-winHeight){
               $("#four").addClass('active').siblings('li').removeClass('active')
           }else if($(window).scrollTop() >= $('#fiveContainer').offset().top-winHeight && $(window).scrollTop()< $('#sixContainer').offset().top-winHeight){
               $("#five").addClass('active').siblings('li').removeClass('active')
           }else if($(window).scrollTop() >= $('#sixContainer').offset().top-winHeight && $(window).scrollTop()< $('#sevenContainer').offset().top-winHeight){
                $("#six").addClass('active').siblings('li').removeClass('active')
                document.getElementById('headerWrapper').scrollLeft=$("#six").width();
           }else if( $(window).scrollTop() >= $('#sevenContainer').offset().top-winHeight){
                $("#seven").addClass('active').siblings('li').removeClass('active')
                document.getElementById('headerWrapper').scrollLeft=$("#seven").width() + $("#six").width();
           }
        })

    }
};

evt.init();
