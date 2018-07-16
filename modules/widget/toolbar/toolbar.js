/**
 * @require style.css
 */
var $ = require("zepto");
function toolbar(n){
	if( toolbar.unique ){	// 启用单例模式，保证实例为同一个
		return toolbar.unique;
	}
	toolbar.unique = this;
	this.create(n);
}

toolbar.prototype = {

	// 修正constructor
	constructor : toolbar,

	// toolbar id
	id : 'toolbar',

	// 当前class
	currentClass : 'current',

	create : function(n){
		n = n || 0;
		if( $( '#' + this.id ).size() < 1 ){
			$('body').append( this.htmlStr() );
		}
		this.ele = $( '#' + this.id );


		this.ele.find('li').eq(n).addClass(this.currentClass);
		this.ele.show();
		// 保持元素在可视区底部
		var _this = this;
		$(window).on('scroll',function(){
			_this.ele.css('bottom',0);
		})

	},

	// 模板
	htmlStr : function(){
		var str	='<div class="toolbarPadding"></div>'
				+'<div class="toolbar" id="' + this.id + '">'
				+	'<ul>'
				+		'<li>'
				+			'<a href="__root__index.html">首页</a>'
				+		'</li>'
				+		'<li>'
				+			'<a href="__root__pages/manage_finances/manage_finances.html">产品</a>'
				+		'</li>'
				+		'<li>'
				+			'<a href="__root__pages/customer_service/customerService.html">客户</a>'
				+		'</li>'
				+		'<li>'
				+			'<a href="__root__pages/mine/mine.html">我的</a>'
				+		'</li>'
				+		'<li>'
				+			'<a href="__root__pages/home/download.html">下载</a>'
				+		'</li>'
				+	'</ul>'
				+'</div>';
		return str;
	}
}

module.exports = toolbar;
