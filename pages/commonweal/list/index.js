/*
* @require list.less
*/
var $ = require("zepto");
var comm = require("modules/common/common");
var wechatShare = require('modules/common/wechatShare')
var native = require('modules/common/native');
require('modules/widget/download/download');
var fund = {
	init:function(){
		var self = this;
		if(native.isApp){
		    native.getAppToken(function(data){
		    	self.appSelfShare()
		    });
		}else{
			this.wechatShareEvent();
		}

	},
	//微信分享
	wechatShareEvent:function(){
	    var wechatShareData = {
	        title  : '貅比特爱心公益', // 分享标题
	        desc   : '貅比特携手腾讯公益，为爱前行！', // 分享描述
	        link   : publicConfig.leicaiDomain+'pages/commonweal/list.html', // 分享链接
	        imgUrl : publicConfig.imageUrl + 'f84999cb058936d5accb3f6d7ea43956' + '?f=png' // 分享图标
	    };
	    new wechatShare(wechatShareData);
	},
	// app分享
	appSelfShare:function () {
	    var appShareData = {
	        shareTitle: '貅比特爱心公益', // 分享标题
	        shareDesc: '貅比特携手腾讯公益，为爱前行！',
	        shareLink: publicConfig.leicaiDomain+'pages/commonweal/list.html',
	        shareImgurl: 'f84999cb058936d5accb3f6d7ea43956' // 分享图标
	    }
	    native.action("getSharedContent",appShareData)
	},
}

fund.init()