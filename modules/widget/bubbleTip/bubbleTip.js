/**
 * @require style.css
 */
var $ = require("zepto");

/**
 * title : 提示标题
 * msg : 提示信息
 * buttonText : ['取消','确定']
 * delay : 自动隐藏时间,为0则不自动隐藏
 * isShowBg : 是否显示半透明背景
 * callback : 隐藏后的回调函数
 */

function bubbleTip(options){
	bubbleTip.num++;

	if( typeof options == 'object'){
		for( var key in options ){
			this[key] = options[key];
		}
	}else if( typeof options == 'string'){
		this.msg = options;
	}

}

// 静态属性，id标识
bubbleTip.num = 0;

// 延迟隐藏时间,为0则不自动隐藏
bubbleTip.prototype.delay = 2000;

bubbleTip.prototype.createHtml = function(){
	var eleId = 'bubbleWraper' + bubbleTip.num;
	var theId = '#' + eleId;

	// 元素已经存在，不用创建
	if( $(theId).size() > 0 ){
		return false;
	}

	// 创建元素
	var htmlStr = '<div class="bubbleWraper" id="' + eleId + '">'
				+	'<div class="bubble">';
		if( this.title ){
			htmlStr += '<h1>' + this.title + '</h1>';
		}

		htmlStr +=		'<div class="bubbleMsg"><p>' + this.msg + '</p></div>';

		if( this.buttonText ){
			htmlStr += '<div class="bubbleButton">';
			if( $.isArray( this.buttonText ) ){
				for( var i = 0; i < this.buttonText.length ; i++ ){
					htmlStr += '<a>' + this.buttonText[i] + '</a>';
				}
			}else{
				htmlStr += '<a>' + this.buttonText + '</a>';
			}
			htmlStr += '</div>';
		}

		htmlStr +=	'</div>'
				+	'<div class="bubbleBg"></div>'
				+   '</div>';

	$('body').append( htmlStr );
	this.wraper = $(theId);
	$(".bubbleWraper").height($("body").height());
	var ele = this.wraper.children('.bubble');
	// 设置垂直居中
	this.wraper.css({ display : 'block','opacity' : 0 });
	if($(window.parent)){
		ele.css('top', ( $(window.parent).height() - ele.height() )/2 );
	}else{
		ele.css('top', ( $(window).height() - ele.height() )/2 );
	}
}

// 显示提示
bubbleTip.prototype.show = function( msg ){
	if( typeof msg !== 'undefined' ){
		this.msg = msg;
	}
	this.createHtml();
	$(".sureFocus").focus()
	this.wraper.css( { display : 'block','opacity' : 1 } );
	this.events();
}

// 事件处理
bubbleTip.prototype.events = function(){
	var _this = this;
	this.wraper.find('.bubbleBg').on('click',function(){
		_this.wraper.css({ display : 'none','opacity' : 0 });
	});

	this.wraper.find('.bubbleButton').on('click','a',function(){
		_this.hide();
		if(typeof _this.callback == 'function'){
			_this.callback($(this).index());
		}
	});
}


// 隐藏提示
bubbleTip.prototype.hide = function(){
	this.wraper.hide();
}

module.exports = bubbleTip;