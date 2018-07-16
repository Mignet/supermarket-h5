// 获取微信分享信息
var api 	= require('modules/api/api');
var service 	= require('modules/common/service');
var comm = require('modules/common/common')

function wechatShare(shareData){
	if(!comm.isWebChat()) return;
	this.appendScript();
	this.init( shareData );
}

wechatShare.prototype.init = function ( shareData ) {
	var wechatShareService = new service();
	wechatShareService.api = api.wechatShare;
	wechatShareService.isNeedToken = true;
	wechatShareService.isShowLoading = false;
	wechatShareService.data = {
		url : location.href.replace(/#.+$/, '')
	};
	wechatShareService.success = function(result){
		wx.config({
			appId : result.appid,
			timestamp : result.timestamp,
			nonceStr : result.nonceStr,
			signature : result.signature,
			jsApiList : ['showOptionMenu','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ']
		});

		shareData = $.extend({},shareData);
		
		wx.ready(function(){
			// 分享到QQ
			wx.onMenuShareQQ(shareData);
			// 分享到朋友圈
			wx.onMenuShareTimeline(shareData);
			// 分享给朋友
			wx.onMenuShareAppMessage(shareData);
		});

		wx.error(function (res) {
			// alert(res.errMsg);
		});
	}
	wechatShareService.send();
}

wechatShare.prototype.appendScript = function(){
	var head= document.getElementsByTagName('head')[0];
	var script= document.createElement('script');
	script.type= 'text/javascript';
	script.src= 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js';
	head.appendChild(script);
}
module.exports = wechatShare;