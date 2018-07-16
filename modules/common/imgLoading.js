/*
    图片未加载的时候显示loading
*/
var $ = require('zepto');
var loading = require("modules/widget/loading/loading")

function ImgLoading(options){
    for( key in options ){
        this[key] = options[key];
    }
    this.isLoad = true;
    this.init();
}
ImgLoading.prototype={
    
    constructor:ImgLoading,

    init:function(){
        var self = this;
        loading.show();
        // 判断图片加载状况，加载完成后回调
        this.isImgLoad(function(){
            // 加载完成
            loading.hide();
            $(self.ele).show();
        });
        this.timeout_timer = setTimeout(function(){
            this.timeout();
        }.bind(this),3000)
    },
    isImgLoad:function(callback){
        $(this.ele).find('img').each(function(){
            // 找到为0就将isLoad设为false，并退出each
            if(this.height === 0){
                this.isLoad = false;
                return false;
            }
        });
        // 为true，没有发现为0的。加载完毕
        if(this.isLoad){
            clearTimeout(this.img_timer); // 清除定时器
            clearTimeout(this.timeout_timer);
            callback();
            // 为false，因为找到了没有加载完成的图，将调用定时器递归
        }else{
            this.isLoad = true;
            this.img_timer = setTimeout(function(){
                this.isImgLoad(callback); // 递归扫描
            }.bind(this),100); //设置100毫秒就扫描一次
        }
    },
    /*
    * 超时显示页面
    */
    timeout:function(){
        clearTimeout(this.img_timer);
        clearTimeout(this.timeout_timer);
        loading.hide();
        $(this.ele).show();
    }
};
module.exports = ImgLoading;