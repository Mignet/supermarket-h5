/**
 * @require style.css
 */
var $ = require("zepto");

function translate(){}

translate.prototype = {

 constructor : translate,
 useTransform : true,

setTranslate: function (options) {
  var prefix = this.transformPrefix();
  var ele = options.ele;
  var startAttr = this.getTranslate(ele);
  var x = isNaN( options.x ) ? startAttr[0] : options.x;
  var y = isNaN( options.y ) ? startAttr[1] : options.y;
  if ( this.useTransform ) {
    ele.get(0).style[prefix] = 'translate(' + x + 'px,' + y + 'px)';
  }
},

getTranslate : function(ele){
  var prefix = this.transformPrefix();
  var arr = [0,0];
  var attr = ele.get(0).style[prefix];
  if( attr ){
    var reg = /translate\([^\)]+\)/;
    var matchArr = attr.match( reg );
    if( matchArr ){
      var matchReg = /\([^\)]+\)/;
      matchArr = matchArr[0].match(matchReg);
      if( matchArr ){
        matchArr = matchArr[0].replace(/[\(\)]/g,'');
        matchArr = matchArr.split(',');
        if( matchArr.length > 1 ){
          arr[0] = parseInt( matchArr[0] );
          arr[1] = parseInt( matchArr[1] );
        }else if( matchArr.length == 1 ){
          arr[0] = parseInt( matchArr[0] );
          arr[1] = 0 ;
        }
      }       
    }
  }
  return arr; 
},

transformPrefix : function(){
  var eleStyle = document.createElement('div').style;
    var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
        transform,
        i = 0,
        l = vendors.length;

    for ( ; i < l; i++ ) {
        transform = vendors[i] + 'ransform';
        if ( transform in eleStyle ){
          return transform;
        }
    }
}



}

module.exports = translate;