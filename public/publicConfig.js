// 公共配置文件
var publicConfig = (function() {

    var config = {

        // 开发模式( dev:开发环境，mock:模拟数据环境,pre:测试环境，produce:生产环境)
        mode: '__project_mode__',

        // 默认开启调试模式
        debug: true,

        //  根目录变量，用于后期可能的子目录
        root: '/'
    };

    //http://10.16.0.204:8080/mockjs/8
    // 接口主机地址
    var host = {
        mock: "10.16.0.204:8080",
        dev: '10.16.0.128:8888',
        pre: 'premarket.bethye.top',
        produce: 'market.bethye.top'
    };

    // 图片接口主机地址
    var imgHost = {
        mock: 'preimage.bethye.top',
        dev: 'image.bethye.top',
        pre: 'preimage.bethye.top',
        produce: 'image.bethye.top'
    }

    var liecaiHost = {
        mock: 'https://prenliecai.bethye.top',
        dev: 'http://10.16.0.128:12002',
        pre: 'https://prenliecai.bethye.top',
        produce: 'http://nliecai.bethye.top'
    }

    //网址地址
    var static = {
        mock: 'preliecai.bethye.top',
        //开发环境
        dev: '10.16.0.128:12001',
        // 预发布环境
        pre: 'preliecai.bethye.top',
        // 生产环境
        produce: 'liecai.bethye.top'
    }

    // 网站地址
    var webAddress = {
        // mock环境
        mock: 'preliecai.bethye.top',
        //开发环境
        dev: '10.16.0.128:12001',
        // 预发布环境
        pre: 'preliecai.bethye.top',
        // 生产环境
        produce: 'liecai.bethye.top'
    }

    var toobeiDomain = {
        mock: 'pre.bethye.top/app',
        //开发环境
        dev: '10.16.0.128:12001',
        // 预发布环境
        pre: 'pre.bethye.top/app',
        // 生产环境
        produce: 'www.bethye.top/app'
    }

    // http协议名
    var httpProtocol = {
        http: 'http://',
        https: 'http://'
    }
    var httpProtocolType = null;
    var hostPostfix = null;
    if (config.mode === 'mock') {
        httpProtocolType = httpProtocol.http;
        hostPostfix = '/mockjs/8/'
    } else {
        httpProtocolType = httpProtocol.https;
        hostPostfix = '/rest/api/';
    }

    // 默认https协议
    config.serverUrl = httpProtocolType + host[config.mode] + hostPostfix;

    // 开启https协议
    config.httpsServerUrl = httpProtocolType + host[config.mode] + hostPostfix;

    //默认img server
    config.imageUrl = httpProtocolType + imgHost[config.mode] + '/';

    //注册图片验证码用
    config.host = httpProtocolType + host[config.mode];

    // 新版貅比特链接
    config.liecaiUrl = liecaiHost[config.mode];

    // 网站域名
    config.static = httpProtocol.https + static[config.mode] + config.root;

    // 貅比特网站域名
    config.leicaiDomain = httpProtocol.https + webAddress[config.mode] + config.root;

    // T呗域名
    config.toobeiDomain = httpProtocol.https + toobeiDomain[config.mode] + config.root;

    // 生产环境则关闭调试模式
    if (config.mode == 'produce') {
        config.debug = false;
    }

    // 返回最后配置对象
    return config;

})();
