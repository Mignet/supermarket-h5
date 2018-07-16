// 设置页面rem大小
// 以iPhone 6s的参考宽度414为标准，html的fontsize此时为100px
;(function (win, doc) {
    var max = 414;

    var setFontSize = function () {
        var theHTML = doc.querySelector("html");
        var docWidth = doc.documentElement.clientWidth > max ? max : doc.documentElement.clientWidth;
        theHTML.style.fontSize = 100 * docWidth / max  + 'px';
    };

    win.addEventListener('resize',function(){
        setFontSize();
    });

    setFontSize();
})(window, document)


// 设置body的最小高度为可视区的高度
;(function (win, doc) {
    win.addEventListener('load',function(){
        var docHeight = doc.documentElement.clientHeight;
        var bodyHeight = doc.body.offsetHeight;
        if( bodyHeight < docHeight ){
            doc.body.style.height = docHeight + 'px';
        }
    });
})(window, document)

;(function(){
    Date.prototype.format = function (fmt) { //
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
})();

var _hmt = _hmt || [];

;(function(win,doc) {
    //用户来源统计
    if(!sessionStorage.getItem('__statistics__')){
        sessionStorage.setItem('__statistics__',true);
        sessionStorage.setItem('__href__',win.location.href);
        sessionStorage.setItem('__referer__',doc.referrer);
    }

    if(publicConfig.mode == "produce"){
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?ec35644bc7a06204f4c775312a7a1154";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    }

    if(publicConfig.mode == "pre"){
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?8ae5a7c8749582f561f0a4710bd69df6";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    }
})(window, document);






