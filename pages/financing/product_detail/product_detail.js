/**
 * @require style.css
 */
var $ = require("zepto");
var comm = require('modules/common/common');
var Render = require('modules/common/render');
var CountDown = require('modules/widget/saleCountdown/saleCountdown');
var native = require('modules/common/native');
var service   = require('modules/common/service');
var api = require('modules/api/api');

var financing = {
    init: function () {
        var self = this;
        var query = comm.getQueryString();
        this.orgInfoResponse = {};    
        this.isBindCard = false;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token = data || "";
                self.productId = query.productId;
                self.renderData();
                self.bindEvent();
                self.getFooterPosition();
            });
        } else {
            self.token = sessionStorage.getItem('__token__')
            self.productId = query.productId || '93FEF96BD042417797D538C78E880D34';
            self.bindEvent();
            self.renderData();
            // window.location.href = "./../download/download.html"
        }
    },
    bindEvent: function () {
        var isOpen = false;
        $('.main').on('click','#openIcon',function(){
            if(isOpen){
                $("#productDesc").height(96);
                $("#actualImage").attr('src',$("#openImage").data('src'));
                isOpen = false;
            }else{
                $("#productDesc").height("")
                $("#actualImage").attr('src',$("#foldImage").data('src'));
                isOpen = true;
            }

        })

        // 佣金计算
        $('.main').on('click', '#calculatorBox', function () {
            native.action('getApplhlcsCommissionCalc');
        });

        //点击平台详情块
        $(".main").on('click', '#orgInfo', function () {
            if( $(this).data('orgnumber')){
                native.action('getAppPlatfromDetail', {orgNo: $(this).data('orgnumber')});
            }
        });

        $(".main").on('click','#redPacketContainer',function(){
            native.action('tokenExpired')
        })
    },
    //获取底部footer高度
    getFooterPosition: function () {
        var _offset = $('.footer').offset();
        var _left = Math.ceil(_offset.left);
        var _top = Math.ceil(_offset.top);
        var _width = Math.ceil(_offset.width);
        var _height = Math.ceil(_offset.height);
        var jsonData = {
            left: _left,
            top: _top,
            width: _width,
            height: _height
        }
        try {
            native.getPositionCoordinate(jsonData)
        } catch (err) {
        }
    },
    gotoToobei: function () {
        var url = publicConfig.toobeiDomain + 'pages/financing/product_detail.html?productId=' + this.productId + '&token=' + this.token;
        if(this.orgNo === 'OPEN_JIUFUQINGZHOU_WEB'){
            native.gotoWeb({
                url: url,
                orgNo: this.orgNo,
                productId: this.productId,
                orgName: this.orgName,
                orgProductUrlSkipBindType:this.orgInfoResponse.orgProductUrlSkipBindType,
                jfqzProductDetailUrl:this.jfqzProductDetailUrl,
                thirdProductId : this.thirdProductId
            })
        }else{
            native.gotoWeb({
                url: url,
                orgNo: this.orgNo,
                productId: this.productId,
                orgName: this.orgName,
                orgProductUrlSkipBindType:this.orgInfoResponse.orgProductUrlSkipBindType
            })
        }
    },
    renderData: function () {
        var self = this;
        new Render({
            ele: $('.main'),
            api: api.productDetail,
            data: {
                productId: self.productId,
                token : self.token
            },
            isShowLoading: true,
            filter: self._filter,
            callback: function (data) {
                self.orgNo = data.orgNumber;
                self.orgName = data.orgInfoResponse.orgName;
                self.orgInfoResponse.orgProductUrlSkipBindType= data.orgInfoResponse.orgProductUrlSkipBindType
                if(data.orgNumber === 'OPEN_JIUFUQINGZHOU_WEB'){
                    self.thirdProductId = data.thirdProductId
                    self.jfqzProductDetailUrl = data.jfqzProductDetailUrl
                }

                //平台详情
                if (data.orgInfoResponse) {
                    $("#platformLogo").attr('src', comm.getServerImg(data.orgInfoResponse.platformlistIco));
                }
                if(data.status == 2){
                    $("#buySelf").css('backgroundColor',"#999")
                }

                //立即购买按钮
                $("#buySelf").on('click', function () {
                    if(! (data.status == 2)){
                        if (_hmt) {
                            _hmt.push(['_trackEvent', 'link', 'click', 'C_product_details_purchase'])
                        }
                        self.gotoToobei();
                    }
                });

                if($("#productDesc").height() > 96){
                    $("#productDesc").height(96);
                    $("#openIcon").show();
                }

                if(self.token){
                    $("#youhuiquan").show()
                }else{
                    $("#redPacketContainer").show()
                }

                //产品预售 测试时间
                // data.saleStartTime =  '2018-03-07 11:03:00'
                if( data.saleStartTime.length > 0 && new Date(data.timeNow.replace(/-/g,"/")).getTime() < new Date( data.saleStartTime.replace( /-/g,'/' ) ).getTime()) {
                    $("#buySelf").off("click");
                    new CountDown({
                        ele: $('#buySelf'),
                        saleTimeStr: data.saleStartTime,
                        nowTimeStr: data.timeNow,
                        callback: function(){
                            $("#buySelf").css('backgroundColor',"#3178e8").text('立即购买');
                            //立即购买按钮
                            $("#buySelf").on('click', function () {
                                if(! (data.status == 2)){
                                    if (_hmt) {
                                        _hmt.push(['_trackEvent', 'link', 'click', 'C_product_details_purchase'])
                                    }
                                    self.gotoToobei();
                                }
                            });
                        },
                        isProduce: true
                    });
                }
                self.redEnvelopeEvent(data)
                //页面显示
                $('.main').css("visibility", "visible");
                if(self.token){
                    self.getUserInfo(data)
                    self.getBindCard()
                }
            }
        });
    },
    getUserInfo:function(data){
        var self = this;
        var userInfoService = new service();
        userInfoService.isShowLoading = false;
        userInfoService.api = api.getUserInfo;
        userInfoService.isNeedToken = true;
        userInfoService.data = {
            token: self.token
        }
        userInfoService.success = function (userInfo) {
            self.getInviteRegInfo(userInfo,data)
        };
        userInfoService.send();
    },
    // 判断是否绑卡
    getBindCard(){
        var self = this;
        var getBindCardService = new service();
        getBindCardService.api = api.personAuthenticate;
        getBindCardService.data = {
            token: self.token
        };
        getBindCardService.success = function (result) {
            self.isBindCard = result.bundBankcard;
        };
        getBindCardService.send();
    },
    // 获取用户注册信息
    getInviteRegInfo : function(userInfo,response){
        var self = this;
        var getInviteRegInfoService = new service();
        getInviteRegInfoService.isShowLoading = false;
        getInviteRegInfoService.api = api.inviteRegInfo;
        getInviteRegInfoService.data = {
            mobile:userInfo.mobile
        }
        getInviteRegInfoService.success = function(result){
            if(native.isApp){
                var shareLink = (userInfo.userName && self.isBindCard) ?publicConfig.liecaiUrl + '/product/detail?productId='+ response.productId+"&recommendCode="+userInfo.mobile+"&name=" + encodeURIComponent(userInfo.userName) : publicConfig.liecaiUrl + '/product/detail?productId='+ response.productId+"&recommendCode="+result.mobile;

                var shareData = {
                    shareDesc:'我已使用猎财大师'+result.regTime+'天，猎财严选网贷平台，分散投资值得信赖。',
                    shareImgurl:comm.getServerImg('dfa3e35be331f6ec67566130f67820b9'),
                    shareLink:shareLink,
                    shareTitle:'送你一个收益'+response.flowMaxRate+'%的理财产品，额外加息'+response.feeRatio+'%'
                }
                native.action("getSharedContent",shareData)
            }
        }
        getInviteRegInfoService.send();
    },

    _filter: function (data) {
        var investQuota = 10000;//投资额度
        var daysPerYear = 360;//一年投资天数
        var percent = 0; //进度百分比(不加%)
        var investIncome = 0;
        data.virtualProduct = "";
        data.commission = comm.toDecimal((investQuota * parseFloat(data.feeRatio)/ 100 * data.deadLineMinValue / daysPerYear))
        investIncome = comm.toDecimal((investQuota * data.flowMinRate/ 100 * data.deadLineMinValue / daysPerYear))
        data.allIncome = comm.toDecimal(parseFloat(data.commission) + parseFloat(investIncome));
        data.feeRatio = data.feeRatio.toFixed(2);
        data.orgLevel = data.orgInfoResponse.orgLevel;
        data.orgAdvantage =data.orgInfoResponse.orgAdvantage;

        data.buttonText = '投1万收益'+data.allIncome+'元'

        //产品年化收益
        if (data.isFlow == "1") {
            //年化收益
            data.yearRate = data.flowMinRate.toFixed(2);
        } else {
            data.yearRate = data.flowMinRate.toFixed(2) + '~' + data.flowMaxRate.toFixed(2);
        }

        var arr = data.deadLineValueText.split(',');
        //固定期限
        if (arr.length == 2) {
            data.deadLineText = arr[0] + arr[1];
        }
        //浮动期限
        if (arr.length == 4) {
            if (arr[1] == arr[3]) arr[1] = "";
            data.deadLineText = arr[0] + arr[1] + '~' + arr[2] + arr[3];
        }

        //是否显示产品销售进度
        if (data.isHaveProgress == "0") {
            //显示剩余额度(默认)
            data.isShowResidualAmount = '';
            data.residualAmount = (data.buyTotalMoney - data.buyedTotalMoney);
            data.residualAmount = comm.numberTransform(data.residualAmount)
            percent = parseInt(data.buyedTotalMoney / data.buyTotalMoney * 100);
            //产品购买占比
            if (data.residualAmount < 0) {
                data.residualAmount = 0;
                percent = 100;
            } else {
                data.buyedTotalMoney = data.buyedTotalMoney || 0;
                data.buyTotalMoney = data.buyTotalMoney || 1;
            }
            data.isShowProgress = "block";//显示产品购买占比
        } else {
            data.virtualProduct = 'none';//虚拟标，隐藏 剩余额度 、购买人数、产品总额
            data.isShowProgress = "hidden";//不显示产品购买占比
        }
        //产品售罄
        if (data.status == '2') {
            data.isShowProgress = 'block';
            percent = 100;
            data.buttonText = '已售罄';
        }
        data.percentage = percent+'%';
        if(percent <= 8){
            data.textPercentage = '0';
            data.textTransform = '.1rem';
        }else if(percent > 8 && percent <=85){
            data.textPercentage = data.percentage;
            data.textTransform = '-0.26496rem';
        }else if(percent >=85){
            data.textPercentage = '85%';
            data.textTransform = '-0.26496rem';
        }
        //判断是否是新手标
        if(data.ifRookie == 1){
            data.isNewerClass="block";
        }else if(data.ifRookie == 2){
            data.isNewerClass="";
        }
        //可赎回可转让
        data.isRedemptionClass = 'block'
        if(data.isRedemption == 0){
            data.isRedemptionClass = "";
        }else if(data.isRedemption == 1){
            data.isRedemptionText = data.redemptionTime+'天后可赎回';
        }else if(data.isRedemption == 2){
            data.isRedemptionText = data.assignmentTime+'天后可转让';  
        }else if(data.isRedemption == 3){
            data.isRedemptionText = data.redemptionTime+'天后可赎回' + data.assignmentTime+'天后可转让';  
        }
        return data;
    },
    redEnvelopeEvent:function(data){
        var _result = data;
        if(this.token){
            if(_result.couldUseRedPacketCounts || _result.couldUsePersonAddfeeTicketCounts){
                // 优惠券数目
                var youhuiquanNum = _result.couldUseRedPacketCounts*1 + (_result.couldUsePersonAddfeeTicketCounts*1 || 0)
                $("#youhuiquanNum").text(youhuiquanNum)
                $("#youhuiquan").on('click',function(){
                    var iosParams = 'CanUsedRedPacketViewController,nil,' + _result.deadLineMinValue + ',' + _result.orgInfoResponse.orgFeeType + ',' + _result.orgInfoResponse.orgNo + ',' + _result.productId + ',2'
                    var iosParams2 = 'CanUsedRedPacketViewController,nil,' + _result.deadLineMinValue + ',' + _result.orgInfoResponse.orgFeeType + ',' + _result.orgInfoResponse.orgNo + ',' + _result.productId + ',2,'+ (_result.couldUseRedPacketCounts || 0) + ',' + (_result.couldUsePersonAddfeeTicketCounts || 0);
                    var androidParams = _result.deadLineMinValue+','+_result.orgInfoResponse.orgFeeType+','+_result.orgInfoResponse.orgNo+','+_result.productId+',2,'+ (_result.couldUseRedPacketCounts || 0) + ',' + (_result.couldUsePersonAddfeeTicketCounts || 0)
                    var data = {
                        android:{
                            name:'AvailableRedpacketActivity',
                            paramsKey:'deadline,model,patform,productId,type,redPacketNum,addFeeNum',
                            params:androidParams
                        },
                        ios:{
                            name:'CanUsedRedPacketViewController',
                            method:'initWithNibName:bundle:deadLine:model:platform:productId:type:',
                            params:iosParams
                        }
                    }

                    // 新老版本兼容性处理
                    var data2 = {
                        android:{
                            name:'AvailableRedpacketActivity',
                            paramsKey:'deadline,model,patform,productId,type,redPacketNum,addFeeNum',
                            params:androidParams
                        },
                        ios:{
                            name:'CanUsedRedPacketViewController',
                            method:'initWithNibName:bundle:deadLine:model:platform:productId:type:redPacketNum:addFeeNum:',
                            params:iosParams2
                        }
                    }
                    if(comm.isIOS()){
                        native.skipAppPage(data)
                        setTimeout(function(){
                            native.skipAppPage(data2)
                        },200)
                    }else if(comm.isAndroid()){
                        native.skipAppPage(data)
                    }
                })
            }else{
                $("#youhuiquan").hide()
            }
        }
    }
};

financing.init();
