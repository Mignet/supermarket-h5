/**
 * @require style.css
 */

var $ = require("zepto");
var api = require('modules/api/api');
var comm = require("modules/common/common");
var native = require('modules/common/native');
var service = require('modules/common/service');
var wechatShare = require('modules/common/wechatShare');
var share       = require("modules/widget/share/share");
var BubbleTip      = require('modules/widget/bubbleTip/bubbleTip');

var TEAM = {
    A: "a",
    B: "b"
};

var nba2018 = {

    //活动数据
    data: {},

    //选择的队
    selectedTeam:{
        name: "",
        qty: 0
    },

    init : function() {
        var self = this;

        this.userId = "";
        this.mobile = "";
        this.userName = "";
        this.token = "";
        this.balance = "0.00";

        this.isSubmit = false;
        this.isLogin = false;
        this.query = comm.getQueryString();

        if(native.isApp){
            native.getAppToken(function(data){
                self.token = data || '';
                self.isLogin = !!self.token;

                self.bindEvent();
                self.getData();

                if(self.isLogin){
                    self.getUserInfo();
                }
            });
        }else{
            self.token = comm.getCookie("__token__");
            self.isLogin = !!self.token;

            self.showLoginArea();
            self.bindEvent();
            self.getData();

            if(self.isLogin){
                self.getUserInfo();
            }

            if(!self.isLogin && comm.isWebChat()){
                this.wechatShare();
            }
        }
    },

    //显示登录注册按钮
    showLoginArea: function(){
        //分享出来的页面
        if(this.query._share == 1){
            if(!this.isLogin){
                $("#js-loginArea").show();
                $("#js-investArea").hide();
            }

            $("#js-btn-tixian").val("马上去APP提现");
        }
    },

    //绑定事件
    bindEvent: function(){
        var self = this;

        $("#js-btn-tixian").on("click", function(){
            self.toTixian();
        });

        $("#js-btn-invest").on("click", function(){
            self.toInvest();
        });

        $("#js-btn-vote").on("click", function(){
            var voteStr = $("#js-txt-vote").val();
            var voteNum = Number(voteStr);

            if(self.isSubmit){
                //防止重复提交
                return;
            }

            if(isNaN(voteNum) || voteNum < 1 || voteStr.indexOf(".")>-1){
                comm.alert('请输入有效的票数');
                return;
            }

            if(voteNum > Number(self.data.leftVotes)){
                new BubbleTip({
                    msg: "投的票数最多不能超过拥有的票数",
                    buttonText: ['确定']
                }).show();
                return;
            }

            self.selectedTeam.qty = voteNum;

            self.isSubmit = true;
            self.doVote(voteNum);
        });

        $("#js-nba1").on("click", function(){
            if(self.isLogin) {
                self.onChoose(TEAM.A);
            }else{
                self.toLogin();
            }
        });

        $("#js-nba2").on("click", function(){
            if(self.isLogin) {
                self.onChoose(TEAM.B);
            }else{
                self.toLogin();
            }
        });

        $("#js-pop-close").on("click", function(){
            self.hidePop();
        });

        $("#js-btn-login").on("click", function(){
            self.toLogin();
        });

        $("#js-btn-register").on("click", function(){
            self.toRegister();
        });
    },

    //获取活动数据
    getData:function(){
        var self = this;
        var _service = new service();
        _service.api = 'activity/eventguessing/info';
        _service.isShowLoading = false;
        _service.data = {
            token: self.token
        }
        _service.success = function (result) {
            self.data = result || {};

            loading.end();
            self.renderData();

            if(self.query._share == 1){
                //只有分享出来的页面才显示活动结束提示
                if(result.guessingStatus == 4){
                    new BubbleTip({
                        msg: "活动已结束",
                        buttonText: ['确定']
                    }).show();
                }
            }

            if(self.isLogin && result.guessingStatus == 4){
                self.getUserBalance();
            }
        }
        _service.error = function (msg, result) {
            loading.end();

            new BubbleTip({
                msg: msg,
                buttonText: ['确定']
            }).show();
        }

        _service.send();
    },

    //获取用户信息
    getUserInfo:function(){
        var self = this;
        var _service = new service();
        _service.api = api.getUserInfo;
        _service.isShowLoading = false;
        _service.data = {
            token: self.token
        }
        _service.success = function (result) {
            self.userId = result.userId;
            self.mobile = result.mobile;
            self.userName = result.userName;

            if(native.isApp){
                self.appShare();
            }
            if(comm.isWebChat()){
                this.wechatShare();
            }
        };
        _service.send();
    },

    //获取用户余额
    getUserBalance: function(){
        var self = this;
        var _service = new service();
        _service.api = api.myaccount;
        _service.isShowLoading = false;
        _service.data = {
            token: self.token
        }
        _service.success = function (result) {
            self.balance = Number(result.totalAmount || 0).toFixed(2);
        };
        _service.send();
    },

    //选择队
    onChoose: function(name){
        //竞猜状态 1:可投票 2:竞猜活动尚未开放投票 3:不在竞猜活动投票时间内 4:竞猜结束
        var actStatus = this.data.guessingStatus;

        if(actStatus == 1){
            this.selectedTeam.code = name;
            this.showPop();
            
        } else if(actStatus == 2){
            new BubbleTip({
                msg: "竞猜活动尚未开放投票",
                buttonText: ['确定']
            }).show();

        } else if(actStatus == 3){
            new BubbleTip({
                msg: "不在竞猜活动投票时间内",
                buttonText: ['确定']
            }).show();
        }
    },

    //投票
    doVote: function(voteNum){
        var self = this;

        var _service = new service();
        _service.api = 'activity/eventguessing/vote';
        _service.isShowLoading = false;
        _service.data = {
            guessId: this.data.guessId,
            supportVote: this.selectedTeam.code,
            token: this.token,
            userId: this.userId,
            voteNumber: this.selectedTeam.qty
        }
        _service.success = function (result) {
            self.isSubmit = false;

            new BubbleTip({
                msg: "投票成功",
                buttonText: ['确定'],
                callback: function (ok) {
                    self.hidePop();
                }
            }).show();
            self.updateData();
            self.renderData();
            $("#js-leftVotes2").text(self.data.leftVotes);
        }
        _service.error = function (msg, result) {
            self.isSubmit = false;

            new BubbleTip({
                msg: msg,
                buttonText: ['确定'],
                callback: function (ok) {
                    self.hidePop();
                }
            }).show();
        }
        _service.send();
    },

    //投票后更新数据
    updateData: function(){
        if(this.selectedTeam.code == TEAM.A){
            this.data.supportVotesA = Number(this.data.supportVotesA) + this.selectedTeam.qty;
            this.data.hadVotedNumA = Number(this.data.hadVotedNumA) + this.selectedTeam.qty;
        } else {
            this.data.supportVotesB = Number(this.data.supportVotesB) + this.selectedTeam.qty;
            this.data.hadVotedNumB = Number(this.data.hadVotedNumB) + this.selectedTeam.qty;
        }

        this.data.leftVotes = Number(this.data.leftVotes) - this.selectedTeam.qty;
    },

    //渲染数据
    renderData: function(){
        var data = this.data;

        $("#js-name1").text(data.competitionPartyA);
        $("#js-name2").text(data.competitionPartyB);
        $("#js-name11").text(data.competitionPartyA);
        $("#js-name22").text(data.competitionPartyB);

        $("#js-votes1").text(data.supportVotesA || 0);
        $("#js-votes2").text(data.supportVotesB || 0);

        $("#js-score1").text(data.scoreA);
        $("#js-score2").text(data.scoreB);

        //已登录
        if(this.isLogin){
            $("#js-leftVotes1").text(data.leftVotes || 0);
            $("#js-supportVotes1").text(data.hadVotedNumA || 0);
            $("#js-supportVotes2").text(data.hadVotedNumB || 0);
        }

        //竞猜结束
        if(data.guessingStatus == 4){
            $("#js-prize").text(Number(data.prize));
            $("#js-gameover").show();
            $("#js-gameing").hide();

            var winner = data.winningParty == TEAM.A ? data.competitionPartyA : data.competitionPartyB;
            $("#js-winner").text(winner);

            data.winningParty == TEAM.A ? $("#js-nba2").addClass("lose") : $("#js-nba1").addClass("lose");
        }
    },

    showPop: function(){
        $("#js-txt-vote").val(1);
        $("#js-leftVotes2").text(this.data.leftVotes || 0);
        $("#js-chooseTeam").text(this.selectedTeam.code == TEAM.A ? this.data.competitionPartyA : this.data.competitionPartyB);

        if(this.selectedTeam.code == TEAM.A){
            $("#js-superman").removeClass("man2").addClass("man1");
        } else {
            $("#js-superman").removeClass("man1").addClass("man2");
        }
        

        $("#js-pop-masking").show();
        $("#js-pop").show();
    },

    hidePop: function(){
        $("#js-pop-masking").hide();
        $("#js-pop").hide();
    },

    //登录
    toLogin: function(){
        if (native.isApp) {
            native.action('tokenExpired');
        } else {
            location.href = publicConfig.liecaiUrl + '/login/login?backurl=' + encodeURIComponent(location.href);
        }
    },

    //注册
    toRegister: function(){
        var name = this.query.name;
        if(name.length < 5){
            name = encodeURIComponent(name);
        }

        var params = 'recommendCode=' + this.query.recommendCode + '&name=' + name;

        location.href = publicConfig.leicaiDomain + 'pages/user/invite_enroll.html?' + params;
    },

    //提现
    toTixian: function(){
        var self = this;
        if (native.isApp) {
            native.getAppVersion(function(appVersion){
                var oldVer = 460; //4.6.0
                var curVer = Number(appVersion.replace(/\./g, ''));

                var data = {
                    android:{
                        name:'MyAccountIncomeActivity', 
                        paramsKey:'balanceMoney',
                        params:self.balance
                    },
                    ios:{
                        name:'MIAccountBalanceViewController',
                        method:'initWithNibName:bundle:',
                        params:'MIAccountBalanceViewController,nil'
                    }
                };

                if(curVer > oldVer){
                    data = {
                        android:{
                            name:'BalanceActivity',
                            paramsKey:'balanceMoney',
                            params:self.balance
                        },
                        ios:{
                            name:'MyBalanceViewController',
                            method:'initWithNibName:bundle:',
                            params:'MyBalanceViewController,nil'
                        }
                    };
                }
                native.skipAppPage(data);
            });
        }else{
            location.href = './../download/download.html'
        }
    },

    //去投资列表
    toInvest: function(){
        if(native.isApp){
            native.action('refreshPage');
            var data = {
                android:{
                    name:'MainActivity',
                    paramsKey:'skipTab',
                    params:'p1t0'
                },
                ios:{
                    name:'AgentContainerViewController',
                    method:'',
                    params:'0'
                }
            };
            native.skipAppPage(data);
        } else {
            location.href = './../download/download.html';
        }
    },

    //app分享
    appShare: function(){
        var data = this.getShareData();

        var shareData = {
            shareDesc: data.desc,
            shareImgurl: data.imgMD5,
            shareLink: data.link,
            shareTitle: data.title
        }
        native.action("getSharedContent",shareData)
    },

    //微信分享
    wechatShare:function(){
        var data = this.getShareData();

        // 微信分享信息
        var wechatShareData = {
            title  : data.title,
            desc   : data.desc,
            link   : data.link,
            imgUrl : publicConfig.imageUrl + data.imgMD5
        };
        new wechatShare(wechatShareData); 
    },

    getShareData: function(){
        var link = location.origin + location.pathname + '?_share=1&recommendCode='+this.mobile+'&name='+encodeURIComponent(this.userName);

        return {
            title  : '收到一笔10万元现金大奖', // 分享标题
            desc   : 'NBA季后赛火热进行中，猜中总冠军花落谁家，10万元现金大奖就是你的！', // 分享描述
            imgMD5 : 'dfa3e35be331f6ec67566130f67820b9', //分享图标的MD5
            link   : link //分享链接
        }
    }
};


var loading = {

    rate: 5,

    isAjaxFinish: false,

    clear: function(){
        if(this.timer){
            window.clearInterval(this.timer);
        }
    },

    random: function(min, max){
        if(this._unique){
            return this._unique;
        }

        this._unique = parseInt(Math.random()*(max-min+1)+min,10);

        return this._unique;
    },

    start: function(speed){
        var self = this;
        var random = this.random(20,70);

        var $divColor = $("#js-loading .line .color");
        var $divRate = $("#js-loading .line .rate");
        var $divRateTxt = $("#js-loading .line .rate span");

        this.clear();
        this.timer = window.setInterval(function(){
            var ballRate = self.rate - 10;

            $divColor.css("width", self.rate + "%");
            $divRate.css("left", ballRate + "%");
            $divRateTxt.text(self.rate + "%");


            if(self.rate >= 100){
                self.clear();
                $("#js-loading").hide();
                $("#js-content").show();
            }

            if(self.rate == random){
                self.clear();
                window.setTimeout(function(){
                    loading.start(15);
                }, 250);
            }

            if(self.rate == 80){
                if(self.isAjaxFinish){
                    loading.start(20);
                }else{
                    self.clear();
                }
            }

            self.rate++;

        }, speed || 20);
    },

    end: function(){
        this.isAjaxFinish = true;
        loading.start();
    }
};

loading.start();

nba2018.init();
