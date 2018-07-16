/**
* @require style.less
 *
*/
var $ = require("zepto");
var native = require('modules/common/native');

var fundEvt = {
    init: function () {
        var self = this;
        if (native.isApp) {
            native.getAppToken(function (data) {
                self.bindEvent();
            });
        } else {
            self.bindEvent();
        }
    },
    bindEvent: function () {
        $('body').show()
        if (native.isApp) {
            $("#goBuy").show();
        }
        $("#goBuy").on('click', function () {
            var data = {
                android: {
                    name: 'MainActivity',
                    paramsKey: 'skipTab',
                    params: 'p1t2'
                },
                ios: {
                    name: 'AgentContainerViewController',
                    method: '',
                    params: '2'
                }
            }
            native.skipAppPage(data)
        })
    }
};

fundEvt.init();