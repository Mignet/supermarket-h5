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
var ImageFile = [];
var MD5 = "768db582bcad6d4becf76beeca0740eb";
var boyMD5Arr = ['768db582bcad6d4becf76beeca0740eb','652868732d3e69c72afe1c19fe24af60','7b6de601e4fbd7c2bae476504ff1e335']
var girlMD5Arr = ['1ce1c110a4181ac8161e7b796bdb9e8a','7aad859e4aabaf01b194f9ab66854554','466f5062eae36d003d0a70a7c9c4740a']

var mayDay = {
    init: function () {
        var self = this;
        this.imgBase64 = '';
        this.imageMD5 = '';
        this.tempMD5 = '';
        this.qrcodeSrc = "";
        this.getWorkNum();
        self.swiperEvent();
        self.bindEvent();
        this.makeCode()

        var qrcode = new QRCode("qrcode",{
            width:160,
            height:160,
        });

        function makeCode() {
            var elText = document.getElementById("text");

            if (!elText.value) {
                alert("Input a text");
                elText.focus();
                return;
            }
            qrcode.makeCode(elText.value);
        }

        makeCode();
        qrcode.makeCode("https://prenliecai.toobei.com/static/images/normal/download_logo.png");

        $("#demo1").on('change', function (e) {
            var file = e.target.files[0];
            self.FileImageControl(file);
        })

        $("#tijiao").on('click',function(){
            var form = new FormData($("#form2")[0]);
            $.ajax({  
               type: "POST",   //提交的方法
               url:"https://preliecai.toobei.com/face/upload", //提交的地址
               data:form,
               processData: false,
               contentType: 'application/json; charset=utf-8', // 很重要
               contentType: false, // 很重要
                async: false,
                cache: false,
               error: function(request) {  //失败的话
                    alert("Connection error");  
               },  
               success: function(data) {  //成功
                    console.log(data)
               }
            });
        })

        $("#tijiao2").on('click',function(){
            var form = new FormData(document.getElementById('form3'));
            $.ajax({  
                type: "POST",   //提交的方法
                url:"https://preliecai.toobei.com/img/upload", //提交的地址
                data:form,
                processData: false,
                contentType: false, // 很重要
                async: false,
                cache: false,
                error: function(request) {  //失败的话
                    alert("Connection error");  
                },  
               success: function(data) {  //成功
                if(data.indexOf("MD5")!=-1){
                    var result =  data.substring(data.indexOf("MD5:")+4,data.indexOf(","));
                    console.log(result)
                    self.imageMD5 = result;
                }
                else{
                    console.log("upload fail.");
                }
               }
            });
        })

        $("#uploadMD5").on('click',function(){
            var data = JSON.stringify({
                    temp:'768db582bcad6d4becf76beeca0740eb',
                    image:"b92b2164cd0cb88bb21d9840c930208c"
                })
            $.ajax({  
                type: "POST",   //提交的方法
                url:"https://preliecai.toobei.com/face/upload", //提交的地址
                data:data,
                contentType: 'application/json; charset=utf-8', // 很重要
                error: function(request) {  //失败的话
                    alert("Connection error");  
                },  
               success: function(data) {  //成功
                console.log(data)
               }
            });
        })
    },
    preloadInit: function () {
        var self = this;
        var pics = [];
        for (var i = 0, len = $('#imageTemp').children('img').length; i < len; i++) {
            pics.push($('#imageTemp').children('img').eq(i).attr('src'))
        }
        new preload(pics,{
            progress: function (index, total, type) {
            },
            complete: function (sucessNum, failNum) {
                $(".swiper-container").css('visibility','visible')
                self.swiperEvent();
                self.bindEvent();
            }
        })
    },
    makeCode:function(){
        var self = this;
        var qrcode = new QRCode("qrcodeContent",{
            width:160,
            height:160
        });
        qrcode.makeCode("https://www.hao123.com/?tn=93006350_hao_pg");
        setTimeout(function(){
            self.qrcodeSrc = $("#qrcodeContent").children('img').attr('src');
            setTimeout(function () {
                picToCanvas($("#generateImg"));
            }, 500);
        },500)
    },
    bindEvent:function(){
        var self = this;
        $(".one-wrapper").on('click','.slideNextHook',function(){
            self.mySwiper.slideNext();
        })

        $("#twoContentWrapper").on('click','li',function(){
            $(this).addClass('active').siblings('li').removeClass('active');
            MD5 = $(this).data('md5');
            $("#tempImg").attr('src',comm.getServerImg(MD5))
            setTimeout(function(){
                self.mySwiper.slideNext();
            },1000)
        })

        $("#takePhoto").on('change', function (e) {
            var file = e.target.files[0];
            self.FileImageControl(file);
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
            self.mySwiper.slideNext()
        })

        $("#handlePhotoBtn").on('click',function(){
            console.log('加工开始')
            $('#handlePhoto').trigger('click')
        })

        $("#handlePhoto").on('click',function(){
            var form = new FormData(document.getElementById('formWrapper'));
            $.ajax({  
                type: "POST",   //提交的方法
                url:"https://preliecai.toobei.com/img/upload", //提交的地址
                data:form,
                processData: false,
                contentType: false, // 很重要
                async: false,
                cache: false,
                error: function(request) {  //失败的话
                    // alert("Connection error");  
                },  
               success: function(data) {  //成功
                if(data.indexOf("MD5")!=-1){
                    var result =  data.substring(data.indexOf("MD5:")+4,data.indexOf(","));
                    console.log(result)
                    self.imageMD5 = result;
                    $("#uploadMD5").trigger('click')
                }
                else{
                    console.log("upload fail.");
                }
               }
            });
        })

        $("#uploadMD5").on('click',function(){
            var data = JSON.stringify({
                    temp:self.tempMD5,
                    image:self.imageMD5
                })
            $.ajax({  
                type: "POST",   //提交的方法
                url:"https://preliecai.toobei.com/face/upload", //提交的地址
                data:data,
                contentType: 'application/json; charset=utf-8', // 很重要
                error: function(request) {  //失败的话
                    alert("Connection error");  
                },  
               success: function(result) {  //成功
                console.log(result)
                console.log('加工结束')
               }
            });
        })

        $(".changeCloth").on('click',function(){
            self.mySwiper.slideTo(1)
        })

        $(".changeImage").on('click',function(){
            self.imgBase64 = "";
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
            console.log(result)
            $(".loveWorkNum").text(result.loveWorkNum)
        }
        getWorkNumService.send();
    },
    FileImageControl: function (file) {
        var self = this;
        var img = document.getElementById("preview1");
        var reader  = new FileReader();
        reader.addEventListener("load", function () {
            img.src = reader.result;  // 存储在本地的图片的base64编码
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
        if (file) {
            var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
            if (!rFilter.test(file.type)) {
                alert('请选择jpeg、png格式的图片')
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
                    } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1330) {
                        expectHeight = 1330;
                        expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                    }
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    canvas.width = expectWidth;
                    canvas.height = expectHeight;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                    var base64 = null;
                    base64 = canvas.toDataURL("image/jpeg", 0.6);
                    //修复ios
                    if (navigator.userAgent.match(/iphone/i)) {
                        //如果方向角不为1，都需要进行旋转
                        if (Orientation != "" && Orientation != 1) {
                            switch (Orientation) {
                                case 6://需要顺时针（向左）90度旋转
                                    rotateImg(this, 'left', canvas, expectWidth, expectHeight);
                                    break;
                                case 8://需要逆时针（向右）90度旋转
                                    // alert('需要顺时针（向右）90度旋转');
                                    rotateImg(this, 'right', canvas, expectWidth, expectHeight);
                                    break;
                                case 3://需要180度旋转
                                    rotateImg(this, 'right', canvas, expectWidth, expectHeight);//转两次
                                    rotateImg(this, 'right', canvas, expectWidth, expectHeight);
                                    break;
                            }
                        }
                        base64 = canvas.toDataURL("image/jpeg", 0.6);
                    } else if (navigator.userAgent.match(/Android/i)) {// 修复android
                        //如果方向角不为1，都需要进行旋转
                        if (Orientation != "" && Orientation != 1) {
                            switch (Orientation) {
                                case 6://需要顺时针（向左）90度旋转
                                    rotateImg(this, 'left', canvas, expectWidth, expectHeight);
                                    break;
                            }
                        }
                        base64 = canvas.toDataURL("image/jpeg", 0.6);
                    } else {
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
                    }
                    //执行操作
                    ImageFile[0] = base64;
                    self.imgBase64 = base64;
                    $("#sureImg").attr('src', ImageFile[0])
                    $("#selectImageWrapper").hide();
                    $("#clipWrapper").show()
                    // setTimeout(function(){
                    //     self.mySwiper.slideNext();
                    // },1000)
                };
            };
            oReader.readAsDataURL(file);
        }
    },
    swiperEvent:function () {
        this.mySwiper = new Swiper ('.swiper-container', {
            direction: 'horizontal',
            initialSlide:0,
            resistanceRatio:0,
            noSwiping : true,
        })
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
    var width = expectWidth;//img.width; //
    var height = expectHeight;// img.height;//
    // alert(width+';'+height);
    //var step = img.getAttribute('step');
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
    // 标题
    var title = new Image();
    // 二维码
    var qrcode = new Image();
    // logo
    var logo = new Image();

    // 头像
    var avatar = new Image();
    var loaded = 0;
    var onLoad = function () {
        loaded += 1;
        if (loaded == 6) {
            var width = canvas.width;
            var height = canvas.height;

            ctx.lineWidth=2;

            ctx.drawImage($("#tempContentBg").get(0), 0, 0, width, height);

            ctx.drawImage($('#fiveTitle').get(0),width * .05 , 40, width * .9, 105/666*width*.9);

            ctx.drawImage(selectBg,width/2 - 314/2 , 120, 314, 382);

            ctx.drawImage(avatar,width/2 - 314*.86/2 , 146, 314*.86, 330);

            roundRect(ctx,width/2-60, 510, 120, 120, 10, '#8d939a', 'stroke');

            ctx.drawImage(qrcode,width/2 - 48 ,510 + 12, 96, 96);

            ctx.drawImage($("#logoImg").get(0),width/2 - 10 ,560, 20, 20);

            ctx.font = '24px 微软雅黑';
            ctx.textAlign = "center";
            // 用渐变填色
            ctx.fillStyle="#4d496e";
            ctx.fillText($('.tech-tips').text(), width/2, 662);
            finish();
        }
    };

    bg.onload = onLoad;
    selectBg.onload = onLoad;
    title.onload = onLoad;
    qrcode.onload = onLoad;
    logo.onload = onLoad;
    avatar.onload = onLoad;

    bg.src = $("#tempContentBg").attr('src')
    title.src = $('#fiveTitle').attr('src');
    qrcode.src = mayDay.qrcodeSrc;
    selectBg.src = $("#tempSelectBg").attr('src')
    logo.src = $("#logoImg").attr('src')
    avatar.src = $("#avatar").attr('src')

    var $canvas = $("<canvas/>").attr('width', 532).attr('height', 688);
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