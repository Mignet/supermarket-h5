/**
 * @require detail.less
 */
var $ = require("zepto");
var comm = require("modules/common/common");
var api = require('modules/api/api');
var service = require('modules/common/service');
var native = require('modules/common/native');
require('modules/widget/download/download');

var information = {
    init: function () {
        var self = this;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token = data || null;
                self.id = comm.getQueryString(location.search).id;
                self.getRenderData();
            });
        } else {
            self.token = sessionStorage.getItem('__token__') || null;
            self.id = comm.getQueryString(location.search).id || 31;
            self.getRenderData();
        }
    },

    getRenderData: function () {
        var self = this;
        var detailServer = new service();
        detailServer.api = 'classroom/selectedRecomend/detail/4.5.0'
        detailServer.data = {
            id:self.id
        }
        detailServer.success = function (result) {
            $('#releaseTitle').text(result.title);
            $('#releasePerson').text(result.creator);
            $('#releaseTime').text(result.createTime);
            $(".header").show();
            $('.main').append(result.content).show();
            document.title = result.title;
            native.action('setAppWebTitle', {title: result.title});
            self.appRightTopShare(result)
        }
        detailServer.send();
    },
    appRightTopShare:function(data){
        var shareIcon = "";
        var reg = /^(https:\/\/)(preimage|image)\.toobei\.com\/([A-Za-z0-9]+)$/
        if(data.shareIcon.indexOf('https') > -1){
            shareIcon = data.shareIcon + '?f=png'
        }else{
            shareIcon = data.shareIcon.replace(reg,'$3')
        }
        var shareData = {
            shareTitle: data.shareTitle,
            shareDesc: data.shareDesc,
            shareLink: publicConfig.static + 'pages/information/selectedRecomendDetail.html?id=' + data.id,
            shareImgurl: shareIcon
        }
        native.action("getSharedContent",shareData)
    }
};

information.init();
