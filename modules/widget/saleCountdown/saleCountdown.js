/**
 * @require style.css
 */
var $ = require("zepto");

// options为：
//     ele : 倒计时容器
//     saleTimeStr : 开售时间
//     nowTimeStr : 当前系统时间
//     callback : 时间结束后回调函数
//     isProduce: 产品详情倒计时
//     isProduceList: 产品列表倒计时

// 构造函数
function saleCountdown( options ){
	for( key in options ){
		this[key] = options[key];
	}
	this.init();
}

// 是否自动展示倒计时效果
saleCountdown.prototype.isAutoCountdown = true;

//产品详情倒计时
saleCountdown.prototype.isProduce = false;

//产品列表倒计时
saleCountdown.prototype.isProduceList = false;

// 初始化
saleCountdown.prototype.init = function(){
    // 默认时间为当前系统时间
    if( !this.nowTimeStr ){
        this.nowTime = Date.now();
    }else{
        this.nowTime = new Date( this.nowTimeStr.replace( /-/g,'/' ) ).getTime();
    }
    this.saleTime = new Date( this.saleTimeStr.replace( /-/g,'/' ) ).getTime();

    this.ele.html( this.getDateStr( this.saleTime,this.nowTime ) );
    if( this.isAutoCountdown ){
        this.ele.css('backgroundColor',"#999")
        this.countdown();
    }
}

// 倒计时效果
saleCountdown.prototype.countdown = function(){
    var _this = this;
    var saleTime = this.saleTime;
    var nowTime = this.nowTime;
    this.countdownTimer = setInterval( function(){
        nowTime = nowTime + 1000;
        if( saleTime >  nowTime ){
            _this.ele.html( _this.getDateStr( saleTime,nowTime ) );
        }else{
            clearInterval( _this.countdownTimer );
            // 到了指定时间执行回调
            if( typeof _this.callback == 'function' ){
                _this.callback();
            }
        }
    },1000);
}

// 生成时间字符串
saleCountdown.prototype.getDateStr = function(saleTime,nowTime){
    var self = this;
    var disSecond = (saleTime - nowTime) /1000;
    var dayNum = parseInt( disSecond/3600/24 );
    var hourNum = parseInt( disSecond/3600 - dayNum * 24 );
    var minuteNum = parseInt( disSecond/60 - dayNum * 24 * 60 - hourNum * 60 );
    var secondNum = parseInt( disSecond - dayNum * 24 * 60 * 60 - hourNum * 60 * 60 - minuteNum * 60 );

    if( this.isProduce || this.isProduceList ) {
        hourNum = parseInt( disSecond/3600 );
    }

    // 获取两位整数
    function getTwoNum(num){
        if( num < 10 ){
            num = '0' + num;
        }
        if( self.isProduce || self.isProduceList ) {
            return num;
        } else {
            return '<strong>' + num + '</strong>';
        }

    }
    if( this.isProduce ) {
        return '开售倒计时: ' + getTwoNum(hourNum) + ':' + getTwoNum(minuteNum) + ':' + getTwoNum(secondNum);
    } else if ( this.isProduceList ){
        return getTwoNum(hourNum) + ':' + getTwoNum(minuteNum) + ':' + getTwoNum(secondNum);
    } else {
        return '<span class="saleCountdown">' + getTwoNum(dayNum) + '天' + getTwoNum(hourNum) + '时' + getTwoNum(minuteNum) + '分' + getTwoNum(secondNum) + '秒' + "</span>";
    }

}

module.exports = saleCountdown;
