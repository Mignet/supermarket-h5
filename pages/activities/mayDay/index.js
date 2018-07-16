/**
 * @require style.less
 * @require modules/library/swiper/swiper.css
 */
var $ = require("zepto");
var preload = require('./js/preload.js');
var native = require('modules/common/native');
var service = require('modules/common/service');
var api = require('modules/api/api')
var wechatShare = require('modules/common/wechatShare')
var comm = require("modules/common/common");
var QRCode = require('./js/qrcode.js')
var Swiper   = require('modules/library/swiper/swiper');
var share       = require("modules/widget/share/share");

var Orientation = null;
var MD5 = "610ffa981b78e47865ed0d6b32d2233b";
var boyMD5Arr = ['610ffa981b78e47865ed0d6b32d2233b','f4453bb36f04cc82e21b201b12887631','b2040415dd7563a6dee9f2e4edadec36']
var girlMD5Arr = ['d740d7b755d9eda5cc2ed2760db560a8','9ac946a64c1e9d6f3f223108eb8bcd45','75e8832265ce9bdcd5132a96e520ee63']

var mayDay = {
    init: function () {
        var self = this;
        this.query = comm.getQueryString()
        self.imgBase64 = '';
        self.imageMD5 = '';
        self.tempMD5 = '';
        self.psMD5 = '';
        self.qrcodeSrc = "";
        self.linkOpenId = self.query.linkOpenId || "";
        self.openId = "";
        this.loveWorkNum = 0;
        this.qrcode = new QRCode("qrcodeContent",{ width:600,height:600});
        if(native.isApp){
            $(".five-bottom").hide();
        }
        // this.makeCode()
        this.swiperEvent();
        if(this.query.md5){
            $("#friendAvator").add('#friendSrc').attr('src',comm.getServerImg(this.query.md5))
        }else {
            this.mySwiper.slideNext();
        }
        if(comm.isWebChat()){
            this.loginWeChat();
        }else{
            this.init2()
        }
        
    },
    preloadInit: function () {
        var self = this;
        var pics = [];
        for (var i = 0, len = $('#imageTemp').children('img').length; i < len; i++) {
            pics.push($('#imageTemp').children('img').eq(i).attr('src'))
        }
        new preload(pics,{
            progress: function (index, total, type) {
                var percent = Math.floor(index / total * 100);
                $("#prePrecent").text(percent)
                $("#preProgress").css('width',percent+"%")
            },
            complete: function (sucessNum, failNum) {
                $("#preloadContainer").addClass('animation')
                $(".swiper-container").css('visibility','visible')
                setTimeout(function(){
                    $("#preloadContainer").remove();
                },1000)
                self.getWorkNum();
                self.bindEvent();
            }
        })
    },
    init2:function(){
        var self = this;
        this.preloadInit();
    },
    loginWeChat:function(){
        if(this.query.code){
            sessionStorage.setItem('__code__',this.query.code)
            this.getInfo(this.query.code);
        }else{
            this.getCode();
        }
    },
    getInfo:function(code){
        var self = this;
        var getInfoService = new service();
        getInfoService.api = 'helpRaiseRate/getLieCaiWeixinInfo';
        getInfoService.isShowLoading = false;
        getInfoService.isNeedToken = false;
        getInfoService.data = {
            code: code
        }
        getInfoService.success = function (result) {
            sessionStorage.setItem('__headimgurl__', result.headimgurl);
            sessionStorage.setItem('__nickname__', result.nickname);
            sessionStorage.setItem('__openid__', result.openid);
            self.openId = result.openid;
            if(self.openId == self.linkOpenId){
                $("#frientText").attr('src',$("#myCloth").attr('src'))
            }
            self.init2();
        }
        getInfoService.error = function (msg, result) {
            self.getCode();
        }
        getInfoService.send();
    },
    getCode:function(){
        var realUrl = location.href;
        var url = 'https://nliecai.toobei.com/getWechatCode.html?appid=wx83677e6da548b99e&redirect_uri=' + encodeURIComponent(realUrl) + '&scope=snsapi_userinfo&state=getinfo#wechat_redirect';
        location.href = url;
    },
    makeCode:function(){
        var self = this;
        var url ;
        if(self.openId){
            url = location.href.split('?')[0] + '?from=scan&md5=' + self.psMD5 + '&linkOpenId=' + self.openId
        }else {
            url = location.href.split('?')[0] + '?from=scan&md5=' + self.psMD5
        }
        this.qrcode.clear();
        this.qrcode.makeCode(url);
        setTimeout(function(){
            self.qrcodeSrc = $("#qrcodeContent").children('img').attr('src');
            picToCanvas($("#generateImg"));
        },500)
    },
    saveData:function(){
        var self = this;
        if(!comm.isWebChat()) return;
        var saveDataService = new service();
        saveDataService.api = 'labor/changeFace/record';
        saveDataService.isShowLoading = false;
        saveDataService.isNeedToken = false;
        saveDataService.data = {
            headImage:self.psMD5,
            openid:self.openId,  
            weixinNickname:sessionStorage.getItem('__nickname__')
        }
        saveDataService.success = function (result) {
        }
        saveDataService.error = function (msg, result) {
        }
        saveDataService.send();
    },
    bindEvent:function(){
        var self = this;

        $(".slideNextHook").on('click',function(){
            self.mySwiper.slideNext();
        })

        var twoClick = false;
        $("#twoContentWrapper").on('click','li',function(){
            if(!twoClick){
                twoClick = true;
                $(this).addClass('active').siblings('li').removeClass('active');
                MD5 = $(this).data('md5');
                $("#tempImg").attr('src',comm.getServerImg(MD5))
                self.tempMD5 = MD5;
                setTimeout(function(){
                    var img = new Image();
                    img.src = comm.getServerImg(MD5);
                    img.onload = function(){
                        self.mySwiper.slideNext();
                        twoClick = false;
                    }
                },200)
            }
        })

        $("#takePhoto").on('change', function (e) {
            var file = e.target.files[0];
            $("#threeLayer").show();
            setTimeout(function(){
                self.FileImageControl(file);
            },500)
        })

        $("#uploadPhotoBtn").on('click',function(){
            $("#takePhoto").trigger('click')
        })

        $("#cancelSelectImage").on('click',function(){
            $("#takePhoto").val('');
            $("#selectImageWrapper").show()
            $("#clipWrapper").hide()
        })

        $("#sureSelectImage").on('click',function(){
            $("#myPhoto").attr('src',self.imgBase64)
            $("#threeLayer2").show();
            setTimeout(function(){
                $("#threeLayer2").hide();
            },5000)
            self.uploadMD5();
        })

        $(".changeCloth").on('click',function(){
            self.mySwiper.slideTo(1)
        })

        $(".changeImage").on('click',function(){
            $("#takePhoto").val('');
            $("#selectImageWrapper").show()
            $("#clipWrapper").hide()
            self.mySwiper.slideTo(2);
        })

        $("#shareBtn").on('click',function(){
            share.show()
        })
    },
    getWorkNum:function(code){
        var self = this;
        var getWorkNumService = new service();
        getWorkNumService.api = 'labor/loveWorkNum';
        getWorkNumService.isShowLoading = false;
        getWorkNumService.isNeedToken = false;
        getWorkNumService.success = function (result) {
            $(".loveWorkNum").text(result.loveWorkNum)
            self.loveWorkNum = result.loveWorkNum;
        }
        getWorkNumService.send();
    },
    uploadMD5:function(){
        var self = this;
        var data = JSON.stringify({
                temp:self.tempMD5,
                image:self.imgBase64
            })

        $.ajax({  
            type: "POST",   //提交的方法
            url:publicConfig.leicaiDomain + "face/upload", //提交的地址
            data:data,
            contentType: 'application/json; charset=utf-8', // 很重要
            error: function(request) {  //失败的话
                $(".error-tips").show()
                $("#fourLayer").hide()
            },  
           success: function(result) {  //成功
                var result = result[0]
                if(result.code == 0){
                    self.psMD5 = result.MD5;
                }
                $("#handlePhoto").on('click',function(){

                })
                self.saveData();
                $("#fourLayer").hide()
                // self.wechatShareEvent();
                self.makeCode();
                $("#avatar").attr('src',comm.getServerImg(self.psMD5))
                // self.mySwiper.slideNext();
                // 修改formurl来源,统计使用
                sessionStorage.setItem('__referer__',"mayDayActivities")
           }
        });
    },
    FileImageControl: function (file) {
        var self = this;
        if (file) {
            var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
            if (!rFilter.test(file.type)) {
                // alert('请选择jpeg、png格式的图片')
                window.location.reload();
                return;
            }
            //获取照片方向角属性，用户旋转控制
            EXIF.getData(file, function () {
                EXIF.getAllTags(this);
                Orientation = EXIF.getTag(this, 'Orientation');
            });

            var oReader = new FileReader();
            var expectWidth, expectHeight;
            oReader.onload = function (e) {
                var image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    // 真实图片宽度和高度
                    var expectWidth = this.naturalWidth;
                    var expectHeight = this.naturalHeight;

                    if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 750) {
                        expectWidth = 750;
                        expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
                    } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 920) {
                        expectHeight = 920;
                        expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                    }

                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    canvas.width = expectWidth;
                    canvas.height = expectHeight;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                    var base64 = null;
                    base64 = canvas.toDataURL("image/jpeg", 0.4);
                    if (Orientation != "" && Orientation != 1) {
                     switch (Orientation) {
                         case 6://需要顺时针（向左）90度旋转
                             // alert('需要顺时针（向左）90度旋转');
                             rotateImg(this, 'left', canvas, expectWidth, expectHeight);
                             break;
                         case 8://需要逆时针（向右）90度旋转
                             // alert('需要顺时针（向右）90度旋转');
                             rotateImg(this, 'right', canvas, expectWidth, expectHeight);
                             break;
                         case 3://需要180度旋转
                             // alert('需要180度旋转');
                             rotateImg(this, 'right', canvas, expectWidth, expectHeight);//转两次
                             rotateImg(this, 'right', canvas, expectWidth, expectHeight);
                             break;
                     }
                    }
                     base64 = canvas.toDataURL("image/jpeg", 0.6);

                    //执行操作
                    self.imgBase64 = base64;

                    $("#sureImg").attr('src', base64)
                    $("#threeLayer").hide();
                    $("#selectImageWrapper").hide();
                    $("#clipWrapper").show()
                };
            };
            oReader.readAsDataURL(file);
        }
    },
    swiperEvent:function () {
        this.mySwiper = new Swiper ('.swiper-container', {
            direction: 'horizontal',
            // initialSlide:3,
            resistanceRatio:0,
            noSwiping : true,
            lazyLoading : true,
            lazyLoadingInPrevNext : true,
        })
    },
    //微信分享
    wechatShareEvent:function(result){
        var SHARE_URL = publicConfig.leicaiDomain + 'pages/activities/mayDay.html?md5='+this.psMD5 + "&linkOpenId=" + this.openId
        // 微信分享信息
        var wechatShareData = {
            title  : '来看看我的劳动工装照', // 分享标题
            desc   : '有超过'+this.loveWorkNum+'人跟我一样成为了热爱工作的无产阶级，你也来试试吧', // 分享描述
            link   : SHARE_URL, // 分享链接
            imgUrl : publicConfig.imageUrl +this.psMD5 +'?p=1&w=100&h=100?f=png' // 分享图标
        };
        new wechatShare(wechatShareData);
    }
}
mayDay.init();

//对图片旋转处理
function rotateImg(img, direction, canvas, expectWidth, expectHeight) {
    //最小与最大旋转方向，图片旋转4次后回到原方向
    var min_step = 0;
    var max_step = 3;
    if (img == null) return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错
    var width = expectWidth;
    var height = expectHeight;
    var step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    //旋转角度以弧度值为参数
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, expectWidth, expectHeight);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height, expectWidth, expectHeight);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height, expectWidth, expectHeight);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0, expectWidth, expectHeight);
            break;
    }
}

function picToCanvas($dom) {
    // 照片背景
    var bg = new Image();
    var selectBg = new Image();

    // 二维码
    var qrcode = new Image();
    // logo
    var logo = new Image();

    // 文字提示
    var tips = new Image();

    // 头像
    var avatar = new Image();
    avatar.crossOrigin = 'anonymous'
    var loaded = 0;
    var onLoad = function () {
        loaded += 1;
        if (loaded == 6) {
            var width = canvas.width;
            var height = canvas.height;

            ctx.lineWidth=4;

            // 画背景
            ctx.drawImage($("#tempContentBg").get(0), 0, 0, width, height);

            // 画相框
            ctx.drawImage(selectBg,width/2 - 430*2/2 , 10*2, 430*2, 524*2);

            ctx.drawImage(avatar,width/2 - 430*2*.86/2 , 44*2, 430*2*.86, 524*2*.86);

            ctx.drawImage(tips,50*2, 568*2, 155*1.4*2, 127/445*155*1.4*2);

            roundRect(ctx,width/2+60*2, 540*2, 120*2, 120*2, 10*2, '#8d939a', 'stroke');

            ctx.drawImage(qrcode,width/2+60*2 + 6*2 ,540*2 + 6*2, 108*2, 108*2);

            ctx.drawImage($("#logoImg").get(0),width/2+60*2+50*2 ,540*2 + 50*2, 20*2, 20*2);

            ctx.font = '48px 微软雅黑';
            ctx.textAlign = "center";
            // 用渐变填色
            ctx.fillStyle="#4d496e";
            ctx.fillText($('.tech-tips').text(), width - 160*2, 694*2);
            finish();
        }
    };

    bg.onload = onLoad;
    selectBg.onload = onLoad;
    tips.onload = onLoad;
    qrcode.onload = onLoad;
    logo.onload = onLoad;
    avatar.onload = onLoad;

    bg.src = $("#tempContentBg").attr('src')
    tips.src = $('#laodongjieTips').attr('src');
    qrcode.src = mayDay.qrcodeSrc;
    selectBg.src = $("#tempSelectBg").attr('src')
    logo.src = $("#logoImg").attr('src')
    avatar.src = $("#avatar").attr('src')

    var $canvas = $("<canvas/>").attr('width', 556*2).attr('height', 720*2);
    var canvas = $canvas.get(0);
    var ctx = canvas.getContext('2d');

    var finish = function () {
        var dataUrl = $canvas.get(0).toDataURL("image/png");
        var newImg = document.createElement("img");
        newImg.className = "donePhoto";
        newImg.crossOrigin = 'anonymous';
        newImg.src = dataUrl;
        $(newImg).css('width', '100%');
        $dom.append(newImg).show();
        $dom.children('div').hide();
        mayDay.mySwiper.slideNext();
        mayDay.wechatShareEvent();
    }
}

function roundRect(ctx,x, y, width, height, radius, color, type){
    ctx.beginPath();
    ctx.moveTo(x, y+radius);
    ctx.lineTo(x, y+height-radius);
    ctx.quadraticCurveTo(x, y+height, x+radius, y+height);
    ctx.lineTo(x+width-radius, y+height);
    ctx.quadraticCurveTo(x+width, y+height, x+width, y+height-radius);
    ctx.lineTo(x+width, y+radius);
    ctx.quadraticCurveTo(x+width, y, x+width-radius, y);
    ctx.lineTo(x+radius, y);
    ctx.quadraticCurveTo(x, y, x, y+radius);
    ctx[type + 'Style'] = color || params.color;
    ctx.closePath();
    ctx[type]();
}