/**
 * @require register_packet.less
 */

var $       = require("zepto");
var comm = require("modules/common/common");
var service   = require('modules/common/service');
var api       = require('modules/api/api');

var register_packet = {
  init: function () {
    var queryString = comm.getQueryString();
    this.name = queryString.name;
    this.recommendCode = queryString.recommendCode;

    if(this.name){
      $('#recommendMob').text(comm.hideName(this.name));
    }else{
      $('#recommendMob').text(comm.hideMiddleStr(this.recommendCode));
    }
    this.getUserInfo()
  },
  getUserInfo : function(){
      var self = this;
      var userInfoService = new service();
      var queryString = comm.getQueryString();
      userInfoService.api = api.inviteRegInfo;
      userInfoService.data = {
          mobile:this.recommendCode
      }
      userInfoService.success = function(result){
          $("#packetContainer").on('click',function(){
            var image = new Image();
            image.src = $("#packetGif").attr('src');
            image.onload = function(){
              $("#packetContainer").addClass('active');
              if(self.name){
                  REGISTER_URL = '/pages/user/invite_enroll.html?recommendCode=' + self.recommendCode + '&name=' + encodeURIComponent(self.name)
              }else{
                  REGISTER_URL = '/pages/user/invite_enroll.html?recommendCode=' + self.recommendCode
              }
              setTimeout(function(){
                  location.href = REGISTER_URL;
              },3000)
            }
          })

      }
      userInfoService.send();
  },
};

register_packet.init();