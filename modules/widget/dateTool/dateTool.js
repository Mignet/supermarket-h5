/**
 * @require style.css
 */
var $ = require("zepto");
var tipBox = require('modules/widget/tipBox/tipBox');
var dateTip = new tipBox();

function dateTool(wrap){
	this.wrap = wrap;
	this.init();
}

dateTool.prototype.init = function(year, month){
	this.year = year || new Date().getFullYear();
	this.month = month || (new Date().getMonth()+1);
	this.wrap.html( this.tem() );
	this.yearEle = this.wrap.find('.year');
	this.monthEle = this.wrap.find('.month');
	this.preMon = this.wrap.find('.preMon');
	this.nextMon = this.wrap.find('.nextMon');
	this.events();
}

dateTool.prototype.tem = function(){
	var tem = '<div class="dateTool">'
			+		'<div class="preMon"></div>'
			+		'<div class="dateCon">'
			+			'<p class="year">'+this.year+'</p>'
			+			'<h1 class="month">'+this.month+'</h1>'
			+		'</div>'
			+		'<div class="nextMon"></div>'
			+	'</div>';
	return tem;
}

dateTool.prototype.events = function(){
	var _this = this;

	// 上个月
	this.preMon.on('click',function(){
		_this.goPreMon();

	});

	// 下个月
	this.nextMon.on('click',function(){
		_this.goNextMon();

	})

}
// 上个月
dateTool.prototype.goPreMon = function(){
	if( this.yearEle.text() <= parseInt(this.minYear) && this.monthEle.text() <= parseInt(this.minMonth,10) ){
		dateTip.show( '没有更早的数据了', {delay: 2000}); 
		return false;
	}

	if( this.monthEle.text() > 1){
		this.monthEle.text( parseInt(this.monthEle.text())-1 );
	}else{
		this.yearEle.text( parseInt(this.yearEle.text())-1 );
		this.monthEle.text( 12 );
	}

	if( typeof this.callback == 'function' ){
		this.callback( this.monthEle.text(), this.yearEle.text());
	}
}
// 下个月
dateTool.prototype.goNextMon = function(){

	if( this.yearEle.text() >= this.maxYear && this.monthEle.text() >= this.maxMonth ){
		dateTip.show( '没有早于当前时间的数据', {delay: 2000});
		return false;
	}

	if( this.monthEle.text() < 12 ){
		this.monthEle.text( parseInt(this.monthEle.text())+1 );
	}else{
		this.yearEle.text( parseInt(this.yearEle.text())+1 );
		this.monthEle.text( 1 );
	}

	if( typeof this.callback == 'function' ){
		this.callback( this.monthEle.text(), this.yearEle.text());
	}
}
dateTool.prototype.maxYear = new Date().getFullYear();
dateTool.prototype.maxMonth = (new Date().getMonth())+1;
dateTool.prototype.minYear = 1970;
dateTool.prototype.minMonth = 1;

module.exports = dateTool;