/**
 * @require style.css
*/
var api = require('modules/api/api')
var Render = require('modules/common/render');
var native = require('modules/common/native')
var comm = require('modules/common/common')
var limit = {
    init:function(){
        this.query = comm.getQueryString();
        document.title= this.query.orgName + '各银行充值限额表'
        this.getLimitMsg();
    },
    getLimitMsg:function(){
        var self = this;
        new Render({
            ele: $('.list'),
            api: api.orgRechargeLimitList,
            isList : true,
            isShowLoading: true,
            data: {
                orgNo: self.query.orgNo,
            },
            callback:function(result){
                $(".table-wrapper").show();
            }
        });
    }
}

limit.init();