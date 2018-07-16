
var $ = require("zepto");
var template = require('modules/common/template');
var service = require('modules/common/service');
var comm = require('modules/common/common');

// 初始化
function iScroll(options){
	for( key in options ){
		this[key] = options[key];
	}
	this.init();
}

iScroll.prototype = {
	//构造函数
	constructor : iScroll,
	//当前页数
	pageIndex : 1,
	//每页条数
	pageSize  : 10,
	//总页数
	pageCount : 1,
	//总条数
	totalCount :0,

	init : function(){
		var self = this;

		this.isLoadingComplete = true;
		this.isMoreData = true;
        //解绑之前绑定的scroll事件
		$(window).off('scroll');

		//ajax服务
		this.scrollService = new service();

		// 获取模板字符串
		this.temStr = this.ele.html();

		// 加载初始数据
		this.getInitData();

		//函数节流
		var throttleGetMoreData = comm.throttle(function(){
	  		var top = comm.scrollTop();
	  		if( $(document).height()-$(window).height() - top <= 20 ){
				self.getMoreData();
			}
		}, 50,100);

		// 滚动加载更多
		$(window).on('scroll',function(){
			throttleGetMoreData();	
		});
	},

	getInitData : function(){
       this.pageIndex = 1;
       this.ele.html("");
       $('#listMore').remove();
       this.getData();
	},

	getMoreData : function(){
		if(this.ele.css('display') == "none") return
		if(this.pageIndex >= this.pageCount) return
		if(!this.isLoadingComplete) return;
		this.pageIndex++;
		this.getData();
	},

	getData : function(){
		var self = this;
		this.isLoadingComplete = false;
		this.scrollService.api  = this.api;
		this.scrollService.isNeedToken = this.isNeedToken;
		this.scrollService.data = $.extend({}, {'pageIndex':this.pageIndex,'pageSize':this.pageSize}, this.data);
        this.removeLoadTip();
        if(this.pageIndex > 1 && this.pageIndex <= this.pageCount){
        	this.scrollService.isShowLoading = false;
			this.ele.after( '<div class="listMore scrollLoading">&nbsp;正在加载</div>' );
        }
		this.scrollService.success = function(result){
			var result = result.growthHandbookList;
            if(self.show || self.show === undefined)  self.ele.show();
		    self.removeLoadTip();
			self.totalCount = result.totalCount;
			self.pageCount = Math.ceil(self.totalCount/self.pageSize);
			self.render(result);
			if(result.totalCount == 0){
				self.ele.html("");
				self.ele.after( '<div class="listEmpty">暂无查询数据</div>');
				if( typeof self.emptyCallBack == 'function') self.emptyCallBack(result)
			}else{
				if( typeof self.callback == 'function') self.callback(result.datas,result)
			}
		}
		this.scrollService.error = function(msg,data){
			self.pageIndex--;
            comm.alert(msg);
			this.isLoadingComplete = true;
		}
		this.scrollService.send();
	},

	render : function(result){
		var resultArr = result.datas;
		if($.isArray(resultArr) && resultArr.length > 0){
			if(this.dataFilter) resultArr = this.dataFilter(resultArr,result);
			this.ele.append( template.getHtml(this.temStr,resultArr));
			this.isLoadingComplete = true;
			if(this.pageIndex >= this.pageCount){
				if(this.pageCount > 1){
					this.ele.after( '<div class="listFull">没有更多内容</div>' );
				}
			}else{
				this.ele.after( '<div class="listMore">上拉加载更多</div>' );
			}
		}

	},

	removeLoadTip : function(){
		$('.listFull').remove();
		$('.listMore').remove();
		$('.listEmpty').remove();
	}
};

module.exports = iScroll;