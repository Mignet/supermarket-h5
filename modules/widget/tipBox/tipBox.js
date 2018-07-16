/**
 * @require style.css
 */

var $ = require("zepto");

// options:
// 	为string类型
// 	msg : 提示信息(msg)

// 	json类型
// 	title : 提示标题
// 	msg : 提示信息
// 	delay : 自动隐藏时间,为0则不自动隐藏
// 	isShowBg : 是否显示半透明背景
//  callback : 隐藏后的回调函数

function tipBox(options){
	tipBox.num++;
	this.num = tipBox.num;
	if( typeof options == 'object'){
		for( var key in options ){
			this[key] = options[key];
		}
	}else if( typeof options == 'string'){
		this.msg = options;
	}

}

// 静态属性，id标识
tipBox.num = 0;

// 延迟隐藏时间,为0则不自动隐藏
tipBox.prototype.delay = 2000;

tipBox.prototype.createHtml = function(){
	var eleId = 'tipBoxWraper' + this.num;
	var theId = '#' + eleId;

	// 元素已经存在，不用创建
	if( $(theId).size() > 0 ){
		return false;
	}

	// 创建元素
	var htmlStr = '<div class="tipBoxWraper" id="' + eleId + '">'
				+	'<div class="tipBox">'
				+	'</div>'
				+	'<div class="tipBoxBg"></div>'
				+ '</div>';

	$('body').append( htmlStr );
	this.wraper = $(theId);

	var ele = this.wraper.children('.tipBox');
	this.setInfo();

	// 设置垂直居中
	this.wraper.css({ display : 'block','opacity' : 0 });
	ele.css('top', ( $(window).height() - ele.height() )/2 );
	
}

// 设置提示信息
tipBox.prototype.setInfo = function(){
	var ele = this.wraper.children('.tipBox');
	if( this.title ){
		if( ele.find('h1').size() > 0 ){
			ele.find('h1').html( this.title );
		}else{
			ele.append( '<h1>' + this.title + '</h1>' );
		}
	}

	if( this.msg ){
		if( ele.find('p').size() > 0 ){
			ele.find('p').html( this.msg );
		}else{
			ele.append( '<p>' + this.msg + '</p>' );
		}
	}
}

// 显示提示
tipBox.prototype.show = function( msg ){
	if( typeof msg !== 'undefined' ){
		this.msg = msg;
	}
	this.createHtml();
	this.setInfo();
	this.wraper.css( {display : 'block','opacity' : 1 });

	if( this.delay ){
		this.hide();
	}
}

// 隐藏提示
tipBox.prototype.hide = function(){
	var _this = this;
	clearTimeout(this.timmer);
	this.timmer = setTimeout( function(){
		_this.wraper.css({display : 'none','opacity' : 0});

		if( _this.callback ){	// 执行回调
			_this.callback();
		}
	}, this.delay);
}

module.exports = tipBox;