var $ = require("zepto");
var tipBox = require('modules/widget/tipBox/tipBox');

// 公共对象
function commom(){
	if( commom.unique ){	// 启用单例模式，保证实例为同一个
		return commom.unique;
	}
	commom.unique = this;
    this.init();
}

commom.prototype = {

	// 修正constructor
	constructor : commom,
    
	// 初始化
	init : function(){
	    this.clearCache();
	},

    // 获取服务器配置信息
    getServerDefaultConfig : function(){
        serverDefaultConfig = sessionStorage.getItem('__serverDefaultConfig__');
        if( serverDefaultConfig ){
            return JSON.parse( serverDefaultConfig );
        }else{
            this.alert('请求超时，请稍后重试');
            return '';
        }
    },

    // 跳转代理,flg为true表示url是相对路径，否则url为绝对路径
    goUrl : function(url,flg){
    	if(flg){
    		location.href = publicConfig.root + url;
    	}else{
    		location.href = url;
    	}
    },
    // 生成服务端图片地址
    getServerImg : function(url){
        if(!url) return url;
    	if( url.indexOf('http') == 0 ){
    		return url;
    	}else{
            url = publicConfig.imageUrl + url + '?f=png'
            return url;        
    	}
    },
    // 调试模式数据输出
    log: function(msg){
        if( publicConfig.debug && window.console){
            console.log(msg);
        }
    },
    // 弹出提示信息
    alert : function(msg,callback){
    	if( !this.tip ){
    		this.tip = new tipBox();
    	}
    	this.tip.show( msg );
    },
	// 判断是否为微信
	isWebChat : function(){
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
	 	}else{
			return false;
		}
	},
    //函数节流
    throttle :function(fn,delay,mustRunDelay){
        var timer = null;
        var t_start;
        return function() {
            var context = this;
            var args = arguments;
            var t_curr = +new Date();
            clearTimeout(timer);
            if(!t_start){
                t_start = t_curr;
            }
            if(t_curr - t_start >= mustRunDelay){
                fn.apply(context,args)
                t_start = t_curr
            }else{
                timer = setTimeout(function(){
                    fn.apply(context,args)
                },delay)
            }
        }
    },
    // 加逗号
    toComma:function(num){
        var num = num.toFixed(2);
        var oFloat = num.split('.')[1];
        var oString = (num | 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        var result = oString.concat('.',oFloat)
        return result;
    },
    numberTransform:function(num){
        if (num >= 1000000) {
            if (num >= 100000000) {
                num = this.toComma(num / 100000000) + '亿';
            } else {
                num = this.toComma(num / 10000) + '万';
            }
        }else {
            num = this.toComma(num);
        }
        return num
    },
    // 判断数据类型
    dataType:function(data){
        var result = toString.call(data).replace(/[\[\]]/g,"").split(' ')[1].toLowerCase();
        return result;
    },
	//获取url中search部分字符串为json对象
	getQueryString : function (search) {
		var url = decodeURIComponent ( search || location.search );
		var request = {};
		if (url.indexOf("?") != -1) {
		  var str = url.substr(1);
		  arr = str.split("&");
		  for(var i = 0; i < arr.length; i ++) {
		     request[arr[i].split("=")[0]] = unescape(arr[i].split("=")[1]);
		  }
		}
		return request || {};
	},
    hideMiddleStr : function(str,start,end){
        if(!str) return;
    	var str = str.toString();
    	var start = start || 3;
    	var end = end || 4;
    	var len = str.length - start -end;
    	var hideStr = '';
    	for( var i = 0; i < len; i++ ){
    		hideStr += '*'; 
    	}
    	return str.substring(0,start) + hideStr + str.substring(str.length-end,str.length);
    },
    hideName:function(val){
        if(!val) return ;
        if(val=="undefined" || val == "null") return;
        if(val.length <= 2){
            val = val.substr(0,1) + "*";
        }else {
            var points = "";
            for(var i=0;i<val.length;i++){
                if (i != 0 && i != val.length-1) {
                    points += "*";
                }
            }
            val = val.substr(0,1) + points + val[val.length-1];
        }
        return val;
    },
    // 截取数字两位小数
    toDecimal : function(num,flg,decimal){
    	var decimal = decimal || 2;
    	var thePow = Math.pow(10,decimal);
		var theNum = Math.floor( num * thePow ) / thePow;
		if(flg){	// 不多于两位
			return theNum;
		}else{	// 强制为两位
			return theNum.toFixed(decimal);
		}
    },
    // 数字转换为万及亿
    changeBigData : function(num){
		// 剩余额度转换
		if( num >= 1000000 ){
			if( num >= 100000000 ){
				num = this.toDecimal(num/100000000) +'亿';
			}else{
				num = this.toDecimal(num/10000) +'万';
			}
		}
		return num;
    },

    handleName:function(userName){
        if(userName){
           userName = userName.replace(/./g, function(word, index){
               if( index == 1 ) {
                   return '*';
               } else {
                   return word;
               }
           }); 
        }
        return userName;
    },
    backToTop:function(){
        var scrollTop = this.scrollTop()
        var start = 0;
        var step = 100;
        var per = Math.ceil(scrollTop-start)/100;
        var timer = setInterval(function(){
            if(scrollTop <= 0){
                clearInterval(timer)
            }
            scrollTop = document.documentElement.scrollTop = document.body.scrollTop = scrollTop- per;
        },10)
    },
    //距离顶部的距离
    scrollTop:function(){
        return document.documentElement.scrollTop || document.body.scrollTop;
    },
    isAndroid: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    isIOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    //转码成base64
    toBase64 : function(data) {  
        var toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';  
        var base64Pad = '=';  
        var result = '';  
        var length = data.length;  
        var i;                                                 
        for (i = 0; i < (length - 2); i += 3) {  
            result += toBase64Table[data.charCodeAt(i) >> 2];  
            result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];  
            result += toBase64Table[((data.charCodeAt(i + 1) & 0x0f) << 2) + (data.charCodeAt(i + 2) >> 6)];  
            result += toBase64Table[data.charCodeAt(i + 2) & 0x3f];  
        }
        if (length % 3) {  
            i = length - (length % 3);  
            result += toBase64Table[data.charCodeAt(i) >> 2];  
            if ((length % 3) == 2) {  
                result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];  
                result += toBase64Table[(data.charCodeAt(i + 1) & 0x0f) << 2];  
                result += base64Pad;  
            } else {  
                result += toBase64Table[(data.charCodeAt(i) & 0x03) << 4];  
                result += base64Pad + base64Pad;  
            }  
        }  
        return result;  
    },
    /** Convert Base64 data to a string */ 
    base64ToString :function(data) {  
        var toBinaryTable = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,38, 39, 40,41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];  
        var base64Pad = '=';
        var result = '';  
        var leftbits = 0;
        var leftdata = 0;                                                                         
        for (var i = 0; i < data.length; i++) {  
            var c = toBinaryTable[data.charCodeAt(i) & 0x7f];  
            var padding = (data.charCodeAt(i) == base64Pad.charCodeAt(0)); 
            if (c == -1) continue;  
            leftdata = (leftdata << 6) | c;  
            leftbits += 6;  
            if (leftbits >= 8) {  
                leftbits -= 8;
                if (!padding)  
                    result += String.fromCharCode((leftdata >> leftbits) & 0xff);  
                leftdata &= (1 << leftbits) - 1;  
            }
        }                                    
        if (leftbits)  
            throw Components.Exception('Corrupted base64 string');  
        return result;  
    },
    openApp:function(data){
        var data = data || {ios:{},android:{}};
        var linkData = "";
        if(this.isIOS()){
            linkData = this.toBase64(JSON.stringify(data.ios))
        }else if(this.isAndroid()){
            linkData = this.toBase64(JSON.stringify(data.android))
        }
        location.href = "/pages/download/openApp.html?" + linkData
    },
    appMiddleware:function (hrefData) {
        var hrefData = hrefData
        var openAppData = {
            android: {
                name: 'WebActivityCommon',
                paramsKey: 'url,shareFlag',
                params: publicConfig.leicaiDomain +hrefData +'?isApp=liecai,Boolean_true'
            },
            ios: {
                name: 'UniversalInteractWebViewController',
                method: 'initRequestUrl:requestMethod:',
                params: publicConfig.leicaiDomain + hrefData +'?isApp=liecai,Get'
            }
        }
        var data = openAppData || {ios:{},android:{}};
        var linkData = "";
        if(this.isIOS()){
            linkData = this.toBase64(JSON.stringify(data.ios))
        }else if(this.isAndroid()){
            linkData = this.toBase64(JSON.stringify(data.android))
        }
        location.href = "/pages/download/openApp.html?" + linkData
    },
    redirect : function(url){
        var posUrl = publicConfig.leicaiDomain + url;
        if(this.isWebChat()) {
            location.href = 'https://nliecai.toobei.com/getWechatCode.html?appid=wx83677e6da548b99e&redirect_uri=' + encodeURIComponent(posUrl) + '&scope=snsapi_base&state=1#wechat_redirect';
        } else {
            location.href = posUrl;
        }
    },
    //获取上一个月
    getPreMonth:function() {
        var month = new Date().getMonth() + 1
        var PreMonth = parseInt(month) - 1;
        if (PreMonth == 0) PreMonth = 12;
        return PreMonth;
    },
    setCookie : function(name,value,expiredays){
        var d = new Date();
        d.setDate(d.getDate() + expiredays);
        document.cookie = name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires=" + d.toGMTString())+";path=/";
    },
    getCookie : function (name){
        if (document.cookie.length > 0){
            var start = document.cookie.indexOf(name + "=")
            if (start != -1){ 
                start = start + name.length + 1; 
                var end = document.cookie.indexOf(";" , start);
                if (end == -1){
                    end = document.cookie.length;
                }
                return unescape(document.cookie.substring(start,end));
            } 
        }     
        return '';
    },  
    // 清除缓存
    clearCache : function(){
    	if( this.isClearCache ){
	        $('html').attr('manifest','IGNORE.manifest');
	        $('head').append('<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />');
	        $('head').append('<meta http-equiv="Pragma" content="no-cache" />');
	        $('head').append('<meta http-equiv="Expires" content="0" />');   		
    	}
    },
    extend: function(target) {
        for (var i = 1, len = arguments.length; i < len; i++) {
            for (var prop in arguments[i]) {
                if (arguments[i].hasOwnProperty(prop)) {
                    target[prop] = arguments[i][prop]
                }
            }
        }
        return target
    },
    isArray: function(arr) {
        return Array.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) == '[object Array]'
    }
} 

module.exports = new commom();






