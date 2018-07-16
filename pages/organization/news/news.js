var $ = require("zepto");
var comm = require('modules/common/common');
var Service = require('modules/common/service');

var organizationNews = {
    init: function () {
        this.getNews();
    },

    getNews: function () {
        var query = comm.getQueryString();
        var orgServer = new Service();
        orgServer.api = 'platfrom/queryOrgDynamicInfo';
        orgServer.isNeedToken = false;
        orgServer.data = {orgDynamicId: query.id};
        orgServer.success = function (result) {
            if (result) {
                $('title').text(result.orgTitle);
                $('.content').html(result.orgContent);
            }
        }
        orgServer.send();
    }
};

organizationNews.init();