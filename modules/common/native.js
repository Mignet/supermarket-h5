// android与ios交互处理对象

var comm = require("modules/common/common");

function Native(){
	if( Native.unique ){	// 启用单例模式，保证实例为同一个
		return Native.unique;
	}
	Native.unique = this;
    this.init();
}

Native.prototype = {

	// 修正constructor
	constructor : Native,

	// 初始化
	init : function(){
		var self = this;
		var search = location.search;
		var query = comm.getQueryString();
		if(comm.isIOS() && search.indexOf('channel_ios') > -1  && ! query.os){	//当前环境为ios的app中
			this.source =  'ios';
		}else if(comm.isAndroid() && typeof AppObject == 'object' && ! query.os ){	//当前环境为android的app中
			this.source = 'android';
		}else{
			this.source = "";
		}

		if(comm.isIOS() && query.isApp && query.isApp === 'liecai'){
			this.source =  'ios';
		}

		if( this.source ){
			this.isApp = true;
		}

		if(this.source === 'ios'){
			this.setupWebViewJavascriptBridge(function(bridge){
				bridge.registerHandler('swiperEvent', function(data, responseCallback) {
					self.mySwiper.slideNext();
				    responseCallback(data)
				})
			})
		}

		this.setupJavaBridge();
	},

	// 获取app的token
	// ios中为异步执行，暂时只能采用回调函数的形式
	getAppToken : function(fn){
		this.action('getAppToken',null,fn);
	},

	// app退出登录
	// appLogOut : function(){
	// 	this.action('getAppLogOut');
	// },

	// 调用app分享功能
	appShare : function( shareData ){
		this.action('getAppShareFunction',shareData);
	},

	// 第三方浏览器打开
	gotoWeb : function(urlObj) {
		this.action('buyTBProduct', urlObj);
	},

	//获取版本号
	getAppVersion : function(fn){
		this.action('getAppVersion',null,fn)
	},

	//app调用原生js方法
	appController : function(callback){
		if(typeof callback == 'function'){
			this.mySwiper = callback();
		}
	},

	//获取位置坐标
	getPositionCoordinate : function(jsonObj){
		this.action('getPositionCoordinate',jsonObj)
	},
	nativeConfigDataHandle:function(androidName,androidParamsKey,androidParams,iosName,iosMethod,iosParams){
	    var result = {
	        android:{
	            name:androidName,
	            paramsKey:androidParamsKey,
	            params:androidParams
	        },
	        ios:{
	            name:iosName,
	            method:iosMethod,
	            params:iosParams
	        }
	    };
	    return result;
	},
	toAppPage:function(androidName,androidParamsKey,androidParams,iosName,iosMethod,iosParams){
		var data = this.nativeConfigDataHandle(androidName,androidParamsKey,androidParams,iosName,iosMethod,iosParams) || "";
		var result = "";
		if(comm.isAndroid()){
		    result = comm.toBase64(JSON.stringify(data.android))
		}else if(comm.isIOS()){
		    result = comm.toBase64(JSON.stringify(data.ios))
		}
		this.action('jumpToNativePage',result)
	},
	//动态跳转到app具体某个页面
	skipAppPage :function(data){
		var data = data || "";
		var result = "";
		if(comm.isAndroid()){
		    result = comm.toBase64(JSON.stringify(data.android))
		}else if(comm.isIOS()){
		    result = comm.toBase64(JSON.stringify(data.ios))
		}
		this.action('jumpToNativePage',result)
	},
	// app内跳转H5页面
	locationInApp:function(url){
		if(this.isApp){
			location.href = url + "?isApp=liecai"
		}else{
			location.href = url
		}
	},

	// 操作代理
	action : function(str,data,callback){
		var _this = this;
		var appAction = {
			android : function(){
				if( data ){	// android中如果data没有而传了，会出错
					_this.appToken  = AppObject[str]( JSON.stringify(data) );
				}else{
					_this.appToken  = AppObject[str]();
				}
    			if( typeof callback == 'function' ){
    				callback(_this.appToken);
    			}
			},
			ios : function(){
		    	_this.setupWebViewJavascriptBridge(function(bridge){
		    		bridge.callHandler(str, data, function(responseData){
		    			_this.appToken = responseData;
		    			if( typeof callback == 'function' ){
		    				callback(responseData);
		    			}
		    		});
		    	});
			}
		};

		if( this.source ){
			try{
				appAction[this.source]();
			}catch(error){}
		}
	},

	// android桥接处理  把事件添加到window上
	setupJavaBridge : function(){
		var self = this;
		window.androidEvent = function(data){
			if(data === 'swiperEvent'){
				self.mySwiper.slideNext()
			}
		}
	},

	// ios桥接处理
	setupWebViewJavascriptBridge : function(callback){
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
	}

};

module.exports = new Native();