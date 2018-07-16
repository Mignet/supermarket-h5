/**
 * @require style.css
 */
var $ = require("zepto");
// var swipe = require("modules/common/swipe");

// options
	// tabTitle : 
	// content : 
	// defaultTab : 
	// currentClass : 
	// callback : 
	// isSwipe : 

function swipeTab(options){
	for( var key in options ){
		this[key] = options[key];
	}
	this.init();
}

swipeTab.prototype = {

	// 修正constructor
	constructor : swipeTab,

	// 当前class
	currentClass : 'current',

	// 当前class
	isSwipe : 'true',

	init : function(){
		this.defaultTab = this.defaultTab || 0;
		this.listSize = this.tabContent.children().size();
		this.tabContent.children().width( this.tabContent.width() / this.listSize );
		this.choose();
		this.events();
		this.swipe();

	},
	events : function(){
		var _this = this;
		this.tabTitle.children().on('click',function(){
			_this.choose( $(this).index() );
		});
	},

	choose : function( num ){
		var num = num || this.defaultTab;
		currentClass = this.currentClass;
		this.tabTitle.children().eq(num).addClass( currentClass ).siblings().removeClass( currentClass );
		// this.tabContent.children().eq(num).addClass( currentClass ).show().siblings().removeClass( currentClass ).hide();
	},

	swipe : function(){
		if( this.isSwipe ){

		}
	}


}

module.exports = swipeTab;