/**
 * @require style.css
 * 
*/
var $              = require("zepto");
var comm           = require('modules/common/common');
var Swiper         = require('modules/library/swiper/swiper');
var api        = require('modules/api/api');
var Service        = require('modules/common/service');
var native         = require('modules/common/native');
var BubbleTip      = require('modules/widget/bubbleTip/bubbleTip');
var token =  $(window.parent.token).selector;
var strategy = {
    init:function(){    
        var self = this;
        this.isBindCard = false;
        if(native.isApp){
            self.token = token;
            self.getData();
            self.getBindCard();
            self.bindEvent();
        }else{
        }
    },
    bindEvent:function(){
        var self = this;
        // 绑卡认证
        $(".identification-wrapper").on('click',"#identification",function(){
            if(self.isBindCard){
                var tip = new BubbleTip({
                    msg: '您已经绑过卡哦！看看其他攻略吧！',
                    buttonText: ['取消', '确定'],
                    callback: function (ok) {
                    }
                });
                tip.show();
            }else{
                window.parent.nativeMethod.bindCardAuthenticate();
            }
        });
        //邀请客户
        $(".client-wrapper").on('click',"#inviteClient",function(){
            window.parent.nativeMethod.invitedCustomer();
        });

        //邀请理财师
        $(".cfp-wrapper").on('click',"#invitedCfg",function(){
            window.parent.nativeMethod.invitedCfg();
        })

        //邀请理财师
        $(".leader-wrapper").on('click',"#leaderTeam",function(){
            window.parent.nativeMethod.invitedCfg();
        })
    },
    getData:function(){
        var self = this;
        var dataService = new Service();
        dataService.api = api.productClassifyPreference;
        dataService.data={
            cateIdList:2
        };
        dataService.success=function(result){
            var flowMaxRate =result.datas[0].productPageListResponse.flowMaxRate.toFixed(2);
            $("#yearRate").text(flowMaxRate);
            self.productId = result.datas[0].productPageListResponse.productId;
            var orgNo = result.datas[0].productPageListResponse.orgNumber;
            var orgName =  result.datas[0].productPageListResponse.orgName;
            var url = 'https://www.toobei.com/app/pages/financing/product_detail.html?productId='+ self.productId + '&token=' + self.token;
            $("#buyProduct").on("click",function(){
                window.parent.nativeMethod.gotoWeb(url,orgNo,orgName,self.productId);
            })
        }
        dataService.send();
    },
    getBindCard:function(){
        var self  = this;
        var bindCardService = new Service();
        bindCardService.api = api.personAuthenticate;
        bindCardService.data={
            token:self.token,
        };
        bindCardService.success=function(result){
            self.isBindCard = result.bundBankcard;
        }
        bindCardService.send();
    }
};

strategy.init();