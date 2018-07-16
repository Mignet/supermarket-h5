/**
 * @require style.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var service = require('modules/common/service');
var render = require('modules/common/render');
var api = require('modules/api/api');
var tipBox = require('modules/widget/tipBox/tipBox');
var ele = $("#profitList");

var calculation = {
    init: function () {
        var search = comm.getQueryString(location.search);
        this.productId = search.productId;
        this.rewardRatio = search.rewardRatio;
        this.amt = "";
        this.getData();
        this.event();
    },

    getData: function () {
        var self = this;
        var renderService = new service();
        renderService.api = api.profitCalculate,
            renderService.data = {
                productId: self.productId,
                rewardRatio: self.rewardRatio,
                amount: self.amt
            };
        renderService.success = function (result) {
            self.render(result.datas);
        }
        renderService.send();
    },

    render: function (data) {
        var arr = [];
        $("#profitList").empty();
        arr.push('<li class="common-style"><span>销售金额<e> (元) </e></span><span><input id="amount" type="text" placeholder="请输入对应的金额" autofocus="autofocus" /></span></li>');
        for (var i = 0; i < data.length; i++) {
            arr.push('<li class="common-style"><span>' + data[i].profiltName + '<e> (元) </e></span><span>' + (data[i].profiltValue || '0.00') + '</span></li>');
        }
        $("#profitList").append(arr.join(''));
        if (this.amt) $('#amount').val(this.amt);

    },

    event: function () {
        var self = this;
        var box = new tipBox();
        $("#calculation").on('click', function () {
            var value = $("#amount").val();
            if (!value) return;
            if (!/\d/g.test(value)) {
                box.show('销售额必须为数字哦');
                return;
            }
            self.amt = value;
            self.getData();
        })
    }
};

calculation.init();

