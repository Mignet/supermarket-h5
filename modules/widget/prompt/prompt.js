/**
 * @require style.css
 */

var $ 			= require("zepto");

// 构造函数
function prompt(msg, options){
	this.msg = msg;
	this.options = options || {}
	this.id = this.options.id || 'prompt',
	this.init();
}

// 初始化设置
prompt.prototype.init = function(){

	if( this.wrap ){
		this.wrap.remove();
	}

	$('body').append( this.getHtmlStr( this.id, this.msg ) );
	this.wrap = $('#'+this.id);
	this.ele = this.wrap.find('.proConent');
	if( this.ele.size()>0 ){
		this.ele.css('left', ($(window).width() - this.ele.width())/2 );
		this.ele.css('top', ($(window).height() - this.ele.height())/2 );	
	}
	this.evts();
	this.wrap.hide();

}

prompt.prototype.getHtmlStr = function(id,msg){
	var str = '<div class="'+this.id+'" id="'+id+'">'
				+'<div class="proConent">'
					+'<h1>' + msg +'</h1>'
					+'<ul class="proButtons">'
						+'<li class="proCancel">取消</li>'
						+'<li class="proSure">确定</li>'
					+'</ul>'
				+'</div>'
				+'<div class="proBg"></div>'
			+'</div>';
	return str;
}


// 显示弹窗
prompt.prototype.show = function(){
	if(this.wrap){
		this.wrap.show();
	}
}

// 隐藏弹窗
prompt.prototype.hide = function(){
	if(this.wrap){
		this.wrap.hide();
	}
}
// 事件处理
prompt.prototype.evts = function(){
	var _this = this;
	// 取消隐藏
	this.ele.on('click','.proCancel',function(){
		_this.wrap.hide();
	});

	// 确定执行回调
	this.ele.on('click','.proSure',function(){
		if( typeof _this.callback =='function' ){
			_this.callback();
			_this.wrap.hide();
		}
	});
}

module.exports = prompt;