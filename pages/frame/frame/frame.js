
/**
 * @require style.css
 */
var $              = require("zepto");
var comm           = require('modules/common/common');
var native         = require('modules/common/native');
var loading = require('modules/widget/loading/loading');

var frame = {
    init:function(){
      var self = this;
      var key = comm.getQueryString().type;
      var frameSrc = "";
      var loadingShow = false;/*loading显示|隐藏*/
      var keyArr = [{
          sign:"teamSaleStatDirectRecommend",
          frameUrl:"children/directRecommendReward.html"
        },{
          sign:"teamSaleStatIndirectRecommend",
          frameUrl:"children/indirectRecommenReward.html"
        },{
          sign:"myTeamIntroduce",
          frameUrl:"children/myTeamIntroduce.html",
          title:"我的理财师团队说明"
        },{
          sign:"myTeamHasNoCfpIntroduce",
          frameUrl:"children/myTeamNoCfpIntroduce.html"
        },{
          sign:"updateLog",
          frameUrl:"children/log.html",
          title:"更新日志"
        },{
          sign:"freshStrategy",
          frameUrl:"children/newerStrategy.html",
          title:"新手攻略"
        },{
          sign:"learnAboutUs",
          frameUrl:"children/understand.html",
          title:"了解我们"
        }];
        if(loadingShow){
          loading.show();
        }
        var loadingTimer = setTimeout(function(){
          if(loadingShow){
            loadingShow = false;
            loading.hide();
          }
        },2000)
        keyArr.forEach(function(item,index){
            if(item.sign === key){
                frameSrc = item.frameUrl;
                // if(key === 'updateLog'){
                //   $("#skip").attr("href",$('#updateLog').data("href")).trigger('click');
                // }
                if(item.title){
                    document.title = item.title;
                }
            }
        });
      if(native.isApp){
        native.getAppToken(function(data){
          self.token = data || "";
          window.token = data;
          $("#frame").attr('src',frameSrc);
          $("#frame")[0].onload = function(){
            if(loadingShow){
              loadingShow = false;
              loading.hide();
              clearTimeout(loadingTimer)
            }
            $('#frame').show();
          };
        });
      }else{
        window.token = comm.getCookie("__token__");
        $("#frame").attr('src',frameSrc);
        loading.show();
        $("#frame")[0].onload = function(){
          if(loadingShow){
            loadingShow = false;
            loading.hide();
            clearTimeout(loadingTimer)
          }
          $('#frame').show();
        };
      }
    },
};

frame.init();
window.nativeMethod = {
  "bindCardAuthenticate" : function(){
    native.action("bindCardAuthenticate");//绑卡页面
  },
  "invitedCustomer" : function(){
    native.action("invitedCustomer");//邀请客户
  },
  "invitedCfg" : function(){
    native.action("invitedCfg");//邀请理财师
  },
  "gotoWeb" : function(url,orgNo,orgName,productId){
    native.action('buyTBProduct',{
        url:url,
        orgNo: orgNo,
        orgName: orgName,
        productId: productId
    });
  }
};
