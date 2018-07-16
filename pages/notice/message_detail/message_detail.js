var $ = require("zepto");
var service = require('modules/common/service');
var api = require('modules/api/api');
var comm = require("modules/common/common");
var native = require('modules/common/native');

var md = {
    init: function () {
        var self = this;
        this.query = comm.getQueryString();
        native.getAppToken(function (data) {
            self.token = data || '';
            self.renderMessage();
        });

    },

    renderMessage: function () {
        var messageDetail = new service();
        messageDetail.api = api.noticeDetail;
        messageDetail.data = {
            msgId: this.query.msgId,
            token: this.token
        }
        messageDetail.success = function (result) {
            $(".title").text(result.title);
            $('.article').html(result.content);
        };
        messageDetail.send();
    }
};

md.init();





