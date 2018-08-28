/**
 * @require style.less
 * @require modules/library/swiper/swiper.css
 *
 */
var $ = require('zepto')
var preload = require('./preload')
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');
var native = require('modules/common/native');
var Service = require('modules/common/service');
var template = require('modules/common/template');
var comm = require('modules/common/common');
var swiper = require('modules/library/swiper/swiper');

// 获取模板字符串
var temStr = $("#rewardItems").html();
var luckTemStr = $("#luckItems").html();

var lotteryRewardJson = {
    key20181001: {prizeId: 20181001, prizeDesc: '[稀有]小米5X', prizeKey: 4},
    key20181002: {prizeId: 20181002, prizeDesc: '小米小钢炮蓝牙音箱', prizeKey: 10},
    key20181003: {prizeId: 20181003, prizeDesc: '九阳(Joyoung)榨汁机', prizeKey: 0},
    key20181004: {prizeId: 20181004, prizeDesc: '酷我(KUWO)K1无线蓝牙运动耳机', prizeKey: 6},
    key20181005: {prizeId: 20181005, prizeDesc: '爱奇艺VIP会员', prizeKey: 2},
    key20181006: {prizeId: 20181006, prizeDesc: '10元现金', prizeKey: 9},
    key20181007: {prizeId: 20181007, prizeDesc: '3元投资红包', prizeKey: 11},
    key20181008: {prizeId: 20181008, prizeDesc: '经理体验券', prizeKey: 12},
    key20181009: {prizeId: 20181009, prizeDesc: '1元奖励金', prizeKey: 7},
    key20181010: {prizeId: 20181010, prizeDesc: '0.5元现金', prizeKey: 3},
    key20181011: {prizeId: 20181011, prizeDesc: '16元投资红包', prizeKey: 5},
    key20181012: {prizeId: 20181012, prizeDesc: '加佣券', prizeKey: 1},
}
var luckRewardArr = ['总监体验券', '50元京东E卡', '100元京东E卡']

var globalTimeId;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function preHandler(e){e.preventDefault();}
var boundty = {
    init: function () {
        var self = this;
        this.is_animate = false;
        this.speed = 200;
        this.times = 0;
        this.index = -1
        this.cycle = 40
        this.timer = null
        this.prize = 0
        this.remainTimes = 0;
        this.totalTimes = 0;
        this.popTabKey = 0;
        this.liecaiBalance = 0;// 貅比特余额
        this.signTransferBouns = 0// 签到奖励金
        this.lotteryTime = 1;// 抽奖次数
        this.luckPrizeId = 0; // 幸运奖id
        if(native.isApp){
            native.getAppToken(function(data){
                self.token = data || '';
                sessionStorage.setItem("__token__",self.token);
                self.bindEvent();
                self.preloadInit();
                native.action('removeLocalSharedBtn');
            });
        }else{
            this.token  = sessionStorage.getItem("__token__");
            this.bindEvent()
            this.preloadInit()
        }

        if(comm.isIOS()){
            $(".cyclinder-center-wrapper").css('right','0')
        }else if(comm.isAndroid()){
            $(".cyclinder-center-wrapper").css('right','-1px')
        }
    },
    preloadInit: function () {
        var self = this;
        var pics = [];
        for (var i = 0, len = $('img').length; i < len; i++) {
            pics.push($('img')[i].src)
        }
        new preload(pics, {
            progress: function (index, total, type) {
                var percent = Math.floor(index / total * 100) + '%';
                $("#preloadProgress").css('width', percent)
                $("#progressText").text(percent)
            },
            complete: function (sucessNum, failNum) {
                $(".preload-container").addClass('animation').fadeIn();
                setTimeout(function(){
                    $(".preload-container").remove();
                },1000)
                $(".wraper").css('visibility', 'visible')
                if(self.token){
                    self.getRewardTimes()
                }
                self.getRewardRecord()
                self.myScroll = new IScroll('#popRewardLists',{click: true,tap: true });
                self.myScroll.on('scrollEnd',function(){
                	if(Math.abs(this.y) > Math.abs(this.maxScrollY + 20)){//上拉加载更多 
                		if(self.popTabKey == 0){
                			self.getMoreUserRewardRecordData()
                		}else if(self.popTabKey == 1){
                            self.getMoreUserLuckRewardRecordData();
                        }
                	}
                })
            }
        })
    },
    bindEvent: function () {
        var self = this;
        /*隐藏弹窗*/
        $("#popContainer").on('click','.hidePop',function(event){
            $("#popContainer").add('.pop-content').add('.hidePart').hide();
            self.enableBodyScroll();
            event.preventDefault();
        })

        /*tab切换按钮*/
        $("#popTab").on('click', 'p', function () {
            if ($(this).hasClass('active')) return
            $(this).addClass('active').siblings('p').removeClass('active')
            $("#popTabContent").children('li').eq($(this).data('key')).show().siblings('li').hide()
            self.popTabKey = $(this).data('key');
            $("#rewardTipsWrapper").children().eq($(this).data('key')).show().siblings().hide();
            self.myScroll.refresh();
        })

        /*抽奖一次按钮*/
        $("#lotteryOneTime").on("touchstart", function (event) {
        	if(self.is_animate) return;
            $(this).children('img').attr('src', $("#lotteryOneActive").attr('src'))
            event.preventDefault()
        }).on('touchend', function (event) {
            if (_hmt) _hmt.push(['_trackEvent', 'link', 'click', 'S_8_2'])
            self.goToDownloadPage()
        	if(self.is_animate) return;
            event.preventDefault()
            $(this).children('img').attr('src', $("#lotteryOneDefault").attr('src'))
            self.judgeLotteryBalance(1)
        }).off('click')

        /*抽奖10次按钮*/
        $("#lotteryTenTime").on("touchstart", function (event) {
        	if(self.is_animate) return;
            $(this).children('img').attr('src', $("#lotteryTenActive").attr('src'))
            event.preventDefault()
        }).on('touchend', function (event) {
            if (_hmt) _hmt.push(['_trackEvent', 'link', 'click', 'S_8_3'])
            self.goToDownloadPage()
        	if(self.is_animate) return;
            $(this).children('img').attr('src', $("#lotteryTenDefault").attr('src'))
            event.preventDefault()
            self.judgeLotteryBalance(10)
        }).off('click')


        // 查看奖品点击跳转
        $("#seeReward").on('click', function () {
            if (_hmt) _hmt.push(['_trackEvent', 'link', 'click', 'S_8_4'])
            self.goToDownloadPage()
            $("#popContainer").add('.pop-content-five').show()
            self.userRewardRecord();
            self.getAddressData();
            self.userLuckRewardRecord()
            self.preventBodyScroll()
            self.myScroll.refresh()
        })

        $("#luckRuleBtn").on('click', function () {
            self.preventBodyScroll()
            $("#popContainer").add('.pop-content-six').show()
        })

        $("#goShipAddr").on('click', function () {
            $(".hidePop").trigger('click');
            native.action('refreshPage')
            native.locationInApp(publicConfig.leicaiDomain+ 'pages/guide/shippingAddress.html')

        })
    },
    goToDownloadPage:function(){
        if(!native.isApp){
            location.href = './../download/download.html'
            return;
        }
        if(native.isApp && !this.token){
            native.action('tokenExpired');
            return;
        }
    },
    preventBodyScroll:function(){
        $("body").add('html').css({
            height:'100%',
            overflow:'hidden'
        })
    },
    enableBodyScroll:function(){
        $("body").add('html').css({
            height:'auto',
            overflow:'auto'
        })
    },
    preventHandler:function(e){
        e.preventDefault();
        return false;
    },
    prevent:function(){
        var self = this;
        $("body").on('touchstart',self.preventHandler).on('touchend',self.preventHandler).on('click',self.preventHandler)
    },
    enable:function(){
        $("body").off('touchstart',self.preventHandler).off('touchend',self.preventHandler).off('click',self.preventHandler)
    },
    /*
     * 判断可以抽奖的次数
     * @time 抽奖次数
     */
    judgeLotteryBalance: function (time) {
        if(!this.token) {
            native.action('tokenExpired');
            return;
        }
        var liecaiBalance = Math.floor(this.liecaiBalance)
        var signTransferBouns = Math.floor(this.signTransferBouns)
        if (time == 1) {
            if (signTransferBouns >= 1) {
                this.lotteryOneTimeEvent()
            } else if (liecaiBalance >= 1) {
                this.signTransferBounsNotEnoughTip(1);
            } else {
                this.moneyNotEnoughTip()
            }
        } else if (time == 10) {
            if (signTransferBouns >= 10) {
                this.lotteryTenTimeEvent()
            } else if ((liecaiBalance + signTransferBouns) >= 10) {
                this.signTransferBounsNotEnoughTip(10);
            } else if ((liecaiBalance + signTransferBouns) >= 1) {
                this.moneyLowTip()
            } else if ((liecaiBalance + signTransferBouns) < 1) {
                this.moneyNotEnoughTip()
            }
        }
    },
    //获取所用抽奖记录
    getRewardRecord: function () {
        var self = this;
        var getRewardRecordService = new Service();
        getRewardRecordService.api = 'activity/oneyuandraw/prize/record/all';
        getRewardRecordService.success = function (result) {
            if (result.datas.length <= 0) {
                $("#carousel").remove()
            } else {
                var carouselHtml = "";
                result.datas.forEach(function (item,index) {
                    if(index <= 20){
                        if (item.msgType == 1) {
                            carouselHtml += '<li class="carousel-item swiper-slide">' + item.mobile + ' 手机用户获得' + item.orderDesc + '</li>'
                        } else if (item.msgType == 2) {
                            carouselHtml += '<li class="carousel-item swiper-slide">' + item.mobile + ' 手机用户完成了10连抽</li>'
                        }
                    }
                })
                $("#carousel").html(carouselHtml)
                if (result.datas.length == 1) return;
                var mySwiper =  new swiper('#carouselWrapper', {
                    direction : 'horizontal',
                    loop:true,
                    speed: 1000,
                    autoplay: 3000,
                });
            }
        };
        getRewardRecordService.send();
    },
    // 获取奖励金,余额和抽奖次数
    getRewardTimes: function () {
        var self = this;
        var getRewardTimesService = new Service();
        getRewardTimesService.api = 'activity/oneyuandraw/prize/times';
        getRewardTimesService.isShowLoading = false;
        getRewardTimesService.success = function (result) {
            self.liecaiBalance = parseFloat(result.liecaiBalance).toFixed(2);
            self.signTransferBouns = parseFloat(result.signTransferBouns).toFixed(2);
            $("#prizeMoenyWraper").show().children('span').eq(0).text(self.signTransferBouns)
            $("#balanceMoneyWraper").show().children('span').eq(0).text(self.liecaiBalance)

            setTimeout(function(){
                self.getRewardTimes();
            },3000)

            var luckValueH = 0;
            var step = 40;
            var percent = 0;
            var distanceLuckValue = 0;
            var luckValueScale1Src = "";
            var luckValueScale2Src = "";
            var luckValueScale3Src = "";
            var roundTimeText = '一';
            var luckProgressBottomTextHtml = ''
            var nextLuckRewardText = '';
            if (result.roundTime % 2 == 1) { // 轮次一
                luckValueScale1Src = $("#luckText200").attr('src')
                luckValueScale2Src = $("#luckText400").attr('src')
                luckValueScale3Src = $("#luckText600").attr('src')
                roundTimeText = '一'
                luckProgressBottomTextHtml = '<p>200</p><p>400</p><p>600</p>'
                percent = (parseFloat(result.count / 600) * 100).toFixed(2);
                distanceLuckValue = 200 - result.count % 200;
                nextLuckRewardText = luckRewardArr[Math.floor(result.count / 200)]
            } else if (result.roundTime % 2 == 0) {// 轮次二
                luckValueScale1Src = $("#luckText400").attr('src')
                luckValueScale2Src = $("#luckText800").attr('src')
                luckValueScale3Src = $("#luckText1200").attr('src')
                roundTimeText = '二'
                luckProgressBottomTextHtml = '<p>400</p><p>800</p><p>1200</p>'
                percent = (parseFloat(result.count / 1200) * 100).toFixed(2);
                distanceLuckValue = 400 - result.count % 400;
                nextLuckRewardText = luckRewardArr[Math.floor(result.count / 400)]
            }
            $(".luck-progress").css('width', percent + '%')
            $(".luck-circle").css('left', percent + '%')
            $("#luckValueScale1").attr('src', luckValueScale1Src)
            $("#luckValueScale2").attr('src', luckValueScale2Src)
            $("#luckValueScale3").attr('src', luckValueScale3Src)
            $("#rountTime").text(roundTimeText)
            $("#luckProgressBottomText").html(luckProgressBottomTextHtml)
            $("#platformLuckValue").text(result.count)
            $("#nextLuckValueReward").text('(拿' + nextLuckRewardText + ')').show()
            var gap = Math.ceil(percent / step);
            $("#luckValueDistance").text(distanceLuckValue)
            var luckValueHeightDom = $("#luckValueHeight");
            luckValueHeightDom.css('height', percent + '%');
        };
        getRewardTimesService.send();
    },
    /*抽奖一次*/
    lotteryOneTimeEvent: function () {
        var self = this;
        this.lotteryTime = 1;
        var lotteryOneTimeEventService = new Service();
        lotteryOneTimeEventService.api = 'activity/oneyuandraw/prize/one';
        lotteryOneTimeEventService.isNeedToken = true;
        lotteryOneTimeEventService.isShowLoading = false;
        lotteryOneTimeEventService.success = function (result) {
            self.prize = lotteryRewardJson['key' + result.prizeId].prizeKey;
            self.luckPrizeId = result.fortunePrizeResponse.prizeId;
            var rewardId = '#reward-' + self.prize;
            if (self.luckPrizeId == 0) {
                $("#oneRewardNotLuckRewardImg").attr('src', $(rewardId).attr('src'))
                $("#oneRewardNotLuckRewardText").text('获得' + lotteryRewardJson['key' + result.prizeId].prizeDesc)
            } else {
                var luckRewardId = '#luckReward' + self.luckPrizeId;
                $("#oneRewardHaveLuckRewardImg").attr('src', $(rewardId).attr('src'))
                $("#oneRewardHaveLuckRewardText").text('获得' + lotteryRewardJson['key' + result.prizeId].prizeDesc)
                $("#oneRewardHaveLuckRewardLuckImg").attr('src', $(luckRewardId).attr('src'))
                $("#oneRewardHaveLuckRewardLuckText").text('获得幸运奖品' + luckRewardArr[self.luckPrizeId*1 - 1])
            }
            self.animate()
        };
        lotteryOneTimeEventService.send();
    },
    /*抽奖十次*/
    lotteryTenTimeEvent: function () {
        var self = this;
        this.lotteryTime = 10;
        var lotteryTenTimeEventService = new Service();
        lotteryTenTimeEventService.api = 'activity/oneyuandraw/prize/ten';
        lotteryTenTimeEventService.isNeedToken = true;
        lotteryTenTimeEventService.isShowLoading = false;
        lotteryTenTimeEventService.success = function (result) {
            self.prize = lotteryRewardJson['key' + result.prizeIdList[0]].prizeKey;
            self.luckPrizeId = result.fortunePrizeResponse.prizeId || 0;
            var tenRewardItemArr =[];
            var eachPrize;
            var eachRewardId;
            for(var i=0,len = result.prizeIdList.length;i<len;i++){
                eachPrize = lotteryRewardJson['key' + result.prizeIdList[i]].prizeKey
                eachRewardId = '#reward-' + eachPrize;
                tenRewardItemArr.push('<li><img src='+$(eachRewardId).attr('src')+'><div class="rewards-text"><p>'+lotteryRewardJson['key' + result.prizeIdList[i]].prizeDesc+'</p></div></li>')
            }
            $("#tenRewardItems").html(tenRewardItemArr.join(""))
            if (self.luckPrizeId != 0) {
            	var luckRewardId = '#luckReward' + self.luckPrizeId;
            	$("#tenRewardHaveLuckImg").attr('src', $(luckRewardId).attr('src'))
            	$("#tenRewardHaveLuckText").text('获得幸运奖品' + luckRewardArr[self.luckPrizeId*1 - 1])
            	$("#tenRewardHaveLuckWrapper").show()
            }
            self.animate()
        };
        lotteryTenTimeEventService.send();
    },
    //用户抽奖记录
    userRewardRecord:function(){
        $("#rewardItems").html("")
        this.userRewardRecordPageIndex = 1;
    	this.getUserRewardRecordData()
    },
    // 获取用户抽奖记录
    getUserRewardRecordData:function(){
    	var self = this;
    	var userRewardRecordService = new Service();
    	userRewardRecordService.api = 'activity/oneyuandraw/prize/record/user/pageList';
    	userRewardRecordService.isNeedToken = true;
    	userRewardRecordService.isShowLoading = false;
    	userRewardRecordService.data = {
    		isfortunePrize:0,
    		pageIndex:this.userRewardRecordPageIndex
    	}
    	userRewardRecordService.success = function (result) {
    		var resultArr = result.datas;
    		if($.isArray(resultArr) && resultArr.length > 0){
    			var prizeKey = 0; 
    			var prizeKeyId = "";
    			resultArr.forEach(function(item){
                    if(item.isFortunePrize == 2){
                        prizeKey = lotteryRewardJson['key' + item.prizeId].prizeKey;
    					prizeKeyId = '#reward-' + prizeKey
    					item.imgPic = '<img src='+$(prizeKeyId).attr('src')+' />'
    					item.prizeDesc = '获得' + lotteryRewardJson['key' + item.prizeId].prizeDesc;
    				}else if(item.isFortunePrize == 1){
    					var luckRewardId = "#luckReward"+item.prizeId;
    					item.prizeDesc = '恭喜您,获得幸运奖品' + luckRewardArr[item.prizeId - 1];
    					item.imgPic = '<img src='+$(luckRewardId).attr('src')+' />'
    				}
    				return item;
    			})
    			$("#rewardItems").append(template.getHtml(temStr,resultArr));
    			self.userRewardRecordPageCount = result.pageCount;
    			$("#rewardTips").text('我已获得'+result.totalCount+'件奖品')
    			self.myScroll.refresh()
    		}else{
    			$("#emptyRewardContainer").show()
    			$("#rewardItemsContainer").hide()
    		}

    	};
    	userRewardRecordService.send();
    },
    getMoreUserRewardRecordData:function(){
    	if(this.userRewardRecordPageIndex >= this.userRewardRecordPageCount) return
    	this.userRewardRecordPageIndex++;
    	this.getUserRewardRecordData();
    },
    // 用户幸运奖记录
    userLuckRewardRecord:function(){
        $("#luckItems").html("")
        this.userLuckRewardRecordPageIndex = 1;
        this.getUserLuckRewardRecordData()
    },
    // 用户幸运奖记录
    getUserLuckRewardRecordData:function(){
    	var self = this;
    	var getLuckRewardRecordDataService = new Service();
    	getLuckRewardRecordDataService.api = 'activity/oneyuandraw/prize/record/fortune';
    	getLuckRewardRecordDataService.isNeedToken = false;
    	getLuckRewardRecordDataService.isShowLoading = false;
    	getLuckRewardRecordDataService.data = {
    		pageIndex:this.userLuckRewardRecordPageIndex
    	}
    	getLuckRewardRecordDataService.success = function (result) {
    		var resultArr = result.datas;
    		if($.isArray(resultArr) && resultArr.length > 0){
    			resultArr.forEach(function(item){
    				item.roundTime = item.roundTime % 2 == 1?'第一轮':'第二轮'
    				item.prizeDesc = luckRewardArr[item.prizeId-1]
    				return item;
    			})
    			$("#luckItems").append(template.getHtml(luckTemStr,resultArr));
    			$("#luckTips").text('幸运奖品已发放'+result.totalCount+'次')
                self.userLuckRewardRecordPageCount = result.pageCount;
    			self.myScroll.refresh()
    		}else{
    			$("#emptyLuckContainer").show()
    			$("#luckItemsContainer").hide()
    		}
    	};
    	getLuckRewardRecordDataService.send();
    },
    getMoreUserLuckRewardRecordData:function(){
        if(this.userLuckRewardRecordPageIndex >= this.userLuckRewardRecordPageCount) return
        this.userLuckRewardRecordPageIndex++;
        this.getUserLuckRewardRecordData();
    },
    getAddressData:function(){
    	var self = this;
    	var getAddressDataService = new Service();
    	getAddressDataService.api = 'activity/oneyuandraw/receiving/address';
    	getAddressDataService.isNeedToken = true;
    	getAddressDataService.isShowLoading = false;
    	getAddressDataService.success = function (result) {
    		var resultArr = result.datas;
    		if($.isArray(resultArr) && resultArr.length > 0){
    			$("#address").text('修改收货地址')
    		}else{
    			$("#address").text('添加收货地址')
    		}
    	};
    	getAddressDataService.send();
    },
    /*
     * 奖励金不足,使用余额抽奖
     * @ time 抽奖次数
     */
    signTransferBounsNotEnoughTip: function (time) {
        var self = this;
        var tip = new BubbleTip({
            msg: '奖励金不足<br>是否使用余额继续抽奖？',
            buttonText: ['取消', '使用余额抽奖'],
            callback: function (ok) {
                if (ok) {
                    if (time == 1) {
                        self.lotteryOneTimeEvent()
                    } else if (time == 10) {
                        self.lotteryTenTimeEvent()
                    }
                }
            }
        });
        tip.show();
    },
    animate: function () {
        var self = this;
        this.is_animate = true
        this.times++
        this.index++
        this.index = this.index % 12
        var len = $(".rotate-content-item").length;
        for (var i = 0; i < len; i++) {
            var id = $(".rotate-content-item").eq(i).data('id');
            if (id === this.index) {
                $(".rotate-content-item").removeClass('active').eq(i).addClass('active')
            }
        }
        this.prevent();
        this.preventBodyScroll();
        this.timer = setTimeout(this.animate.bind(this), this.speed)
        if (this.times > this.cycle + 10 && this.prize === this.index) {
            clearTimeout(this.timer)
            setTimeout(function () {
                if (self.lotteryTime == 1) {
                    if (self.luckPrizeId == 0) {
                        $("#popContainer").add("#oneRewardNotLuckReward").show()
                    } else {
                        $("#popContainer").add("#oneRewardHaveLuckReward").show()
                    }
                }else if(self.lotteryTime == 10){
                    $("#popContainer").add("#tenReward").show()
                }

                self.times = 0
                self.is_animate = false;
                self.speed = 200
                $(this).off('touchmove')
                self.getRewardTimes()
                self.enable();
                self.preventBodyScroll();
            }, 500)
        } else {
            this.easeOut();
        }
    },
    easeOut: function () {
        if (this.times < this.cycle) {
            this.speed -= 20;
        } else if (this.times > this.cycle) {
            if (this.times > this.cycle + 10 && ((this.prize == 0 && this.index == 11) || this.prize == this.index + 1)) {
                this.speed += 110;
            } else {
                this.speed += 20;
            }
        }
        if (this.speed < 40) {
            this.speed = 40;
        }
    },
    moneyNotEnoughTip: function () {
        var tip = new BubbleTip({
            msg: '奖励金和余额不足',
            buttonText: ['取消', '返回签到'],
            callback: function (ok) {
                if (ok) {
                    native.action('refreshPage')
                    var data = {
                        android:{
                            name:'SignInActivity',
                            paramsKey:'',
                            params:''
                        },
                        ios:{
                            name:'SignViewController',
                            method:'initWithNibName:bundle:',
                            params:'SignViewController,nil',
                            naviStatus:'1'
                        }
                    }
                    native.skipAppPage(data)
                }
            }
        });
        tip.show();
    },
    moneyLowTip: function () {
        var self = this;
        var liecaiBalance = Math.floor(this.liecaiBalance)
        var signTransferBouns = Math.floor(this.signTransferBouns)
        var buttonText = signTransferBouns >= 1 ? ['取消', '抽奖一次(奖励金)'] : ['取消', '抽奖一次(余额)'];
        var tip = new BubbleTip({
            msg: '奖励金和余额不足',
            buttonText: buttonText,
            callback: function (ok) {
                if (ok) {
                    self.lotteryOneTimeEvent()
                }
            }
        });
        tip.show();
    },
}

boundty.init()