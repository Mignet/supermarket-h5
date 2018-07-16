var $ 			= require("zepto");
var comm 		= require("modules/common/common");

var query = comm.getQueryString();

if( query.productType ) {
    $('.article').each(function(index, obj) {
       if( $(obj).data('type') == query.productType ) {
           $(obj).show();
       }
    });
} else {
    $('.article').eq(0).show();
}