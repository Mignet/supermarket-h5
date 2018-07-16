/**
* @require style.less
 *
*/
var $ = require('zepto')
var api = require('modules/api/api');
var comm = require("modules/common/common");
var Render = require('modules/common/render');
var template = require('modules/common/template');
var service = require('modules/common/service');
var native = require('modules/common/native');
var globalId = null;
var templateStr = $("#template").html()
var listStr = $(".insuranceListHook").html()

var evaluate = {
	init:function(){
		var self = this;
		this.showIndex = 0;
		this.angle = 0;
		this.isRender = false;
		// this.credit = 0;
		// 性别 男 0 女 1
		this.sex = 0;
		if (native.isApp) {
		    native.getAppToken(function (data) {
		        self.token = data || "";
		        self.getUserInfo()
		        self.bindEvent()
		    });
		} else {
			self.getUserInfo()
			this.bindEvent()
		}
	},
	bindEvent:function(){
		var self = this
		// tab切换
		$('#tab').on('click','li',function(){
			if($(this).data('index') == self.showIndex) return
			self.showIndex = $(this).data('index');
			$("#tab").children('li').removeClass('active')
			$(this).addClass('active')
			$("#tabContent").children('li').hide()
			for(var i=0;i<$("#tabContent").children('li').length;i++){
				if($("#tabContent").children('li').eq(i).data('value') === $(this).data('index')){
					$("#tabContent").children('li').eq(i).show()
				}
			}
			var queryType = 1;
			switch($(this).data('index')){
				case 0: queryType = (self.sex == 0 ? 1 : 2); break;
				case 1: queryType = (self.sex == 0 ? 2 : 1); break;
				case 2: queryType = 3; break;
				case 3: queryType = 3; break;
				case 4: queryType = 3; break;
				case 5: queryType = 3; break;
				case 6: queryType = 4; break;
				case 7: queryType = 4; break;
			}
			self.renderTestReportRecommend(queryType)
		})
	},
	renderTestReportResult:function(){
		var self = this;
		new Render({
		    ele: $('#header'),
		    api: api.testReportResult,
		    isShowLoading: true,
		    data: {
		        token : self.token
		    },
		    filter: self._filter,
		    callback: function (result) {
		    	self.score = result.totalScore
		    	var familyMember = result.familyMember;
		    	var familyMemberArr = familyMember.split(',')
		    	familyMemberArr.forEach(function(item,index){
		    		$('#tab').children('li').forEach(function(itemLi,itemIndex){
		    			if(item == $(itemLi).data('index')){
		    				$(itemLi).show();
		    			}
		    		})
		    	})
		    	self.sex = result.sex;
		    	if(result.sex == 0){ // 男
		    		$("#tabContent").children('li').eq(0).attr('data-value','0').next().attr('data-value','1')
		    		self.renderTestReportRecommend(1)
		    	}else if(result.sex == 1){ // 女
		    		$("#tabContent").children('li').eq(0).attr('data-value','1').next().attr('data-value','0')
		    		self.renderTestReportRecommend(2)
		    	}

		    	for(var i=0;i<$("#tabContent").children('li').length;i++){
		    		if($("#tabContent").children('li').eq(i).data('value') == 0){
		    			$("#tabContent").children('li').eq(i).show()
		    		}
		    	}

		    	$("#evaluation").on('click',function(){
		    		if (_hmt) {
		    		    _hmt.push(['_trackEvent', 'link', 'click', 'T_4_4_2_3'])
		    		}
		    		var data = {
		    		    android:{
		    		        name:'InsuranceTestActivity',
		    		        paramsKey:'',
		    		        params:''
		    		    },
		    		    ios:{
		    		        name:'CapacityAssessmentViewController',
		    		        method:'initWithNibName:bundle:',
		    		        params:'CapacityAssessmentViewController,nil'
		    		    }
		    		}
		    		native.skipAppPage(data)
		    	})

		    	$("#share").on('click',function(){
		    		if (_hmt) {
		    		    _hmt.push(['_trackEvent', 'link', 'click', 'T_4_4_2_4'])
		    		}
		    		self.shareToWechat()
		    	})

		    	$("body").css('visibility','visible')
				self.circleAnimation(result.totalScore)
		    }
		});
	},
	_filter:function(result){
		result.createDate = result.createDate.split(' ')[0]
		return result
	},
	//获取用户信息
	getUserInfo:function(){
	    var self = this;
	    var userInfoService = new service();
	    userInfoService.api = api.getUserInfo;
	    userInfoService.isNeedToken = true;
	    userInfoService.data = {
	        token: self.token
	    }
	    userInfoService.success = function (result) {
	        self.mobile = result.mobile;
	        self.name = result.userName;
	        self.renderTestReportResult()
	    };
	    userInfoService.send();
	},
	circleAnimation:function(val){
		var self = this
		// 总分数
    	var totalScore = 400;
        // 实际分数
		var val = val;
		// 总弧度
		var totalArc = 1.2 * Math.PI;
		// 实际弧度
		var percentArc = val / 400 * totalArc;
		var canvas = document.getElementById("canvas")
		var width = Math.floor(canvas.clientWidth) * 2
		var height = Math.floor(canvas.clientHeight) * 2
		canvas.setAttribute('width',width)
		canvas.setAttribute('height',height)
		oCanvas = canvas.getContext('2d')
		var radius = width/2 - 5;
		var endAngle = .1 * Math.PI;
		var speed = 0.03;
		var deg0 = Math.PI / 10
		var deg1 = Math.PI * 3 / 10;
		this.drawFrame(oCanvas,width,height,percentArc,radius,endAngle,val,totalScore,deg0,deg1)
    	$(window).on('scroll',function(){
    		if($(window).scrollTop() <= $("#header").height()){
				$("#canvas").hide().show(0)
    		}
    	})
	},
	drawFrame:function(oCanvas,width,height,percentArc,radius,endAngle,val,totalScore,deg0,deg1){
		var self = this;
		if(self.isRender) return
		self.isRender = true;
		var textSpeed = Math.round(0.03 * 120 / deg1);
        var smallRadius = radius * .9;
        var lineWidth = 3

		oCanvas.save();
		oCanvas.beginPath()
		oCanvas.clearRect(0, 0, width, height);
		oCanvas.translate(width / 2, width / 2);
		oCanvas.rotate(9 * deg0);
		oCanvas.closePath()

		oCanvas.save()
		oCanvas.beginPath();
		oCanvas.strokeStyle = 'rgba(255, 255, 255, .4)';
		oCanvas.lineWidth = lineWidth;
		oCanvas.arc(0, 0, radius, 0, 12 * deg0, false);
		oCanvas.stroke();
		oCanvas.restore();

		// 实线圆
		oCanvas.save()
		oCanvas.beginPath()
		oCanvas.strokeStyle = 'rgba(255, 255, 255, 1)';
		oCanvas.arc(0,0,radius,0,self.angle,false)
		oCanvas.lineWidth = lineWidth;
		oCanvas.stroke()
		oCanvas.closePath()
		oCanvas.restore();

		// 大圆实心圆
		oCanvas.save()
		oCanvas.beginPath()
		oCanvas.rotate(self.angle)
		oCanvas.arc(width/2-5,0,5,0,Math.PI * 2,false);
		oCanvas.fillStyle="rgba(255,255,255,1)"
		oCanvas.shadowOffsetX = 0; // 阴影Y轴偏移
		oCanvas.shadowOffsetY = 0; // 阴影X轴偏移
		oCanvas.shadowBlur = 15; // 模糊尺寸
		oCanvas.shadowColor = 'rgba(255, 255, 255, 1)'; // 颜色
		oCanvas.fill()
		oCanvas.closePath()
		oCanvas.restore()

		oCanvas.save()
		var startArc = 0;
		var startArc2 = 0;

		for(var i=0;i<40;i++){
			oCanvas.beginPath()
			oCanvas.lineWidth = 2;
			oCanvas.arc(0,0,smallRadius,startArc2,startArc2 + Math.PI/60,false)
			oCanvas.strokeStyle = 'rgba(255,255,255,1)'
			oCanvas.stroke()
			oCanvas.closePath()
			startArc2 += Math.PI/30
			if(startArc2 >= self.angle){
				break;
			}
		}

		for(var j=0;j<40;j++){
			oCanvas.beginPath()
			oCanvas.lineWidth = 2;
			oCanvas.arc(0,0,smallRadius,startArc,startArc + Math.PI/60,false)
			oCanvas.strokeStyle = 'rgba(255,255,255,.4)'
			oCanvas.stroke()
			oCanvas.closePath()
			startArc += Math.PI/30
			if(startArc >= (6 / 5 *Math.PI)){
				break;
			}
		}
		oCanvas.restore()

		// 小实心圆
		oCanvas.save()
		oCanvas.beginPath()
		oCanvas.rotate(self.angle)
		oCanvas.arc(width/2*.9-5,0,5,0,Math.PI * 2,false);
		oCanvas.fillStyle="rgba(255,255,255,1)"
		oCanvas.fill()
		oCanvas.closePath()
		oCanvas.restore()

		oCanvas.restore()

		$("#myScore").text(self.credit)


		globalId = window.requestAnimationFrame(function(){
			self.isRender = false;
			self.drawFrame(oCanvas,width,height,percentArc,radius,endAngle,val,totalScore,deg0,deg1)
		});

		var aim = val * deg1 / 100;
		if (self.angle < aim - .03) {
		  self.angle += 0.03;
		}else {
			self.isRender = false;
			window.cancelAnimationFrame(globalId);
		}
	},
	renderTestReportRecommend:function(queryType){
		var self = this;
		var renderService = new service();
		renderService.api = api.testReportRecommend;
		renderService.isNeedToken = true;
		renderService.isShowLoading = true;
		renderService.data = {
			queryType:queryType,
			token:self.token
		}
		renderService.success = function (result) {
			var data = result.datas;
			for(var j=0;j<data.length;j++){
				for(var k=0;k<data[j].cimInsuranceProductExtendsList.length;k++){
					var imgUrl = publicConfig.imageUrl + data[j].cimInsuranceProductExtendsList[k].productBakimg + '?f=png';
					data[j].cimInsuranceProductExtendsList[k].insurancePic = '<img src="'+imgUrl+'" />'
				}
			}
			$("#insuranceList").html(template.getHtml(templateStr,data))
			for(var i=0;i<data.length;i++){
				$("#insuranceList").find('.insuranceListHook').eq(i).html(template.getHtml(listStr,data[i].cimInsuranceProductExtendsList))
			}

			$("#insuranceList").off('click');
			$('#insuranceList').on('click','li',function(){
				var self = this;
				if(comm.isIOS()){
					native.action('refreshPage')
				}
				setTimeout(function(){
					native.action('jumpThirdInsurancePage',{
						caseCode:$(self).find('.insurancePicHook').attr('caseCode'),
						tag:1
					})
				},200)
			})
		}
		renderService.send();
	},
	shareToWechat:function () {
	    var SHARE_URL = "";
	    if(this.name){
	        SHARE_URL = publicConfig.leicaiDomain + 'pages/guide/evaluateShare.html?score='+this.score+'&mobile='+this.mobile+'&name=' + encodeURIComponent(this.name)
	    }else{
	        SHARE_URL = publicConfig.leicaiDomain + 'pages/guide/evaluateShare.html?score='+this.score+'&mobile=' + this.mobile
	    }
	    var appShareData = {
	        shareTitle: '我的家庭保障指数'+this.score+'分,快来比比看', // 分享标题
	        shareDesc: '小小家庭,大大保障。快来测测你的家庭保障指数吧！',
	        shareLink: SHARE_URL,
	        shareImgurl: '59295f178ef7992cfe7700f3a025fa64' // 分享图标
	    }
	    native.action('getAppShareFunction',appShareData);
	},
}

evaluate.init()