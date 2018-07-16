/**
 * @require style.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var ScrollList = require("modules/common/scrollList");
var api = require('modules/api/api');
var service = require('modules/common/service');
var native = require('modules/common/native');

var information = {
    init: function () {
        var self = this;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.token = data || '';
                self.getRenderData();
                self.initEvent();
            });
        } else {
            self.token = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NzA4ODExMjk2MzQsInN1YiI6IjA4OTFmMjhhOTg4NjQzNmQ5MzEzZWEwYWYwNzNjN2I4IiwiaXNzIjoiaHR0cHM6XC9cL3d3dy5saW5rd2VlLmNvbSJ9.jXAueqAtr8nVEwgSifqDc95xCogjMKTF2uMu4fPPv0w';
            this.getRenderData();
            this.initEvent();
        }
    },

    getRenderData: function () {
        new ScrollList({
            ele: $('#informationList'),
            api: api.information,
            data: {
                token: this.token
            },
            dataFilter: function (result) {
                $.each(result, function (index, item) {
                    if (item.summary.length > 35) {
                        item.summary = item.summary.substring(0, 35) + '...';
                    }
                    //item.linkUrl = item.linkUrl || 'http://mchannel.xiaoniuapp.com/pages/home/information_detail.html';
                    item.linkUrl = 'information_detail.html';
                })
                return result;
            },
            callback: function () {
                $('#informationList').find('img').forEach(function (obj, index) {
                    $(obj).attr('src', $(obj).data('src'));
                });
            }
        });
    },

    initEvent: function () {
        $('#informationList').on('click', 'li', function () {
            var href = $(this).data('href');
            var newsId = $(this).data('newsid');
            comm.goUrl(href + '?newsId=' + newsId, false);
        })
    }
};
information.init();
