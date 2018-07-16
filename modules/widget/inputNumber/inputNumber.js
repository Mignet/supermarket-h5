/**
 * @require style.css
 */
var $ = require("zepto");

// 构造函数
function inputNumber( actionEle, max, isShow ){
	this.actionEle = actionEle;
	this.max = max || 6;
	this.arr = [];
	this.init();
	if(isShow){
		this.show();
	} 
}

// 设置ID
inputNumber.prototype.id = '#myKeyboard';

// 引入模板
inputNumber.prototype.tem = $(__inline("inputNumber.tmpl"));

// 初始化
inputNumber.prototype.init = function(){
	$(this.id).remove();
	$('body').append(this.tem);
	this.ele = $(this.id);
	this.hideButton = this.ele.find('.dropdown');
	this.backspace = this.ele.find('.backspace');
	this.li = this.ele.children();
	this.ele.css('opacity','0');
	this.hide();
	this.evt();
}

// 显示
inputNumber.prototype.show = function(){
	this.ele.css('opacity','1');
	this.ele.css('bottom',0);
}

// 隐藏
inputNumber.prototype.hide = function(){
	this.ele.css('bottom',-this.ele.height());
}

// 事件绑定
inputNumber.prototype.evt = function(){
	var _this = this;
	// 点击隐藏按钮隐藏
	this.hideButton.on('touchend',function(){
		_this.hide();
	});

	// 点击切换背景颜色
	this.li.on('touchend',function(){
		$(this).children().addClass('active');
		var my = $(this);
		setTimeout(function(){
			my.children().removeClass('active');
		},150);
		return false;
	});

	// 点击切换背景颜色
	$(document).on('touchend',function(){
		_this.hide();
	});

	//点击元素
	this.actionEle.children().on('touchend',function(){
		_this.show();
		return false;
	});

	// 点击数字
	this.li.on('touchend','label',function(){
		if( _this.arr.length < _this.max ){
			_this.arr.push($(this).attr('data-number'));
			_this.actionEle.children().each(function(i){
				if( i <  _this.arr.length ){
					$(this).text('*');
				}
			});

			//返回回调数据
			if( typeof _this.callback == 'function' ){
				_this.callback( _this.arr );
			}

		}
	});

	// 回删数字
	this.backspace.on('touchend',function(){
		if( _this.arr.length > 0 ){
			_this.arr.pop();
			_this.actionEle.children().each(function(i){
				if( i <  _this.arr.length ){
					$(this).text('*');
				}else{
					$(this).text('');
				}
			});
			if( typeof _this.delFun == 'function'){
				_this.delFun();
			}
		}
	});
}

inputNumber.prototype.clearInput = function(fn){
	var _this = this;
	setTimeout(function(){
		_this.arr = [];
		_this.actionEle.children().text('');
		_this.hide();
		if(fn){
			fn();
		}
		
	},800);
}


module.exports = inputNumber;
