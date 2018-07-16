/**
 * @require style.css
 */
var $ = require("zepto");

var translate = require("translate");
var trans = new translate();

function scroll(options){
    for( var key in options ){
      this[key] = options[key];
    }
    this.init();
}

scroll.prototype = {

  constructor : scroll,

  // 惯性基数
  inertiaNum : 300,

  friction : 0.5,

  exceptionReg: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/i,

  init : function(){
    var _this = this;
    var ele = this.ele;
    var touchInfo = {};
    this.barProportion = ele.parent().height() / ele.height() ;
    ele.parent().append('<div class="scrollBar"><p></p></div>');
    this.scrollBar = ele.parent().find('.scrollBar p');
    this.scrollBar.height(this.barProportion * ele.parent().height() );


    this.ele.on('touchstart',function(ev){

      clearInterval( _this.bufferTimer );
      _this.scrollBar.css('opacity',1);
      // 获取初始touch位置
      var touch = getFirstTouch(ev);
      var x = touch.x;
      var y = touch.y;

      // 获取初始元素位移
      var transArr = trans.getTranslate(_this.ele);

      // 记录初始数据
      touchInfo.startTime = Date.now();
      touchInfo.startX = x;
      touchInfo.startY = y;

      // touch点元元素相对位置
      touchInfo.disX = x - this.offsetLeft - transArr[0];
      touchInfo.disY = y - this.offsetTop - transArr[1];

      // 重置初始位移
      touchInfo.moveX = 0;
      touchInfo.moveY = 0;

      this.touchInfo = touchInfo;

    });

    this.ele.on('touchmove',function(ev){
      _this.exceptionPrevent( ev );
      var touch = getFirstTouch(ev);
      // 当前位移
      var transArr = trans.getTranslate(_this.ele);
      var x = touch.x;
      var y = touch.y;
      // 需处理位移
      var needMove = y - touchInfo.disY;

      _this.scrollTo(needMove);

      if( Date.now() - touchInfo.startTime > 300 ){
        touchInfo.startY = y;
        touchInfo.startTime = Date.now();
      }

      // 每次移动的距离
      touchInfo.moveY = y - touchInfo.startY;
    
    });


    this.ele.on('touchend',function(ev){
      // 结束时的速度
      var endSpeed = touchInfo.moveY/(Date.now() - touchInfo.startTime);

      // 当前位移
      var transArr = trans.getTranslate(_this.ele);
      var transY = transArr[1];

      _this.scrollBar.css('opacity',0);

      _this.keepMove( parseInt( transY + endSpeed * _this.inertiaNum ) );


    });



    function getFirstTouch(ev){
      var firstTouch = ev.touches[0];
      return{
        x : firstTouch.pageX,
        y : firstTouch.pageY
      }
    }
  },

  // 滑动
  scrollTo : function(needMove){

    var touchInfo = this.touchInfo;
    var overNum = this.ele.height() - this.ele.parent().height() + needMove;
    var realMove = needMove;

    // 上越界处理，阻力
    if( needMove > 0 ){
      realMove = needMove * this.friction;
    }

    // 下越界处理，阻力
    if( overNum < 0 ){
      realMove = needMove - overNum * this.friction;
    }


    trans.setTranslate({
      ele : this.ele,
      y : parseInt(realMove)
    });
    // 移动滚动条
    trans.setTranslate({
      ele : this.scrollBar,
      y : -parseInt(realMove * this.barProportion)
    });
  },

  // 判断是否为表单元素，是否阻止默认事件
  exceptionPrevent : function(ev){
    ev.preventDefault();
    // var tag = ev.target.tagName;
    //   if( !this.exceptionReg.test( tag ) ){
    //     $('input,select,textarea,button').blur();
        
    //   }
  },

  // 惯性运动
  keepMove : function(targetNum){

      var maxMoveDis = this.ele.height() - this.ele.parent().height();

      // 上越界处理
      if( targetNum > 0 ){
        targetNum = 0;
      }else if( maxMoveDis + targetNum < 0 ){
        // 下越界
        targetNum = - maxMoveDis;
      }

      this.bufferMove( targetNum );

  },

  //缓冲运动
  bufferMove : function (targetNum){
    var _this = this;
    clearInterval( this.bufferTimer );
    this.bufferTimer = setInterval( function(){

      // 当前位移
      var transArr = trans.getTranslate(_this.ele);
      var current = transArr[1];
      var speed = ( targetNum-current ) / 8;
      speed = speed > 0 ? Math.ceil( speed ) : Math.floor( speed );
      if( current == Math.round(targetNum) ){
        _this.scrollTo( targetNum );
        clearInterval( _this.bufferTimer );
        if( _this.callback ){
          // 返回实际位移
          _this.callback(targetNum);
        }
      }else{
        _this.scrollTo( current +  speed );
      }
    },30);
  },


}

module.exports = scroll;