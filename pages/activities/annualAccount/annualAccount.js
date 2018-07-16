/**
 * @require annualAccount.less
 * @require modules/library/swiper/swiper.css
 *
*/
var $       = require("zepto");
var swiper = require('modules/library/swiper/swiper');
var service     = require('modules/common/service');
var comm        = require("modules/common/common");
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');
var native = require('modules/common/native');
var api = require('modules/api/api');
var share       = require("modules/widget/share/share");
var wechatShare = require('modules/common/wechatShare')

var evt = {
    init:function(){
        var self = this;
        this.timer = null;
        this.tagArr = ['赚钱大咔','理财达人','靠谱投资者','农药王者','投资砖家','团队诸葛亮','搬砖民工','剁手达人','专业理财师']
        this.myTagIndex = null;
        $(".swiper-container").height($(window.parent).height());
        // 音乐播放
        function autoPlayMusic() {
            // 自动播放音乐效果，解决浏览器或者APP自动播放问题
            function musicInBrowserHandler() {
                musicPlay(true);
                $(document).off('touchstart',musicInBrowserHandler)

            }
            $(document).on('touchstart',musicInBrowserHandler)

            // 自动播放音乐效果，解决微信自动播放问题
            function musicInWeixinHandler() {
                musicPlay(true);
                document.addEventListener("WeixinJSBridgeReady", function () {
                    musicPlay(true);
                }, false);
                document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
            }
            document.addEventListener('DOMContentLoaded', musicInWeixinHandler);
        }

        function musicPlay(isPlay) {
            var audio = document.getElementById('musicid');
            if (isPlay && audio.paused) {
                audio.src="./annualAccount/1.mp3"
                audio.load()
                audio.addEventListener("canplaythrough",function(){
                   audio.paused && (audio.play());
                },false); 
            }
            if (!isPlay && !audio.paused) {
                audio.pause();
            }
        }
        autoPlayMusic();
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token = data || '';
                if(!data){
                    // 登录
                    native.action('tokenExpired')
                }
                native.action('removeLocalSharedBtn');
                self.personAchievement()
                self.teamAchievement()
                self.liecaiAchievement()
                self.calculateResult()
                self.getUserInfo()
                self.bindEvent()
                self.swiperEvent();
            });
        } else{
            this.token = comm.getCookie('__token__') || "";
            var query = comm.getQueryString()
            this.userId = query.userId;
            this.name = query.name;
            this.mobile = query.mobile
            if(!this.token && ! this.userId){
                location.href = publicConfig.liecaiUrl + '/login/login';
            }
            if(this.userId){ // 微信中看其他用户
                this.shareButtonTime = 0;
                self.personAchievement()
                self.teamAchievement()
                self.liecaiAchievement()
                self.calculateResult()
                self.bindEvent()
                self.swiperEvent();
                if(this.shareButtonTime === 0){
                    $("#shareButton").text('我也要测算2018年的财运')
                }else if(this.shareButtonTime === 1){
                    $("#shareButton").text('立即注册猎财大师')
                }
            }else if(this.token){ // 微信中登录
                self.getUserInfo()
                self.personAchievement()
                self.teamAchievement()
                self.liecaiAchievement()
                if(comm.isWebChat()){
                    self.calculateResult()
                }
                self.bindEvent()
                self.swiperEvent();
                $("#shareButton").text('分享给好友围观吧')
            }else{ //其他

            }
            // $(".slide1").add('.slide2').add('.slide3').add('.slide4').add('.slide5').add('.slide6').remove()
            // $('.first-page').show()
            // $(".second-page").hide()
            // this.bindEvent()
            // this.shareEvent()
            // $("body").css('visibility','visible');
        }
    },
    swiperEvent:function () {
        var self = this;
        this.mySwiper =  new swiper ('.swiper-container', {
            direction : 'vertical',
            longSwipesRatio : 0.1,
            lazyLoading : true,
            lazyLoadingInPrevNext : true,
            iOSEdgeSwipeDetection:true,
            longSwipes:false,
            resistanceRatio:0,
            // initialSlide:6,
            onInit:function(swiper){
                self.animation(swiper.activeIndex)
            },
            onTransitionEnd:function(swiper){
                self.animation(swiper.activeIndex)
            }
        });
    },
    // 绑定事件
    bindEvent:function () {
        var self =this
        $(".select-wrapper").on('click','li',function () {
            if($(this).hasClass('active')) return
            $(".select-wrapper").find('li').removeClass('active')
            $(this).addClass('active')
            self.myTagIndex = $(this).data('index')
        })

        $("#ceshi").on('touchstart',function () {
            $(this).addClass('active')
        }).on('touchend',function (event) {
            $(this).removeClass('active')
            event.preventDefault()
            if(self.myTagIndex === null){
                var tip = new BubbleTip({
                    msg: '请选择标签',
                    buttonText: ['确定'],
                    callback: function (index) {
                    }
                });
                tip.show();
            }else{
                $("#startCeshi").text('测算中')
                $(this).find('#donghua').css({
                    'display':'inline-block'
                })
                setTimeout(function () {
                    if(native.isApp){
                        self.claculate()
                    }else if(self.userId){
                        self.financial = 10 + Math.ceil(90 * Math.random()) + '万'
                        $("#myTagText").text(self.tagArr[self.myTagIndex])
                        $("#futureMoney").text(self.financial)
                        self.flagImageShow(self.tagArr[self.myTagIndex])
                        self.shareButtonTime = 1;
                        if(self.shareButtonTime === 0){
                            $("#shareButton").text('我也要测算2018年的财运')
                        }else if(self.shareButtonTime === 1){
                            $("#goLogin").show()
                            $("#shareButton").text('立即注册猎财大师')
                        }
                        $(".first-page").hide()
                        $(".second-page").show()
                        var len = $(".swiper-wrapper").children('.swiper-slide').length;
                        // 第六屏展示
                        self.animation(len -1)
                    }else if(self.token){
                        self.claculate()
                    }
                },2000)
            }
        })
    },
    // 测算结果
    calculateResult:function () {
        var self = this;
        var data = {};
        if(self.userId){
            data = {
                userId:self.userId
            }
        }else if(self.token){
            data = {
                token:self.token
            }
        }
        var calculateResultService = new service();
        calculateResultService.api = 'activity/yearStatistics/financial/calculation';
        calculateResultService.isShowLoading = true;
        calculateResultService.isNeedToken = true
        calculateResultService.data = data;
        calculateResultService.success = function (result) {
            $("#myTagText").text(result.flag)
            $("#futureMoney").text(result.financial)
            self.flagImageShow(result.flag)
            if(result.hasCalculated){
                $('.first-page').hide()
                $(".second-page").show()
            }else {
                $('.first-page').show()
                $(".second-page").hide()
            }
            self.shareEvent(result)
            if(comm.isWebChat()){
              self.wechatShareEvent(result)
            }
        };
        calculateResultService.send();
    },
    // 财运测算
    claculate:function () {
        var self = this
        var claculateService = new service();
        claculateService.api = 'activity/yearStatistics/financial/calculate';
        claculateService.isShowLoading = true;
        claculateService.isNeedToken = true
        claculateService.data = {
            flag:self.tagArr[self.myTagIndex],
            token:self.token
        }
        claculateService.success = function (result) {
            if(native.isApp){
                $("#myTagText").text(result.flag)
                $("#futureMoney").text(result.financial)
                self.flagImageShow(result.flag)
                $(".first-page").hide()
                $(".second-page").show()
                var len = $(".swiper-wrapper").children('.swiper-slide').length;
                // 第六屏展示
                self.animation(len -1)
                self.shareEvent(result)
            }else {
                $("#myTagText").text(result.flag)
                $("#futureMoney").text(result.financial)
                self.flagImageShow(result.flag)
                $(".first-page").hide()
                $(".second-page").show()
                var len = $(".swiper-wrapper").children('.swiper-slide').length;
                // 第六屏展示
                self.animation(len -1)
                self.shareEvent(result)
            }

        };
        claculateService.send();
    },
    shareEvent:function (result) {
        var self = this;
        if(!native.isApp && !comm.isWebChat() && self.token){
            $(".share-button").hide()
        }

        $("#shareButton").off('touchstart')
        $("#shareButton").off('touchend')

        // 分享按钮
        $("#shareButton").on('touchstart',function () {
            $(this).addClass('active')
        }).on('touchend',function (event) {
            event.preventDefault()
            $(this).removeClass('active')
            if(native.isApp){
                self.shareToWechat(result)
            }else{
                if(self.userId){
                    if(self.shareButtonTime === 0){
                        $(".first-page").show()
                        $(".second-page").hide()
                    }else if(self.shareButtonTime === 1){
                        self.goRegister();
                    }
                }else if(self.token){
                    if(comm.isWebChat()){
                        share.show()
                    }
                }
            }
        })
    },
    flagImageShow:function (flag) {
        // 隐藏图片
        $(".tag-wrapper").children().not('.gold').attr('src',"").hide();
        for(var i=0;i<this.tagArr.length;i++){
            var thisImg =$(".tag-wrapper").children().eq(i);
            if(flag === this.tagArr[i]){
                thisImg.attr('src',thisImg.data('src')).show()
            }
        }
    },
    animation:function (activeIndex) {
        $(".animation").removeClass("active")
        $(".swiper-wrapper").children().eq(activeIndex).find('.animation').addClass("active")
    },
    drawLine:function (result) {
        var monthProfitList = result.monthProfitList
        var dataset = [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0]]
        for(var i=0;i<monthProfitList.length;i++){
            dataset[i][1] = parseInt(monthProfitList[i].totalAmount)
        }
        var lineChart = $("#lineChart")
        var width = lineChart.width()
        var height = lineChart.height()
        var padding = {left:(.18 * width),right:(.051 * width),top:(.13 * height),bottom:(.13 * height)}
        var min = d3.min(dataset,function (d) {
            return d[1]
        })
        var max = d3.max(dataset,function (d) {
            return d[1]
        })
        var svg = d3.select('#lineChart').append('svg').attr('width',width).attr('height',height)
        var xScale = d3.scaleLinear().domain([1,12]).range([0,width - padding.left - padding.right])
        var yScale = d3.scaleLinear().domain([min,max]).range([height - padding.top - padding.bottom,0])
        var xAxis = d3.axisBottom().scale(xScale).ticks(12)
        var yAxis = d3.axisLeft().scale(yScale).ticks(10)
        //定义横轴网格线
        var yInner = d3.axisLeft().scale(yScale).ticks(8).tickSize(-(width - padding.left - padding.right),0,0)
        // y网格
        svg.append('g').call(yInner).attr('class','yInnerLine').attr('transform','translate('+padding.left+','+padding.top+')').selectAll("text").text("")
        // x轴
        svg.append('g').attr('class','xAxis').call(xAxis).attr('transform','translate('+padding.left+','+(height - padding.bottom)+')')
        // y轴
        svg.append('g').attr('class','yAxis').call(yAxis).attr('transform','translate('+padding.left+','+padding.top+')')
        var linePath = d3.line().x(function (d) {
            return xScale(d[0])
        }).y(function (d) {
           return yScale(d[1])
        })
        // 折线
        svg.append('g')
            .append('path')
            .attr('class','line-path')
            .attr('transform','translate('+padding.left+','+padding.top+')')
            .attr('d',linePath(dataset))
            .attr('fill','none')
            .attr('stroke-width',2)
            .attr('stroke','#ffca86')
        // 文字
        svg.append('g').append('text').attr('class','yText').text('收益(元)').attr('text-anchor','middle').attr('transform','translate('+(padding.left - .04 * width)+','+padding.top+')').attr('dy','-1em')
    },
    //获取用户信息
    getUserInfo:function(){
        var self = this;
        var userInfoService = new service();
        userInfoService.api = api.getUserInfo;
        userInfoService.isNeedToken = true;
        userInfoService.data = {
            token: self.token
        }
        userInfoService.success = function (result) {
            self.mobile = result.mobile;
            self.userName = result.userName;
            if(native.isApp){
                self.appUserId = result.userId;
            }else if(comm.isWebChat()){
                self.wechatUserId = result.userId
                self.calculateResult();
            }
        };
        userInfoService.send();
    },
    // 个人业绩
    personAchievement:function () {
        var self = this;
        var data = {};
        if(self.userId){
            data = {
                userId:self.userId
            }
        }else if(self.token){
            data = {
                token:self.token
            }
        }
        var personAchievementService = new service();
        personAchievementService.api = 'activity/yearStatistics/personAchievement';
        personAchievementService.isShowLoading = true;
        personAchievementService.isNeedToken = true
        personAchievementService.data = data;
        personAchievementService.success = function (result) {
            // 第二屏
            // 年度总收入
            if(parseInt(result.totalProfit)){
                $("#totalProfit").text(parseInt(result.totalProfit))
                // 最大收入月份
                if(result.maxFeeMonth){
                    $("#maxFeeMonthWrapper").css('display','inline')
                    $("#maxFeeMonth").text(result.maxFeeMonth.split("-")[1])
                }
                // 折线图
                self.drawLine(result)
                // 底部提示
                $("#twoFooter").text(result.personAchiDescription)
            }else{
                $(".slide2").remove()
                self.mySwiper.updateSlidesSize()
            }

            // 第三屏
            if(result.saleOrgNumber == 0 && parseInt(result.saleAmount) == 0 && parseInt(result.saleFundAmount) == 0 &&  result.saleInsuNumber == 0){
                $(".slide3").remove()
                self.mySwiper.updateSlidesSize()
            }else{
                // 网贷购买个数
                $("#buyOrg").text(result.saleOrgNumber)
                // 网贷购买数额
                $("#buyMoney").text(parseInt(result.saleAmount))
                // 基金购买数额
                $("#buyFund").text(parseInt(result.saleFundAmount))
                // 保险购买数额
                $("#buyInsurance").text(result.saleInsuNumber)
            }

            /*第四屏*/
            // 年度总收入
            $("#teamMoney").text(parseInt(result.totalProfit))

            /*首屏*/
            // 注册时间
            $("#registerTime").text(self.dateFormat(result.registerTime))
            // 首次投资时间
            if(result.firstInvestTime){
                $("#buyTimeWrapper").css('display','inline')
                $("#buyTime").text(self.dateFormat(result.firstInvestTime))
            }
            // 投资邀请客户时间
            if(result.hadInvestorTime){
                $("#firstInviteClientWrapper").css('display','inline')
                $("#firstInviteClient").text(self.dateFormat(result.hadInvestorTime))
            }
            // 首次拥有团队时间
            if(result.hadTeamTime){
                $("#firtHasTeamWrapper").css('display','inline')
                $("#firtHasTeam").text(self.dateFormat(result.hadTeamTime))
            }
            $("body").css('visibility','visible')
        };
        personAchievementService.send();
    },
    // 团队成绩
    teamAchievement:function () {
        var self = this;
        var data = {};
        if(self.userId){
            data = {
                userId:self.userId
            }
        }else if(self.token){
            data = {
                token:self.token
            }
        }
        var teamAchievementService = new service();
        teamAchievementService.api = 'activity/yearStatistics/teamAchievement';
        teamAchievementService.isShowLoading = true;
        teamAchievementService.isNeedToken = true
        teamAchievementService.data = data;
        teamAchievementService.success = function (result) {
            // 第四屏
            if(parseInt(result.investAmount) <= 0){
                $(".slide4").remove()
                self.mySwiper.updateSlidesSize()
            }else{
                // 团队成员
                $("#teamPerson").text(result.teamNumber)
                // 网贷投资额
                $("#teamP2PMoney").text(parseInt(result.investAmount))
                // 基金投资额
                $("#teamFund").text(parseInt(result.fundAmount))
                // 保险投资单数
                $("#teamInsurance").text(result.insuranceNumber)
                // 底部描述
                $("#fourFooter").text(result.teamAchiDescription)
            }

            // 第五屏
            if(result.maxProfitUserName){
                // 最佳队友名字
                $("#bestName").text(result.maxProfitUserName)
                // 最佳队友头像
                if(result.maxProfitUserHeadImg){
                    $("#bestIcon").attr('src',comm.getServerImg(result.maxProfitUserHeadImg))
                }else{
                    $("#bestIcon").attr('src','/static/images/head-portrait.jpg')
                }
                self.drawPie(result)
                self.drawList(result)
            }else{
                $(".slide5").remove()
                self.mySwiper.updateSlidesSize()
            }
        };
        teamAchievementService.send();
    },
    //猎财成绩
    liecaiAchievement:function () {
        var self = this;
        var liecaiAchievementService = new service();
        liecaiAchievementService.api = 'activity/yearStatistics/liecaiAchievement';
        liecaiAchievementService.isShowLoading = true;
        liecaiAchievementService.isNeedToken = true;
        liecaiAchievementService.success = function (result) {
            // 累计发放佣金
            $("#liecaiReward").text(parseInt(result.commissionAmount))
            // 理财师人数
            $("#liecaiPerson").text(result.activeUserNumber)
            // 截止日期
            $("#yearEnd").text(self.dateFormat(result.deadTime))
        };
        liecaiAchievementService.send();
    },
    drawPie:function (result) {
        var width = $("#pieChart").width()
        var height = $("#pieChart").height()
        var oriData = result.investingStatisticList
        // 初始化一个svg元素
        var svg = d3.select("#pieChart")
            .append("svg") // append 返回具体某个元素 这里返回svg
            .attr("width", width)
            .attr("height", height)
        var colors = function(s) {
            return s.match(/.{6}/g).map(function(x) {
                return "#" + x;
            });
        };
        var c10 = colors("feac47ea682ebb285589277d954ad66449d6484b90205bbc4d8ecf");
        // 准备一个布局，此布局可根据原始数据计算出一段弧的开始和结束角度
        var pie = d3.pie().value(function(d){return parseInt(d.investAmt)}).sort(null);

        // 将原始数据经过布局转换
        var drawData = pie(oriData);
        // 根据画布大小算一个合适的半径吧
        var radius = width * .95  / 2
        // 准备一个弧生成器，用于根据角度生产弧路径
        var arc = d3.arc()
            .innerRadius(.3*width)
            .outerRadius(radius)

        // 设定颜色比例尺，对于饼图来说，此比例尺的作用是根据饼上的某一节的序号得到一个对应的颜色值
        var colorScale = d3.scaleOrdinal().domain(d3.range(0,oriData.length)).range(c10)

        var pathParent = svg.append('g')
            // 圆心
                .attr('transform','translate('+width/2+','+height/2+')')
                .selectAll('path')
                .data(drawData)
                .enter()
                .append('path')
                .attr("stroke", "black")
                 .attr("stroke-width", "0")
                .attr('fill',function(d){return colorScale(d.index)})
                .attr('d',function(d){return arc(d)}) // 调用弧生成器得到路径

        //画圆形
        svg.append("circle")
            .attr('transform','translate('+width/2+','+height/2+')')
            .attr("cx",0)
            .attr("cy",0)
            .attr("r",.3*width)
            .attr('fill','#ffd5cf')
            .attr("stroke", "#73251c")
            .attr("stroke-width", "2px")

        //画圆形
        svg.append("circle").attr('transform','translate('+width/2+','+height/2+')').attr("cx",0).attr("cy",0).attr("r",radius).attr('fill','none').attr("stroke", "#73251c").attr("stroke-width", "2px")
    },
    drawList:function (result) {
        var colors = function(s) {
            return s.match(/.{6}/g).map(function(x) {
                return "#" + x;
            });
        };
        var c10 = colors("feac47ea682ebb285589277d954ad66449d6484b90205bbc4d8ecf");
        var htmlStr = ""
        result.investingStatisticList.forEach(function (item,index) {
            htmlStr += '<li><span style="background-color: '+c10[index]+'"></span><p>'+item.orgName +' ' + item.totalPercent+'%</p></li>'
        })
        $("#orgList").html(htmlStr)
    },
    shareToWechat:function (result) {
        var SHARE_URL = "";
        if(this.userName){
            SHARE_URL = publicConfig.leicaiDomain + 'pages/activities/annualAccount.html?userId='+this.appUserId+'&mobile='+this.mobile+'&name=' + this.userName
        }else{
            SHARE_URL = publicConfig.leicaiDomain + 'pages/activities/annualAccount.html?userId='+this.appUserId+'&mobile='+this.mobile
        }
        var appShareData = {
            shareTitle: '猎财大师年度账单', // 分享标题
            shareDesc: '我在2018年的标签为“'+result.flag+'”,在2018年将会赚得'+result.financial+'元,你也来测测吧',
            shareLink: SHARE_URL,
            shareImgurl: 'e934c9c9b54badc68dc2a8c647a7c154' // 分享图标
        }
        native.appShare(appShareData);
    },
    /* 微信*/
    // 跳转到注册页面
    goRegister:function () {
        var self = this;
        if(this.userId){
            var query = comm.getQueryString()
            var mobile = query.mobile || ""
            var name = query.name || ""
            var REGISTER_URL = ""
            if(name){
                REGISTER_URL = publicConfig.leicaiDomain + 'pages/user/inviteRegister.html?recommendCode=' + mobile + '&name=' + encodeURIComponent(name)
            }else{
                REGISTER_URL = publicConfig.leicaiDomain + 'pages/user/inviteRegister.html?recommendCode=' + mobile
            }
            location.href = REGISTER_URL
        }else if(this.token){
            share.show()
        }

    },
    /* normal */
    dateFormat:function (date) {
        var date = new Date(date)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        return year + '年' + month + '月' + day + '日'
    },
    //微信分享
    wechatShareEvent:function(result){
        var SHARE_URL = "";
        if(this.userName){
            SHARE_URL = publicConfig.leicaiDomain + 'pages/activities/annualAccount.html?userId='+this.wechatUserId+'&mobile='+this.mobile
        }else{
            SHARE_URL = publicConfig.leicaiDomain + 'pages/activities/annualAccount.html?userId='+this.wechatUserId+'&mobile='+this.mobile
        }
        // 微信分享信息
        var wechatShareData = {
            title  : '猎财大师年度账单', // 分享标题
            desc   : '我在2018年的标签为“'+result.flag+'”,在2018年将会赚得'+result.financial+'元,你也来测测吧', // 分享描述
            link   : SHARE_URL, // 分享链接
            imgUrl : publicConfig.imageUrl + 'e934c9c9b54badc68dc2a8c647a7c154?f=png' // 分享图标
        };

        new wechatShare(wechatShareData);
    }
};

evt.init();
