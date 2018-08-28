api = {
    //理财产品-产品详情
    productDetail: 'product/productDetail',

    //理财产品-佣金计算器
    profitCalculate: 'product/profitCalculate',

    //资讯分页
    information: 'app/newsPageList',

    //资讯详情
    informationDetail: 'app/pageList/detail',

    //APP下载列表
    downloadAppList: 'app/downloadAppList',

    //机构产品-投资攻略
    guide: 'platfrom/investmentStrategy',

    //查询机构动态信息
    orgDynamicDetail: 'platfrom/queryOrgDynamicInfo',

    //列表详情
    classRoomDetail: "classroom/queryClassRoomDetail",

    //产品分类优选
    productClassifyPreference: 'product/productClassifyPreference/2.0.1',

    //产品列表
    productPageList: "product/productPageList",

    //公告详情
    noticeDetail: 'msg/notice/detail',

    //是否实名认证
    personAuthenticate: 'account/personcenter/setting',

    //绑定平台统计
    platormStatistics: '/platfrom/accountManager/statistics',

    //检查是否有注册第三方账户
    isBindOtherOrg: '/platfrom/isBindOrgAcct',

    //重置支付密码-输入手机验证
    inputVcode: 'account/inputVcode',

    //小金库账户
    account: 'account/myaccount',

    //我的理财师
    minePlanner: 'user/mycfp',

    //理财师推荐产品列表
    recdProductPageList: 'product/recdProductPageList',

    //红包
    queryRedPacket: 'redPacket/queryRedPacket',

    //邀请有理
    invitation: 'invitation/customer/homepage',

    //邀请列表
    invitationList: 'invitation/investor/pageList',

    //邀请统计
    invitationstatistics: 'invitation/investor/statistics',

    // 微信分享
    wechatShare: 'invitation/wechat/share',

    //获取系统默认信息
    defaultConfig: 'app/default-config',

    // 退出登录
    logout: "user/logout",

    //已经反馈
    feedback: "app/suggestion",

    //账户明细
    accountDetailList: 'account/myaccountDetail/pageList',

    //账户提现记录
    withdrawHistory: 'account/queryWithdrawLog',

    //提现累计
    withdrawSummary: 'account/getWithdrawSummary',

    //查询银行
    queryAllBank: 'account/queryAllBank',

    //添加银行卡
    addBankCard: 'account/addBankCard',

    //查询用户办卡信息
    getUserBindCard: 'account/getUserBindCard',

    //设置支付密码
    initPayPwd: 'account/initPayPwd',

    //我的账户
    myaccount: 'account/myaccount',

    //提现银行卡信息
    getWithdrawBankCard: 'account/getWithdrawBankCard',

    //查询省份
    queryAllProvince: 'account/queryAllProvince',

    //查询城市
    queryCityByProvince: 'account/queryCityByProvince',

    //提现
    userWithdrawRequest: 'account/userWithdrawRequest',

    // 登录
    login: "user/login",

    // 微信登录
    weChatLogin: "user/wechat/login",

    // 发送验证码
    sendVcode: "user/sendVcode",

    // 用户注册
    register: 'user/register',

    // 重置登录密码
    resetLoginPwd: 'user/resetLoginPwd',

    // 用户是否注册
    checkMobile: 'user/checkMobile',

    //APP日志
    appLogList: 'app/appLogList/2.0.3',

    //获取用户信息
    getUserInfo: "user/getUserInfo",

    //职级特权
    rankInfo: "personcenter/partner/jobGrade",

    //个人名片--个人信息
    userInfo: 'user/userInfo',

    //银行支付限额表
    orgRechargeLimitList : 'platfrom/orgRechargeLimitList/4.1.1',

    //成长手册
    handbook : 'growthHandbook/detail/4.1.1',

    user: 'activity/wheel/prize/record/user',

    all: 'activity/wheel/prize/record/all',

    one: 'activity/wheel/prize/one',

    ten: 'activity/wheel/prize/ten',

    times: 'activity/wheel/prize/times',

    //新手福利六连送任务完成状态--4.3.0
    newerWelfareFinishStatus:'cfpnewcomerwelfaretask/finishStatus/4.3.0',

    //领取终极大奖--4.3.0
    sendFinalPrize:"cfpnewcomerwelfaretask/sendFinalPrize/4.3.0",

    //貅比特月份收益榜
    monthIncome:"act/rankList/zyb/rank",

    // 每日早报
    morningPaper:"classroom/morningPaper/4.5.0",

    //交易详情
    investCalendarDetail : 'personcenter/investCalendarDetail',

    // 邀请理财师
    invitationCfp : 'invitation/cfp/homepage',

    // 机构详情
    platfromDetail: 'platfrom/detail',

    /* 保险  */
    //精选保险
    insuranceSift : 'insurance/qixin/insuranceSift',

    // 保险列表
    insuranceList : 'insurance/qixin/insuranceList',

    // 甄选保险
    insuranceSelect : 'insurance/qixin/insuranceSelect',

    // 测试报告保险推荐
    testReportRecommend : 'insurance/base/testReportRecommend',

    testReportResult :  'insurance/base/testReportResult',

    // 邀请理财师分享页面信息-4.5.4
    inviteRegInfo : 'homepage/cfp/inviteRegInfo/4.5.4',

    // 邀请理财师佣金奖励信息-4.5.4
    feeInfo : 'homepage/cfp/feeInfo/4.5.4',

    signStatistics :'sign/statistics/4.5.1',

    //保存微信ID
    saveWeiXinOpenId : 'user/saveWeiXinOpenId'
};

module.exports = api;