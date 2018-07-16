/**
 * @require style.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var service = require('modules/common/service');
var api = require('modules/api/api');
var share = require("modules/widget/share/share");

var download = {

    // 初始化
    init: function () {
        this.downloadLogoImg = $('#downloadLogoImg');
        this.downloadLevel = $('#downloadLevel');
        this.downloadButton = $('#downloadButton');
        this.iphoneDown = $('#iphoneDown');
        this.androidDown = $('#androidDown');
        this.iosTip = $('#iosTip');
        this.iphoneDownVersion = $("#iphoneDownVersion");
        this.androidDownVersion = $("#androidDownVersion");
        this.getDownload();
        if (!comm.isWebChat()) {
            $('.wraper').addClass('canDownLoadWraper');
        }
        if (!comm.isWebChat()) {
            $(".downloadtip").hide();
        }
        // 事件绑定
        this.events();
    },

    events: function () {
        var _this = this;
        // 显示分享提示
        $('#downloadButton a').on('click', function () {
            if (comm.isWebChat()) {
                share.show('请点击右上角菜单，选择在浏览器中打开下载');
                return false;
            }
        });
    },


    // 通过接口获取下载app地址及版本信息
    getDownload: function () {
        var _this = this;
        var downloadService = new service();
        downloadService.api = api.downloadAppList;
        downloadService.success = function (result) {
            var arr = result.datas;
            if ($.isArray(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].platform.toLowerCase() == 'android') {
                        _this.androidDown.attr('href', arr[i].downloadUrl);
                        _this.androidDownVersion.text("（" + arr[i].version + " 版本） 更新时间：" + arr[i].issueTime.trim().split(' ')[0])

                    }

                    if (arr[i].platform.toLowerCase() == 'ios') {
                        _this.iphoneDown.attr('href', arr[i].downloadUrl);
                        _this.iphoneDownVersion.text("（" + arr[i].version + " 版本） 更新时间：" + arr[i].issueTime.trim().split(' ')[0]);
                    }

                }
            }
        }
        downloadService.send();
    }
};


download.init();





