/**
 * 图片预加载
 */
var comm = require("modules/common/common");

 function preload(pics,options){
    this.preload(pics,options)
 }
 preload.defaultOptions = {
    complete: function() {},
    progress: function() {}
 }

 preload.prototype={
    constructor:preload,
    preload:function(pics,options){
        if (!comm.isArray(pics)) {
            throw new Error('pics must be an array type')
        }
        this.pics = pics;
        this.options = comm.extend({}, this.constructor.defaultOptions, options);
        this.index = this.failNum = 0;
        this.init();
    },
    init:function() {
        for (var i = 0; i < this.pics.length; i++) {
            this.loadImg(this.pics[i])
        }
    },
    loadImg:function(src) {
        var self = this;
        var img = new Image();
        img.onload = function() {
            img.onload = null;
            self.progress(src, 'success')
        }
        img.onerror = function() {
            self.progress(src, 'fail')
        }
        img.src = src;
    },
    progress:function(src, type) {
        if (type == 'fail') this.failNum++
        this.index++;
        this.options.progress(this.index, this.pics.length, type);
        if (this.index === this.pics.length) {
            this.options.complete(this.pics.length - this.failNum, this.failNum);
        }
    }
}

module.exports = preload;