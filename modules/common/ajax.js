
// ajax构造函数
function ajax(){}

// 核心逻辑封装
ajax.prototype.send = function(){
	var _this = this;
	this.XHR = this.createXHR();

	// 请求超时处理
	this.ontimeout();

	this.XHR.onreadystatechange = function(){
		if( _this.XHR.readyState == 4 ){
			if( _this.XHR.status ){	// abort后，可能访问不到XHR.status
				if( _this.timer){
					clearTimeout(_this.timer);
				}
				var status = _this.XHR.status;
				if ( status == 304 || (status >= 200 && status < 300)) {
					_this.config.success( _this.XHR.responseText );
				}else{
					_this.config.error( _this.XHR.responseText );
				}
			}else{
				_this.config.error();
			}
		}
	}
	

	var sendData = this.getSendData( this.config.url, this.config.data );
    this.XHR.open( this.config.method, sendData.url, this.config.async );

    // 客户端提交给服务器文本内容的编码方式是URL编码，不设置会出错
    this.XHR.setRequestHeader('Content-type','application/x-www-form-urlencoded');

	this.XHR.send( sendData.data );

}

// 合成需发送数据
ajax.prototype.getSendData = function( url,data ){
	var joinStr = '?';
	var theData = data;

	if( url.indexOf('?') > -1 ){
		joinStr = '&';
	}
	// 解决ajax缓存问题
	url +=  joinStr + 'r=' + new Date().getTime();

	if ( this.config.method.toLowerCase() == "get" ) {
		url += "&" + data;
		data = null;
	}

	return {
		url : url,
		data : data
	}

}


// 创建XMLHttpRequest对象
ajax.prototype.createXHR = function(){
	if( window.XMLHttpRequest ){
		return new XMLHttpRequest();
	}else{
		return new ActiveXObject('Microsoft.XMLHTTP');
	}
}


// 请求超时处理
ajax.prototype.ontimeout = function(){
	var _this = this;
	if( 'timeout' in this.XHR ){	// 原生支持timeout
		this.XHR.timeout = this.config.timeout;
		this.XHR.ontimeout = function(){
			_this.config.onTimeout();
		};
	}else{
		this.timer = setTimeout(function(){
			_this.XHR.abort();
			_this.config.ontimeout();
		}, this.config.timeout );
	}
}


// 公共配置文件
module.exports = ajax;

