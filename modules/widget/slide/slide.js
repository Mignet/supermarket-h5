/**
 * @require style.css
 */
var $ = require("zepto");
var swipe 	= require('modules/common/swipe');


function slide(wraper,content,clickFn){
	this.wraper = wraper;
	this.content = content;
	this.clickFn = clickFn;
	this.init();
}

slide.prototype = {

	// 修正constructor
	constructor : slide,

	// 每次运动时间
	moveTime : 2500,

	// 运动间隔时间
	delayTime : 800,

	init : function(){
		var _this = this;
		if( this.content.children().size() > 1 ){
			_this.appendMark();
			_this.setSize();
		}
	},

	// 设置宽高
	setSize : function(){
		this.currentNum = -this.content.children().size();
		this.content.append( this.content.html() );
		var wraperWidth  = this.wraper.width();
		var childEle = this.content.children();
		childEle.width( wraperWidth );
		this.content.width( childEle.size() * wraperWidth );
		// this.wraper.height( childEle.height() );
		this.content.css('left', childEle.width() * this.currentNum );
		this.autoPlay();
		this.events();
	},

	appendMark : function(){
		var str = '<div class="bannerMark">'
			for( var i = 0; i < this.content.children().size(); i++ ){
				str +='<span></span>';
			}
		str += '</div>';
		this.wraper.append(str);
		this.mark = this.wraper.find('.bannerMark');
		this.mark.children().eq(0).addClass('current');
	},

	autoPlay: function(){
		var _this = this;
		clearInterval( this.timmer );
		this.timmer = setInterval(function(){
			_this.currentNum--;
			_this.move();
		},2000);
	},

	events : function(){
		var _this = this;
		var childEle = this.content.children();

		this.content.on('touchstart',function(){
			_this.cancelMove();
		});

		new swipe({
			ele : this.content,
			evt : 'swipeH',
			// isPreventDefault : false,
			callback : function(str){
			if( str == 'swipeLeft' ){
				_this.currentNum--;
			}

			if( str == 'swipeRight' ){
				_this.currentNum++;
			}

			if( str == 'tap' ){
				if( typeof _this.clickFn == 'function' ){
					_this.clickFn( -_this.currentNum );
				}
			}

			_this.move();
			_this.autoPlay();

			}
		});
	},

	move : function(){
		var childEle = this.content.children();
		var _this = this;
		var l = childEle.size() / 2;
		if( -this.currentNum == childEle.size()-1 ){
			for(var i = 0; i < l; i++){
				this.content.children().eq( 0 ).appendTo( this.content );
			}
			this.content.css('left', parseInt( this.content.css('left') ) + l * childEle.width() );
			this.currentNum = l + this.currentNum;
		}

		if( this.currentNum == 0 ){
			for(var j = 0; j < l; j++){
				this.content.children().eq( childEle.size()-1 ).prependTo( this.content );
			}
			this.content.css('left', parseInt( this.content.css('left') ) - l * childEle.width() );
			this.currentNum = this.currentNum - l;
		}

		var index = -this.currentNum;
		if( -this.currentNum >= l ){
			index = -this.currentNum -l;
		}

		this.mark.children().eq( index ).addClass('current').siblings().removeClass('current');
		this.bufferMove();
	},


	//缓冲运动
	bufferMove : function (){
		var _this = this;
		var childEle = this.content.children();
		clearInterval( this.bufferTimer );
		this.bufferTimer = setInterval( function(){
			var target = childEle.width() * _this.currentNum;
			var current = parseInt( _this.content.css('left') );
			var speed = ( target-current ) / 8;
			speed = speed > 0 ? Math.ceil( speed ) : Math.floor( speed );
			if( current == target ){
				clearInterval(_this.bufferTimer);
			}else{
				_this.content.css('left', current +  speed);
			}
		},30);
	},

	// 取消运动
	cancelMove : function(){
		clearInterval( this.timmer );
		clearInterval( this.bufferTimer );
	}


}

module.exports = slide;