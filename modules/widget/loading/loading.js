/**
 * @require loading.css
 */
var $ 	= require("zepto");
var loading = {
	id : 'loading',
	defaultMsg : '正在加载中....',
	isShowMsg: true,
	temp : function(msg){
		tempStr = '<div class="loading" id="'+this.id+'">'
				+'		<div class="loadContent">'
				+'			<div class="loadingBg"></div>'
				+'		</div>'
				+'		<div class="loadingMask"></div>'
				+'	</div>';
		return tempStr;
	},
	show: function(msg,isShowMsg){
		isShowMsg = isShowMsg || this.isShowMsg;
		if(isShowMsg){
			this.msg = msg || this.defaultMsg;
			$('#loading').remove();
			$('body').append( this.temp() );
			this.ele = $('#loading');
			this.ele.css('display','block');
			// this.ele.find('.loadContent').css('opacity','1');
		}

	},
	hide: function(){
		if(this.ele){
			this.ele.remove();
		}
	}

}



module.exports = loading;
