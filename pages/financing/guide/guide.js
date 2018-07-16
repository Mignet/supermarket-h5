/**
 * @require style.css
 */
var $ = require("zepto");
var comm = require("modules/common/common");
var service = require('modules/common/service');
var api = require('modules/api/api');

var calculation = {
    init: function () {
        var search = comm.getQueryString(location.search);
        this.orgNumber = search.orgNumber || comm.getCookie("__orgNumber__");
        this.getData();
    },

    getData: function () {
        var self = this;
        var renderService = new service();
        renderService.api = api.guide,
            renderService.data = {
                orgCode: self.orgNumber
            };
        renderService.success = function (result) {
            $(".container").html(result.orgPlannerStrategy);
        }
        renderService.send();
    },

};

calculation.init();

