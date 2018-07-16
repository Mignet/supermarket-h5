/**
 * @require style.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var api = require('modules/api/api');
var service = require('modules/common/service');
var native = require('modules/common/native');

var information = {
    init: function () {
        var self = this;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.platfrom = native.source;
                self.token = data || '';
                self.newsId = comm.getQueryString(location.search).newsId;
                self.getRenderData();
            });
        } else {
            self.token = '';
            self.platfrom = 'WeChat';
            self.newsId = comm.getQueryString(location.search).newsId;
            self.getRenderData();
        }
    },

    getRenderData: function () {
        var detailServer = new service();
        detailServer.api = api.informationDetail;
        detailServer.data = {
            newsId: this.newsId,
            token: this.token
        }
        detailServer.success = function (result) {
            document.title = result.title;
            native.action('setAppWebTitle', {title: result.title});
            $('#releaseTitle').text(result.title);
            $('#releasePerson').text(result.creator);
            $('#releaseTime').text(result.crtTime);
            $('.main').append(result.content)
        }
        detailServer.send();
    }
};

information.init();
