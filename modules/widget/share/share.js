/**
 * @require style.css
 */
var $ 	= require("zepto");
if( $('body').height() < $(window).height() ){
	$('body').height( $(window).height() );
}

var share = {
	id : 'share',
	isShowMsg: true,
	temp : function(msg){
		tempStr = '<div class="share" id="'+this.id+'">'
				+'		<div class="shareContent"><p>'+this.msg+'</p></div>'
				+'		<div class="shareBg"></div>'
				+'	</div>';
		return tempStr;
	},
	show: function(msg){
		var _this = this;
		this.msg = msg || '请点击右上角将本链接发送给指定朋友或分享到朋友圈';
		$('#share').remove();
		$('body').append( this.temp() );
		this.ele = $('#share');
		$('body').find('.shareBg').on('click',function(){
			_this.hide();
		});
	},
	hide: function(){
		if(this.ele){
			this.ele.remove();
		}
		
		if( this.callback ){
			this.callback();
		}
	}

}

module.exports = share;