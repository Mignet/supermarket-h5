/**
* @require buyDetail.less
 *
*/
var $ = require("zepto");
var native = require('modules/common/native');
var Render = require('modules/common/render')
var api = require('modules/api/api');
var comm = require('modules/common/common')
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');
var Box = require('modules/widget/tipBox/tipBox')
var service     = require('modules/common/service');

var evt = {
    init: function () {
        var self = this;
        var query = comm.getQueryString();
        this.canJumpNative = query.canJumpNative || '';
        if(this.canJumpNative == 1){
            $("#canJumpNative").show();
        }
        if(query.message && query.message == 'insurance'){
            this.isInsurance = true
        }else{
            this.isInsurance = false;
        }
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token = data || "";
                self.investId = query.investId || "";
                for(var i=0;i<$(".link").length;i++){
                    $(".link").eq(i).attr('href',$(".link").eq(i).attr('href') + '?isApp=liecai')
                }
                if(query.message && query.message == 'insurance'){
                    $(".insuranceHook").show()
                    $('.investHook').hide()
                    self.renderInsurance()
                }else{
                    $(".investHook").show()
                    $('.insuranceHook').hide()
                    self.render()
                }
            });
        } else {
            this.token = comm.getCookie('__token__') || "";
            self.investId = query.investId || "03f44b7d80374b8a8bfc7b4f3b884656";
            if(query.message && query.message == 'insurance'){
                $(".insuranceHook").show()
                $('.investHook').hide()
                this.renderInsurance()
            }else{
                $(".investHook").show()
                $('.insuranceHook').hide()
                this.render()
            }
        }
    },
    render:function(){
        var self = this;
        new Render({
            ele:$("#wraperContainer"),
            api:api.investCalendarDetail,
            data:{
                token:self.token,
                investId:self.investId,
            },
            isShowLoading:false,
            filter:self._filter,
            callback:function(data){
                if(data.userType == 0){
                    document.title = "投资详情"
                    $("#buyMoney").text('投资金额：')
                    $("#buyTime").text('投资时间：')
                }else if(data.userType == 1 || data.userType == 2 || data.userType == 3){
                    document.title = '出单详情'
                }

                if(data.isFixedDeadline == 1){ //固定期限
                    $(".fixPart").hide()
                }else if(data.isFixedDeadline == 2){ // 浮动期限
                    $(".fixPart").show();
                }

                $("#setOrgReward").val(data.virtualPlatformBouns)

                $(".top-container").on('click',"#toDetail",function(){
                    if(self.canJumpNative != 1) return;
                    if(data.userType == 0){
                        self.toClientDetailPage(data.userId)
                    }else if(data.userType == 1 || data.userType == 2 || data.userType == 3){
                        self.toPlannerDetailPage(data.userId)
                    }
                })

                if(data.isSelf == 1){ // 自己
                    $("#isQiTa").hide()
                    $("#isSelf").show()
                }else if(data.isSelf == 0){
                    $("#isQiTa").show()
                    $("#isSelf").hide()
                }

                $(".orgRewardTips").on('click','i',function(){
                    var tip = new BubbleTip({
                        title: '平台奖励',
                        msg: '用于记录您在机构平台投资所获返现、抵扣、礼金、加息等奖励。',
                        buttonText: ['我知道了']
                    });
                    tip.show();
                })

                $("#totalYearRateTips").on('click','i',function(){
                    var tip = new BubbleTip({
                        title: '综合年化收益率',
                        msg: '综合年化收益率=产品累计收益(包括:投资收益+猎财佣金+猎财返现红包+平台奖励)/产品年化金额<p class="remark">备注：浮动利率产品投资收益按照最低利率计算。</p>',
                        buttonText: ['我知道了']
                    });
                    tip.show();
                })

                $("#orgRewardNum").on('input',function(e){
                    var value = $(this).val();
                    if(value.length>8){
                        value=value.slice(0,8)
                    }
                })

                $("#setOrgReward").on('click',function(){
                    if (_hmt) {
                        _hmt.push(['_trackEvent', 'link', 'click', 'W_3_1_2'])
                    }
                    var tip = new BubbleTip({
                        title: '',
                        msg: '<div class="setOrgReward-msg">金额(元):<input id="orgRewardNum" type="text" value='+$(this).text()+' class="sureFocus org-reward-num" placeholder="输入平台奖励" oninput="if(value.length>6)value=value.slice(0,6)" /></div>',
                        buttonText: ['确定'],
                        callback:function(){
                            var tip2 = new Box();
                            var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
                            var text = Math.abs($("#orgRewardNum").val());
                        　　if (!re.test(text)) {
                                tip2.show('请输入数字');
                                setTimeout(function(){
                                    window.location.reload()
                                },1000)
                        　　　　return false;
                        　　}
                            self.setOrgReward($("#orgRewardNum").val())
                        }
                    });
                    tip.show();
                })
            }
        })
    },
    setOrgReward:function(val){
        var self = this;
        var renderservice = new service();
        renderservice.api = 'personcenter/investRecord/platformBouns';
        renderservice.isShowLoading = true;
        renderservice.isNeedToken = true
        renderservice.data = {
            investId:self.investId,
            token:self.token,
            virtualPlatformBouns:parseFloat(val) || '0'
        };
        renderservice.success = function (result) {
            window.location.reload()
        };
        renderservice.error = function(msg){
            comm.alert(msg);
            setTimeout(function(){
                window.location.reload()
            },1000)
        }
        renderservice.send();
    },
    renderInsurance:function(){
        var self = this;
        new Render({
            ele:$('#wraperContainer'),
            api:'personcenter/insuranceInvestCalendarDetail',
            data:{
                token:self.token,
                investId:self.investId,
            },
            isShowLoading:true,
            filter:self._filter,
            callback:function(data){
                $("body").show();
                if(data.userType == 0){
                    document.title = "投资详情"
                }else if(data.userType == 1 || data.userType == 2 || data.userType == 3){
                    document.title = '出单详情'
                }
                if(self.isInsurance){
                    if(data.clearingStatus == 0){
                        $('#balanceProgress').show()
                    }else if(data.clearingStatus == 1){
                        $("#balanceSuccess").show()
                    }else if(data.clearingStatus == 2){
                        $("#balanceFail").show()
                    }
                }

                $(".top-container").on('click',"#toDetail",function(){
                    if(self.canJumpNative != 1) return;
                    if(data.userType == 0){
                        self.toClientDetailPage(data.userId)
                    }else if(data.userType == 1 || data.userType == 2 || data.userType == 3){
                        self.toPlannerDetailPage(data.userId)
                    }
                })

                $(".center-container").on('click',"#balanceProgress",function(){
                    var tip = new BubbleTip({
                        title: '什么是结算中状态？',
                        msg: '由于受保险机构结算方式的影响，出单佣金不能及时结算的状态，该状态时长一般：15天~45天。',
                        buttonText: ['我知道了']
                    });
                    tip.show();
                })

                $(".center-container").on('click',"#balanceFail",function(){
                    var tip = new BubbleTip({
                        title: '为什么会结算失败？',
                        msg: '一般是由于投保人在犹豫期退保，导致佣金结算失败。',
                        buttonText: ['我知道了']
                    });
                    tip.show();
                })
            }
        })
    },
    toPlannerDetailPage:function(userId){
        var data = {
            android:{
                name:'CfgMemberDetialActivity',
                paramsKey:'userId',
                params:userId
            },
            ios:{
                name:'MyCfgDetailViewController',
                method:'initWithNibName:bundle:userId:',
                params:'MyCfgDetailViewController,nil,' + userId
            }
        }
        native.skipAppPage(data)
    },
    toClientDetailPage:function(userId){
        var data = {
            android:{
                name:'CustomerMemberDetialActivity',
                paramsKey:'userId',
                params:userId
            },
            ios:{
                name:'MyCustomerDetailViewController',
                method:'initWithNibName:bundle:userId:',
                params:'MyCustomerDetailViewController,nil,' + userId
            }
        }
        native.skipAppPage(data)
    },
    _filter:function(data){
         // 用户类型文本
        var userTypeText = "";
        switch(data.userType){
            case 0 :
                userTypeText = "客户";
            break;
            case 1 :
                userTypeText = "直推";
            break;
            case 2 :
                userTypeText = "二级";
                data.userName = data.userName + '<span> 的直推理财师</span>';
            break;
            case 3 :
                userTypeText = "三级";
                data.userName = data.userName + '<span> 的二级理财师</span>';
        }
        data.userTypeText = userTypeText || "";
        data.headImage = comm.getServerImg(data.headImage);

        if(data.feeRateCalculateMsg){
            data.feeRateCalculateMsg = "("+data.feeRateCalculateMsg+")"
        }
        
        var feeRateCalculateMap = data.feeRateCalculateMap;
        var feeRateCalculateMapText = "";
        var index = 0;
        for(var key in feeRateCalculateMap){
            index ++;
            if(index === 1){
                feeRateCalculateMapText += "= ";
            }else{
                feeRateCalculateMapText += "+ ";
            }
            switch(key){
                case '1001' : 
                    feeRateCalculateMapText += '佣金';
                break;
                case '1002' : 
                    feeRateCalculateMapText += '推荐奖励';
                break;
                case '1005' : 
                    feeRateCalculateMapText += '直接管理津贴';
                break;
                case '1006' : 
                    feeRateCalculateMapText += '团队管理津贴';
                break;
                case '1011' : 
                    feeRateCalculateMapText += '基础加拥';
                break;
                case '1012' : 
                    feeRateCalculateMapText += '推荐加拥';
                break;
                case '1021' : 
                    feeRateCalculateMapText += '加佣佣金';
                break;
            }
            feeRateCalculateMapText += "<span>（"+feeRateCalculateMap[key]+"）</span><br/>"
        }
        data.feeRateCalculateMapText = feeRateCalculateMapText;
        var feeListText = "";
        if(data.feeList.length <= 1){
            data.feeListText = "";
        }else {
            for(var i=0;i<data.feeList.length;i++){
                data.feeList[i] = data.feeList[i];
            }
            feeListText = data.feeList.join("+")
            data.feeListText = " = " + feeListText;
        }

        // 浮动期产品备注
        if(data.ifPassLockDate == 0){ // 未过锁定期
            data.fixRemarkText = '当前期限按照产品最低期限（锁定期）计算；锁定期结束后，按照产品持有期计算。'
        }else if(data.ifPassLockDate == 1){ //已过锁定期
            data.fixRemarkText = "该产品为浮动期限产品，佣金计算中的产品期限/投资本金，将按照用户实际持有产品时长/投资本金每日实时计算，这里暂不做具体展示。"
        }
        var totalProductRateText = (data.investAmt * data.deadLineMinValue/360*data.flowMinRate/100 + data.investAmt * data.deadLineMinValue/360*data.productFeeRate/100 + (parseFloat(data.redpacketProfit) || 0) + (parseFloat(data.virtualPlatformBouns) || 0) )/(data.investAmt * data.deadLineMinValue/360)*100
        data.totalProductRateText = totalProductRateText.toFixed(2)

        data.redpacketProfit = data.redpacketProfit || '0.00';

        data.personAddfeeAmount = data.personAddfeeAmount || '0.00'
        return data;
    }
};

evt.init();