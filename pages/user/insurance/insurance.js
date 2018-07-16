var native = require('modules/common/native');

var insurance = {
    init: function () {
        native.action('setWebViewHeight', {height: document.body.scrollHeight});
    }
}

insurance.init();
