/**
 * @require style.css
 */
var $ = require("zepto");

// 构造函数
function circleProgress( options ){
    for( key in options ){
        this[key] = options[key];
    }
    this.init();
}
// 默认显示百分比
circleProgress.prototype.isShowProgress = true; 

// 引入模板
circleProgress.prototype.tem = $(__inline("circleProgress.tmpl"));

// 初始化
circleProgress.prototype.init = function(){
    this.ele.html(this.tem);
    // 不限额，不显示进度百分比
    if( !this.isShowProgress ){
        this.ele.find('.point_wraper').hide();
    }
    this.madePointer(this.pointer);
}

// 显示
circleProgress.prototype.madePointer = function(pointerNum){
    /*实际角度为-225+百分比*360*/
    var leftDeg = 0;
    var rightDeg = 0;
    if( pointerNum >= 50 ){
        rightDeg = 180;
        leftDeg = (pointerNum - 50)/100 * 360;
    }else{
        rightDeg = pointerNum/100 * 360;
        leftDeg = 0;    
    }
    
    if( pointerNum >= 100 && this.isShowProgress ){
        this.ele.addClass('gray');
    }

    this.ele.find('.circleProgress_right .circleProgress_over').css('transform', "rotate(" + (-225+rightDeg) + "deg)");
    this.ele.find('.circleProgress_left .circleProgress_over').css('transform', "rotate(" + (-225+leftDeg) + "deg)");
    this.ele.find('.point_wraper').css('transform', "rotate(" + (pointerNum/100*360) + "deg)");
    this.ele.find('.point_wraper .point_num').html(parseInt(pointerNum) + '%').css('transform', "rotate(" + -1*(pointerNum/100*360) + "deg)");

    changeRotate( this.ele.find('.circleProgress_right .circleProgress_over'),-225+rightDeg );
    changeRotate( this.ele.find('.circleProgress_left .circleProgress_over'),-225+leftDeg );
    changeRotate( this.ele.find('.point_wraper'),(pointerNum/100*360) );
    changeRotate( this.ele.find('.point_wraper .point_num'),-1*(pointerNum/100*360) );

    function changeRotate(ele,deg){
        ele.get(0).style.webkitTransform = 'rotate(' + deg + 'deg)';
    }

    
}



module.exports = circleProgress;
