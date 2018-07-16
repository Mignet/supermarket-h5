/**
 * @require style.less
 */
var $ = require("zepto");
var comm = require('modules/common/common');
var Render = require('modules/common/render');
var native = require('modules/common/native');
var api = require('modules/api/api');

var platform = {
	init:function(){
		this.getPlatformDetail()
	},
	getPlatformDetail:function(){
		var self = this;
		new Render({
		    ele: $('.main'),
		    api: api.platfromDetail,
		    data: {
		        orgNo: 'OPEN_DONGFANGHUI_WEB'
		    },
		    filter: self._filter,
		    isShowLoading: true,
		    callback: function (result) {
		    }
		});
	},
	_filter:function(result){
		// orgTag

		// 机构标签
		var orgTagHtml = "";
		var orgTagArr = result.orgTag.split(',')
		orgTagArr.forEach(function(item,index){
			if(item){
				orgTagHtml += '<span>'+ item +'</span>'
			}
		}) 
		result.orgTagHtml = orgTagHtml;
		result.orgLogo = comm.getServerImg(result.platformIco)

		return result
	}
}

platform.init()
