
var $ = require("zepto");
var comm = require('modules/common/common');
var ajax    = require("modules/common/ajax");
var errorsMsg = require('modules/common/errorsMsg');
var loading = require('modules/widget/loading/loading');
var native         = require('modules/common/native');

// ajax代理处理
function service(){
}

service.prototype = {

    // 修正constructor
    constructor : service,

    // 是否https
    isHttps : false,
    
    //是否需要token
    isNeedToken   : false,

    // 是否提示返回错误
    isShowErrorMsg : true,

    // 是否显示加载提示
    isShowLoading : true,

    // 版本号
    appVersion : '4.6.0',

    send : function(){
        var self = this;
        this.showLoading();
        if(self.async === undefined){
           self.async = true; 
        }
        if(native.isApp){
            native.getAppVersion(function(appVersion){
                self.appVersion = appVersion;
                window.appVersion = appVersion;
                var settting = {
                    url     : self.getURL(),
                    method  : self.method || 'POST',
                    async   : self.async,
                    data    : self.getParams(),
                    timeout : 30000,
                    success : function(data){
                        self.hideLoading();
                        self.onSuccess(data);
                    },
                    error : function(data){
                        self.hideLoading();
                        self.onFail(errorsMsg.systemError,data);
                    },
                    onTimeout : function(){
                        self.hideLoading();
                        self.onFail(errorsMsg.timeoutError);               
                    }
                }
                var request = new ajax();
                request.config = settting;
                request.send();
            })
        }else{
            window.appVersion = this.appVersion;
            var settting = {
                url     : self.getURL(),
                method  : self.method || 'POST',
                async   : self.async,
                data    : self.getParams(),
                timeout : 30000,
                success : function(data){
                    self.hideLoading();
                    self.onSuccess(data);
                },
                error : function(data){
                    self.hideLoading();
                    self.onFail(errorsMsg.systemError,data);
                },
                onTimeout : function(){
                    self.hideLoading();
                    self.onFail(errorsMsg.timeoutError);               
                }
            }
            var request = new ajax();
            request.config = settting;
            request.send();
        }
    },
    /**
     *  接口调用理论成功操作
     */
    onSuccess : function(data){
        var jsonData = JSON.parse(data);
        if( jsonData.code == 0 ){
            this.success(jsonData.data,jsonData);
        }else{
            this.onError(jsonData);
        }
        comm.log( '接口:'+ this.api +'，返回数据为：' );
        comm.log( jsonData );
    },

    /**
     * 接口业务逻辑失败操作
     */
    onError : function( data ){
        if( data.code == "100003"){
            sessionStorage.setItem('__backUrl__', location.href);
            sessionStorage.removeItem('__token__');
            if(native.isApp) {
                try{
                    native.action('tokenExpired')
                }catch(err){

                }
            }
        }else{
            var msg = '';
            if( $.isArray( data.errors ) && data.errors.length > 0 ){
                msg = data.errors[0].msg;
            }else{
                msg = data.msg;
            }
            msg = msg || errorsMsg.systemError;
            this.onFail(msg,data);
        }
    },

    /**
     * 接口调用失败操作
     */
    onFail : function(msg,data){
        if(this.error){
            this.error(msg,data);
        }else{
            if( this.isShowErrorMsg ){
                comm.alert(msg);
            }           
        }
    },
    
    /**
     *  获取请问url
     */
    getURL : function(){
        if( this.isHttps){
            return this.url || publicConfig.httpsServerUrl + this.api;
        }
        return this.url || publicConfig.serverUrl + this.api;               
    },

    /**
     * 组装上传参数
     */
    getParams : function(){
        var sendData = $.extend( {}, this.baseData(), this.data);
        var arr = [];
        for ( key in sendData ) {
            arr.push( key + "=" + encodeURIComponent( sendData[key] ));
        }
        return arr.join("&");
    },    

    /**
     *  添加接口基础参数
     */
    baseData : function(){
        return {
            orgNumber : 'App_channel_wechat',
            appKind   : 'channel',
            appClient : 'wechat',
            appVersion: this.appVersion,
            v         : '1.0.0',
            timestamp : this.getNowDate(),
            token     : sessionStorage.getItem('__token__') || undefined
        }
    },

    /**
     *  获取当前时间戳
     */
    getNowDate : function () {
        var d = new Date();
        var o = {};
        o.y = d.getFullYear();
        o.m = d.getMonth()+1;
        o.d = d.getDate();
        o.h = d.getHours();
        o.min = d.getMinutes();
        o.s = d.getSeconds();
        return o.y+'-'+o.m+'-'+o.d+' '+o.h+':'+o.min+':'+o.s;
    },

    /**
     * 显示加载loading标识
     */
    showLoading : function(){
        if(this.isShowLoading){
            loading.show();
        }
    },

    /**
     * 隐藏加载loading标识
     */   
    hideLoading : function(){
        if(this.isShowLoading){
            loading.hide();
        }
    }
}


module.exports = service;

