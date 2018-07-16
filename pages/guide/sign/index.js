/*
* @require ./style.less
*/
var $ = require('zepto')
var comm = require('modules/common/common');
var tipBox = require('modules/widget/tipBox/tipBox');
var service = require('modules/common/service');
var api = require('modules/api/api');

sign = {
	init:function(){
		var query = comm.getQueryString();
		this.recommendCode = query.recommendCode
		this.name = query.name
		var recommendCode = '';
		if (query.recommendCode) {
		    recommendCode = comm.hideMiddleStr(query.recommendCode);
		}

		var name = decodeURI(decodeURI(getQueryString2().name))
		var recommendText = comm.hideName(name) || recommendCode;

		if (recommendText == 'null' && recommendCode) {
		    recommendText = recommendCode;
		}

		if (recommendText == 'undefined' && recommendCode) {
		    recommendText = recommendCode;
		}

		if (!(query && query.recommendCode)) {
		    $('.recommendText').hide();
		} else {
		    $('#recommendMob').html(recommendText);
		    $('.recommendText').show();
		}
		this.bindEvent()
		this.getSignStatistics()

	},
	bindEvent:function(){
		var self = this
		$("#goRegister").on('click',function(){
			// 注册链接
			var REGISTER_URL = "";
			if(self.name){
			    REGISTER_URL = publicConfig.leicaiDomain + 'pages/user/inviteRegister.html?recommendCode=' + self.recommendCode + '&name=' + encodeURIComponent(self.name)
			}else{
			    REGISTER_URL = publicConfig.leicaiDomain + 'pages/user/inviteRegister.html?recommendCode=' + self.recommendCode
			}
			var time = 3;
			var box = new tipBox({
				msg:'请注册后到APP进行签到,<span id="countdown">'+time+'</span>s后跳转注册页面',
				delay:3200,
				callback:function(){
					location.href = REGISTER_URL
				}
			});
			box.show();
			setInterval(function(){
				time--
				$("#countdown").text(time)
			},1000)
		})
	},
	getSignStatistics:function(){
		 var self = this;
        var getSignStatisticsService = new service();
        getSignStatisticsService.api = api.signStatistics;
        getSignStatisticsService.data = {
            mobile: self.recommendCode
        };
        getSignStatisticsService.success = function (result) {
        	$("#money").text(result.totalBouns)
        };
        getSignStatisticsService.send();
	},
}

sign.init()

//获取url中search部分字符串为json对象
function getQueryString2(search) {
    var url = search || location.search;
    var request = {};
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      arr = str.split("&");
      for(var i = 0; i < arr.length; i ++) {
         request[arr[i].split("=")[0]] = arr[i].split("=")[1];
      }
    }
    return request || {};
}
