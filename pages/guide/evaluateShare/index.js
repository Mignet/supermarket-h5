/*
* @require ./style.less
*/

var $ = require('zepto')
var comm = require('modules/common/common');
var native = require('modules/common/native');
var globalId = null;

var evaluateShare = {
	init:function(){
		var query = comm.getQueryString()
		this.score = query.score
		this.mobile = query.mobile
		this.name = query.name || "";
		this.angle = 0;
		this.credit = 0;
		// 打败人数百分比
		var beatPercent = 50 + (this.score / 10) + "%"
		$("#beatPercent").text(beatPercent)
		$("#myScore").text(this.score)
		this.circleAnimation()
		this.bindEvent()
	},
	bindEvent:function(){
		var self = this;
		$("#goRegister").on('click',function(){
			var REGISTER_URL = ""
			if(self.name){
			    REGISTER_URL = publicConfig.leicaiDomain + 'pages/user/inviteRegister.html?recommendCode=' + self.mobile + '&name=' + encodeURIComponent(self.name)
			}else{
			    REGISTER_URL = publicConfig.leicaiDomain + 'pages/user/inviteRegister.html?recommendCode=' + self.mobile
			}
			location.href = REGISTER_URL
		})
	},
	circleAnimation:function(){
		var self = this
		// 总分数
        var totalScore = 400;
        // 实际分数
		var val = this.score;
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
		var deg0 = Math.PI / 10
		var deg1 = Math.PI * 3 / 10;
		this.drawFrame(oCanvas,width,height,percentArc,radius,endAngle,val,totalScore,deg0,deg1)
	},
	drawFrame:function(oCanvas,width,height,percentArc,radius,endAngle,val,totalScore,deg0,deg1){
		var self = this;
		var textSpeed = Math.round(0.03 * 120 / deg1);
		var credit = 0
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
		oCanvas.shadowColor = 'rgba(255, 255, 255, .4)'; // 颜色
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
			self.drawFrame(oCanvas,width,height,percentArc,radius,endAngle,val,totalScore,deg0,deg1)
		});

		var aim = val * deg1 / 100;
		if (self.angle < aim - .03) {
		  self.angle += 0.03;
		  if (self.credit < val - textSpeed) {
		    self.credit += textSpeed;
		  } else if (self.credit >= val - textSpeed && self.credit < val) {
		    self.credit += 1;
		  }
		}else {
			window.cancelAnimationFrame(globalId);
		}
	},
}
evaluateShare.init()