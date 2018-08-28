/**
* @require style.css
 *
*/
var $ = require("zepto");
var native = require('modules/common/native');
var Render = require('modules/common/render');
var api = require('modules/api/api');
var comm = require('modules/common/common');
var Service = require('modules/common/service');
var template = require('modules/common/template');

var evt = {
    init: function () {
        var self = this;
        this.mytimer = null;
        this.rankTimer = null;
        this.isBindCard = false;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token = data || "";
                for(var i=0;i<$(".link").length;i++){
                    $(".link").eq(i).attr('href',$(".link").eq(i).attr('href') + '?isApp=liecai')
                }
                self.bindEvent();
                if(self.token){
                    self.getUserInfo();
                    self.getBindCard();
                }else{
                    $("#shareBtn").on('click',function(){
                        native.action('tokenExpired')
                    })
                }
            });
        } else {
            self.token = sessionStorage.getItem('__token__');
            self.bindEvent();
            if(this.token){
                this.getUserInfo();
                this.getBindCard();
            }else{
                $("#shareBtn").on('click',function(){
                    native.action('tokenExpired')
                })
            }
        }
        this.getRankList()
        this.getFeeInfo()
    },
    showTopRightText:function(){
        native.action('removeLocalSharedBtn');
        native.action("showTopRightText",{
            rightText : '邀请客户',
            url:publicConfig.static + 'pages/guide/clientInvitation.html'
        })
    },
    addNavRightBtn:function(){
        native.action("addNaviRightBtn",{
            title:"邀请客户",
            jsMethod:"skipInviteClient"
        })
    },
    bindEvent: function () {
        var self = this;

        $("#tabWrapper").on('click','li',function(){
            if($(this).hasClass('active')){
                return;
            }else {
                $("#tabWrapper").children('li').removeClass('active')
                $(this).addClass('active')
                $("#tabContent").children('li').hide()
                $("#tabContent").children('li').eq($(this).index()).show()
            }
        })

        var preMonth = comm.getPreMonth()
        $("#preMonth").text(preMonth)
        //跳转到收益排行榜页面
        $("#leicaiRank").on('click',function(){
            var data = {
                android:{
                    name:'RankLiecaiActivity',
                    paramsKey:'month',
                    params:preMonth
                },
                ios:{
                    name:'_TtC16FinancialManager24ProfitRankViewController',
                    method:'initWithNibName:bundle:profitMonth:',
                    params:'ProfitRankViewController,nil,'+preMonth
                }
            }
            native.skipAppPage(data)
        })
    },
    //获取用户信息
    getUserInfo:function(){
        var self = this;
        var userInfoService = new Service();
        userInfoService.api = api.getUserInfo;
        userInfoService.data = {
            token: self.token
        };
        userInfoService.success = function (result) {
            self.recommendCode = result.mobile;
            self.name = result.userName;
            self.userId = result.userId;
            $("#shareBtn").on('click',function(){
                self.appShareRegEvent();
            })
        };
        userInfoService.send();
    },
    getRankList:function(){
        var self = this;
        var oResult = [];
        var renderService = new Service();
        renderService.api = api.monthIncome;
        renderService.data = {
            pageSize:10,
            pageIndex:1
        };
        renderService.success = function (result) {
            oResult = oResult.concat(result.datas)
            var renderService2 = new Service();
            renderService2.api = api.monthIncome;
            renderService2.data = {
                pageSize:10,
                pageIndex:2
            };
            renderService2.success = function (result) {
                oResult = oResult.concat(result.datas)
                self.madeHtml(oResult);
                self.rankRoll()
            }
            renderService2.send();
        }
        renderService.send();
    },
    filter: function (arr) {
        arr.forEach(function(item,index){
            if(item.rank == 1){
                item.rank = "<img src="+$("#firstIcon").data('src')+" />"
            }else if(item.rank == 2){
                item.rank = "<img src="+$("#secondIcon").data('src')+" />"
            }else if(item.rank == 3){
                item.rank = "<img src="+$("#thirdIcon").data('src')+" />"
            }
        })
        return arr;
    },
    // 生成html
    madeHtml: function (result) {
        var data = result;
        var temStr = $("#list").html();

        if (this.filter) {  // 数据渲染前处理
            data = this.filter(data);
        }
        $("#list").html(template.getHtml(temStr, data)).show();
    },
    /*邀请理财师佣金奖励信息-4.5.4*/
    getFeeInfo:function(){
        var self = this;
        var feeInfoService = new Service();
        feeInfoService.api = api.feeInfo;
        feeInfoService.success = function (result) {
            $("#commissionAmount").text(result.commissionAmount)
            $("#lcsNumber").text(result.lcsNumber)
            var liHtml = ""
            result.feeList.forEach(function(item){
                liHtml += '<li>' +item.timeString +' ' + item.mobile + '获得了￥'+ item.feeAmount +'佣金奖励</li>'
            })
            $("#firstScroll").html(liHtml)
            self.roll();
        };
        feeInfoService.send();
    },
    // 判断是否绑卡
    getBindCard(){
        var self = this;
        var getBindCardService = new Service();
        getBindCardService.api = api.personAuthenticate;
        getBindCardService.data = {
            token: self.token
        };
        getBindCardService.success = function (result) {
            self.isBindCard = result.bundBankcard;
        };
        getBindCardService.send();
    },
    appShareRegEvent: function () {
        var REGISTER_URL = ""
        if(this.name && this.isBindCard){
            REGISTER_URL = publicConfig.leicaiDomain + 'pages/user/register_packet.html?recommendCode=' + this.recommendCode + '&name=' + encodeURIComponent(this.name)
        }else{
            REGISTER_URL = publicConfig.leicaiDomain + 'pages/user/register_packet.html?recommendCode=' + this.recommendCode
        }
        var appShareData = {
            shareTitle: '我用貅比特很久了，送你528元红包，速领！', // 分享标题
            shareDesc: '理财我推荐安全靠谱的貅比特，我已经用了很久了，邀你一起来赚钱,速来！',
            shareLink: REGISTER_URL,
            shareImgurl: 'dfa3e35be331f6ec67566130f67820b9' // 分享图标
        }
        native.appShare(appShareData);
    },
    roll:function(){
        var self = this;
        clearInterval(this.mytimer)
        var area =document.getElementById('scrollInner');
        var record1 = document.getElementById('firstScroll');
        var itemHeight = $('#firstScroll').children().eq(0).height();
        var record2 = document.getElementById('secondScroll');
        record2.innerHTML=record1.innerHTML;         
        var time = 50;
        this.mytimer=setInterval(scrollUp,time);
        function scrollUp(){
            if(area.scrollTop % itemHeight == 0 ){
                clearInterval(self.mytimer);
                setTimeout(function(){
                    self.mytimer=setInterval(scrollUp,time)
                },3000)
            }
            if(area.scrollTop>=record1.offsetHeight){
                area.scrollTop=0;
            }else{
                area.scrollTop++
            }
        }
    },
    rankRoll:function(){
        var self = this;
        clearInterval(this.rankTimer)
        var area =document.getElementById('list');
        var itemHeight = $('#list').children().eq(0).height();
        var time = 50;
        this.rankTimer=setInterval(scrollUp,time);
        function scrollUp(){
            if(area.scrollTop>=itemHeight){
                $('#list').children('.list-item').eq(0).appendTo($("#list"))
                area.scrollTop=0;
                clearInterval(self.rankTimer);
                setTimeout(function(){
                    self.rankTimer=setInterval(scrollUp,time)
                },3000)
            }else{
                area.scrollTop++
            }
        }
    }
};

evt.init();