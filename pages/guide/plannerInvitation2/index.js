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

var evt = {
    init: function () {
        var self = this;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token = data || "";
                for(var i=0;i<$(".link").length;i++){
                    $(".link").eq(i).attr('href',$(".link").eq(i).attr('href') + '?isApp=liecai')
                }
                self.bindEvent();
                if(self.token){
                    self.getUserInfo();
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
            }else{
                $("#shareBtn").on('click',function(){
                    native.action('tokenExpired')
                })
            }
        }
        this.getRankList()
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
            $("#shareBtn").on('click',function(){
                self.appShareRegEvent();
            })
        };
        userInfoService.send();
    },
    getRankList:function(){
        var self = this;
        new Render({
            ele: $('#list'),
            api: api.monthIncome,
            isList: true,
            data:{
                pageSize:5
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
            callback: function (data) {
            }
        });
    },
    appShareRegEvent: function () {
        var appShareData = {
            shareTitle: '组团赚17.7%的超高收益', // 分享标题
            shareDesc: '理财赚钱我推荐安全靠谱的猎财大师，收益最高可达17.7%。邀你跟我组团，一起赚更多哦～',
            shareLink: publicConfig.static + 'pages/user/inviteRegister.html?recommendCode=' + this.recommendCode + '&name=' + encodeURIComponent(this.name),
            shareImgurl: 'dfa3e35be331f6ec67566130f67820b9' // 分享图标
        }
        native.appShare(appShareData);
    },
};

evt.init();