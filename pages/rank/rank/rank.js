/**
 * @require style.less
 * @require modules/library/swiper/swiper.css
 */
var $ = require("zepto");
var native  = require('modules/common/native');
var api     = require('modules/api/api');
var Render  = require('modules/common/render');
var swiper  = require('modules/library/swiper/swiper');

var rank   =  {
	init:function(){
		var self = this;
		this.rankIndex = 0;
		this.timer = null;
		if(native.isApp){
				native.getAppToken(function(data){
					self.token = data || '';
					if(self.token){
						self.render();
					}else{
						self.initPage()
					}
				});
		}else{
			self.token  = sessionStorage.getItem("__token__");
			if(self.token){
				self.render();
			}else{
				self.initPage()
			}
		}
	},
	//未登录时默认见习,初始化页面
	initPage:function(){
		var oLines = $('#nowRank').children('i');
		var oLogo = $("#levelLogo").children('img').eq(0)
		for(var i = 0,len =oLines.length ;i<len;i++){
			oLines.eq(i).addClass('rank_un_up')
		}
		oLogo.attr('src',$("#levelLogo").children('img').eq(0).data('src')).show();
		$("#progressWrapper").add('#presentMonth').remove()
		$('#wrapper').css('display', 'block');
		this.swiperEvent(0)
	},
	render:function(){
		var self = this;
		new Render({
			ele: $('#headerContainer'),
			api: api.rankInfo,
			data: {
				token:self.token
			},
			isShowLoading: false,
			filter: self._filter,
			callback: function (data) {
				switch(data.jobGrade){
					case "TA":  self.rankIndex = 0; break;
					case "SM1": self.rankIndex = 1; break;
					case "SM2": self.rankIndex = 2; break;
					case "SM3": self.rankIndex = 3;
				}
				var rankIndex = self.rankIndex;
				var oLogo = $("#levelLogo").children('img').eq(rankIndex)
				var oRank = $('#nowRank').children('p').eq(rankIndex);
				var oArrow = $("#rankArrow").children('span');
				var oLines = $('#nowRank').children('i');
				oLogo.attr('src',oLogo.data('src')).show();
				oRank.addClass('active');
				oArrow.css('left',(.3 + rankIndex * .98)+"rem")
				for(var i = 0,len =oLines.length ;i<len;i++){
					self.rankShow(oLines,i,rankIndex);
				}
				if(data.lowerLevelCfpMaxNew == 0){
					$("#subPlanner").remove()
				}
				$('#wrapper').css('display', 'block');
				self.progressBarEvent(data)
				self.swiperEvent(self.rankIndex)
			}
		});
	},
	_filter:function(data){
		data.subPlannerText = data.lowerLevelCfpMaxNew + '名' + data.lowerLevelCfp 
		return data;
	},
	progressBarEvent:function(data){
		var self = this;
		var step = 10;
		var actualYearGrade = parseFloat(data.yearpurAmountActualNew);
		// 已经完成的年化投资额
		var realYearGrade = parseFloat(data.yearpurAmountActualNew)>= parseFloat(data.yearpurAmountMaxNew) ? parseFloat(data.yearpurAmountMaxNew) : parseFloat(data.yearpurAmountActualNew);
		// 直推理财师实际个数
		var realPlanner = parseInt(data.lowerLevelCfpActualNew);
		// 初始化年化收益
		var nowYearGrade = 0;
		// 年化每次增长
		var yearGradeGap = realYearGrade / step;
		// 最大的年化投资额
		var maxGrade = parseInt(data.yearpurAmountMaxNew);
		// 最大理财师个数
		var maxPlanner = parseInt(data.lowerLevelCfpMaxNew);
		// 真实年化完成进度
		var realGradeProgress = parseInt(realYearGrade / maxGrade * 100);
		// 真实理财师个数百分比
		var realPlannerProgress = parseInt(realPlanner / maxPlanner * 100);
		realPlannerProgress = realPlannerProgress >= 100 ? 100 : realPlannerProgress;
		// 增长率
		var gradeProgressGap = realGradeProgress / step;
		// 现在的进度
		var nowGradeProgress = 0;
		var realGradeNumDom = $("#realGradeNum");
		var gradeProgressDom = $("#gradeProgress");
		var gradeCircleDom = $("#gradeCircle");
		$("#plannerProgress").css('width',realPlannerProgress + "%")
		$("#plannerCircle").css('left',realPlannerProgress + "%")
		if(realGradeProgress <= 10){
			realGradeNumDom.text(actualYearGrade.toFixed(2))
			gradeProgressDom.css('width',realGradeProgress + "%")
			gradeCircleDom.css('left',realGradeProgress + "%")
		}else{
			setTimeout(function(){
				self.timer = setInterval(function(){
					step --;
					nowYearGrade = nowYearGrade + yearGradeGap;
					nowGradeProgress = nowGradeProgress + gradeProgressGap;
					realGradeNumDom.text(nowYearGrade.toFixed(2));
					gradeProgressDom.css('width',nowGradeProgress + "%")
					gradeCircleDom.css('left',nowGradeProgress + "%")
					if(step <=0){
						realGradeNumDom.text(actualYearGrade.toFixed(2))
						gradeProgressDom.css('width',realGradeProgress + "%")
						gradeCircleDom.css('left',realGradeProgress + "%")
						clearInterval(self.timer)
					}
				},100)
			},300)
		}
	},
	rankShow:function(oLines,i,rankIndex){
		if(i < rankIndex){
			oLines.eq(i).addClass('rank_did_up')
		}else if(i == rankIndex){
			oLines.eq(i).addClass('rank_will_up')
		}else if (i > rankIndex){
			oLines.eq(i).addClass('rank_un_up')
		}
	},
	swiperEvent:function(index){
		this.mySwiper =  new swiper ('.swiper-container', {
			observer:true,
			observeParents:true,
			initialSlide:index || 0
		});
		this.paginationEvent();
	},
	paginationEvent:function(){
		var self = this;
		$("#nowRank").on('click','p',function(item,index){
			var oIndex = $(this).index()/2;
			var oArrow = $("#rankArrow").children('span');
			self.mySwiper.slideTo(oIndex)
			oArrow.css('left',(.3 + oIndex * .98)+"rem")
		})
	}
};
rank.init();
