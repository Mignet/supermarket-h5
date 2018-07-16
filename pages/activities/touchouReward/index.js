/**
 * @require style.css
 */
var $          = require("zepto");
var ScrollList = require("modules/common/scrollList");
var service    = require('modules/common/service');
var native     = require('modules/common/native');
var evt = {
    init : function() {
        var self = this;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token = data || '';
                self.renderRankList()
                self.renderMySale()
                self.bindEvent()
            });
        } else {
            this.renderRankList()
            this.bindEvent()
            $(".my-money-wrapper").add('.know-wrapper').hide();
        }
    },
    bindEvent:function () {
        $("#seeMore").on('click',function () {
            $("#lists").css('maxHeight','none')
            $(this).hide();
        })

        // 跳转到投筹平台详情页
        $("#go").on('click',function () {
            native.action('getAppPlatfromDetail',{orgNo:'OPEN_TOUCHOU_WEB'})
        })

        $("#learn").on('click',function () {
            if(native.isApp){
                native.action('removeLocalSharedBtn');
                setTimeout(function(){
                    native.locationInApp(publicConfig.leicaiDomain + '/pages/activities/tcOnline.html')
                },200)
            }

        })


    },
    renderRankList:function(){
        new ScrollList({
            ele:$("#lists"),
            api:"activity/tcOnline/rankingList/pageList",
            pageSize:100,
            callback:function(result,allResult){
                var oLi = $("#lists").children('li')
                oLi.eq(0).children('.rownum-icon').addClass('first-icon')
                oLi.eq(1).children('.rownum-icon').addClass('second-icon')
                oLi.eq(2).children('.rownum-icon').addClass('third-icon')
                if(allResult.totalCount <= 0){ $(".rank-list-container").hide()}
                if(allResult.totalCount<=8){$(".see-more").hide()};
                $(".wraper").show()
            },
            emptyCallBack:function(){
                $(".wraper").show()
                $(".rank-list-container").hide()
                $(".see-more").hide()
            }
        })
    },
    renderMySale:function(){
        var self = this;
        if(!self.token){
            $(".my-money-wrapper").hide();
            return;
        }
        var mySaleService = new service();
        mySaleService.api = 'activity/tcOnline/rankingList/mySale';
        mySaleService.isShowLoading = false;
        mySaleService.data = {token:self.token};
        mySaleService.success = function (result) {
            $("#yearRate").text(result.investAmount)
        };
        mySaleService.send();
    }
};
evt.init();
