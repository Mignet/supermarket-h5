/**
 * @require style.css  
*/
var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var service 	= require('modules/common/service');
var api 	    = require('modules/api/api');
var share 	    = require("modules/widget/share/share");

var download = {
	// 初始化
	init: function () {
		this.getDownload();
		this.isWebChat = comm.isWebChat()
		if(!this.isWebChat){
            $(".downloadtip").hide();
		}else{
			share.show('请点击右上角菜单，选择在浏览器中打开下载');
		}
		// 事件绑定
		this.events();
	},

	events : function(){
		var self = this;
		// 显示分享提示
		$('#downloadButton a').on('click',function(){
			if( self.isWebChat ){
				share.show('请点击右上角菜单，选择在浏览器中打开下载');
				return false;
			}
		});
	},

	// 通过接口获取下载app地址及版本信息
	getDownload: function () {
		var downloadService = new service();
		downloadService.api = api.downloadAppList;
		downloadService.success = function(result){
			var arr = result.datas;
			if($.isArray(arr)){
				for(var i =0; i < arr.length; i++ ){
					if( arr[i].platform.toLowerCase() == 'android' ){
						$('#androidDown').attr('href',arr[i].downloadUrl);
	                    $("#androidDownVersion").text("（"+arr[i].version+" 版本） 更新时间："+arr[i].issueTime.trim().split(' ')[0])
					}

					if( arr[i].platform.toLowerCase() == 'ios' ){
						$('#iphoneDown').attr('href',arr[i].downloadUrl);	
						$("#iphoneDownVersion").text("（"+arr[i].version+" 版本） 更新时间："+arr[i].issueTime.trim().split(' ')[0]);	
					}
				}
			}
		}
		downloadService.send();
	}

};

download.init();