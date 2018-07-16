/**
 * @require style.css
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
                self.token = data || "";
                self.platfrom = native.source;
                self.id = comm.getQueryString(location.search).id;
                self.type = comm.getQueryString(location.search).type;
                self.getRenderData();
            });
        } else {
            self.token = sessionStorage.getItem('__token__') || undefined;
            self.platfrom = 'WeChat';
            self.id = comm.getQueryString(location.search).id;
            self.type = comm.getQueryString(location.search).type;
            self.getRenderData();
        }
    },

    initParams: function (server) {
        var self = this;
        var apiData = {
            "1": api.orgDynamicDetail,
            "2": api.informationDetail,
            "3": api.classRoomDetail,
            "4": api.noticeDetail
        };

        var paramsName = {
            "1": "orgDynamicId",
            "2": "newsId",
            "3": "id",
            "4": "msgId"
        };
        server.api = apiData[this.type];
        var data = {};
        data[paramsName[this.type]] = this.id;
        data.token = self.token;
        server.data = data;
    },

    getRenderData: function () {
        var self = this;
        var detailServer = new service();
        this.initParams(detailServer)
        detailServer.success = function (result) {
            if (self.type == "1") {
                result.title = result.orgTitle;
                $(".title").text(result.orgTitle);
                $('.article').html(result.orgContent);
                $('.wraper').show();
            }

            if (self.type == "2") {
                $('#releaseTitle').text(result.title);
                $('#releasePerson').text(result.creator);
                $('#releaseTime').text(result.crtTime);
                $(".header").show();
                $('.main').append(result.content).show();
            }

            if (self.type == "3") {
                $('.main').append(result.content);
                $('.main').show();
            }

            if (self.type == "4") {
                $(".title").text(result.title);
                $('.article').html(result.content);
                $('.wraper').show();
            }
            document.title = result.title;
            native.action('setAppWebTitle', {title: result.title});
        }
        detailServer.send();
    }
};

information.init();
