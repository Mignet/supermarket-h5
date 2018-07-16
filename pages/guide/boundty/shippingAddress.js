/**
* @require shippingAddress.less
 *
*/

var service = require('modules/common/service');
var api = require('modules/api/api');
var Service = require('modules/common/service');
var native = require('modules/common/native');
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');
var comm = require('modules/common/common');

var selectProviceDom = $("#selectProvice");
var maskBgDom = $(".mask-bg")
var mastContentDom = $(".mask-content")

var evt = {
	init:function(){
		var self = this;
		this.provinceid = null;
		this.area = "";
		this.cityName = "";
		this.mobile = "";
		this.provinceName = "";
		this.receivingAddress = "";
		this.receivingUserName = "";
		this.thirdAccount = "";
		this.type = 0;
		this.thirdMobile = "";
		this.thirdName = "";
		this.isError = false;
		this.isRequest = false;
		if(native.isApp){
		    native.getAppToken(function(data){
		        self.token = data || '';
		        sessionStorage.setItem("__token__",self.token);
		        self.bindEvent();
		        self.searchUserAccount()
		    });
		}else{
		    this.token  = sessionStorage.getItem("__token__");
		    this.bindEvent();
		    this.searchUserAccount()
		}
	},
	bindEvent:function(){
		var self = this;

		selectProviceDom.on('click',function(){
			self.getProvince();
			$(selectProviceDom).add('#selectCity').css('display','none').text("");
		})

		$("#selectArea").on('click',function(){
			self.getProvince()
			self.maskIn()
		})

		$(".mask-close-btn").add('.mask-bg').on('click',function(event){
			self.maskOut()
			event.preventDefault()
		})

		$("#saveAddrBtn").on('click',function(){
			self.mobile = $("#mobile").val();
			self.receivingAddress = $("#receivingAddress").val();
			self.receivingUserName = $("#receivingUserName").val();
			self.thirdAccount = $("#thirdAccount").val();
			self.thirdMobile = $("#thirdMobile").val();
			self.thirdName = $("#thirdName").val();
			if(self.cityName || self.mobile || self.provinceName || self.receivingAddress || self.receivingUserName){
				self.saveUserAccount(1)
			}
			if(self.thirdMobile|| self.thirdName || self.thirdAccount){
				self.saveUserAccount(2)
			}
			setTimeout(function(){
				if(self.isRequest){
					if(!self.isError){
            			native.locationInApp(publicConfig.leicaiDomain + 'pages/guide/bounty.html')
					}
				}else{
					var tip = new BubbleTip({
					    msg: '请输入收货地址信息',
					    buttonText: ['知道了'],
					    callback: function (ok) {
					    }
					});
					tip.show();
				}
			},1000)

		})
	},
	getProvince: function () {
		var self = this;
		$("#selectText").text('请选择省')
		var provinceLists = [];
	    var provinceServer = new service();
	    provinceServer.isShowLoading = false;
	    provinceServer.data ={
	    	token:this.token
	    }
	    provinceServer.api = api.queryAllProvince;
	    provinceServer.success = function (result) {
	    	result.datas.forEach(function(item){
	    		provinceLists.push('<li class="select-area-item select-province-item" data-provinceid='+item.provinceId+'>'+item.provinceName+'</li>')
	    	})
	    	var provinceListsHtml = provinceLists.join("")
	    	$("#selectAreaItems").html(provinceListsHtml).on('click','.select-province-item',function(){
	    		self.provinceid = $(this).data('provinceid');
	    		self.area = $(this).text();
	    		selectProviceDom.text($(this).text()).show()
	    		self.getCity();
	    		self.provinceName = $(this).text();
	    		$(this).addClass('active').siblings().removeClass('active')
	    		$("#selectAreaItems").off('click')
	    	})
	    }
	    provinceServer.send();
	},
	getCity: function () {
		var self = this;
		$("#selectText").text('请选择市')
		var cityLists = [];
	    var cityServer = new service();
	    cityServer.api = api.queryCityByProvince;
	    cityServer.data = {
	        provinceId: this.provinceid,
	        token:this.token
	    }
	    cityServer.success = function (result) {
	    	result.datas.forEach(function(item){
	    		cityLists.push('<li class="select-area-item select-city-item">'+item.cityName+'</li>')
	    	})
	    	var cityListsHtml = cityLists.join("")
	    	$("#selectAreaItems").html(cityListsHtml).on('click','.select-city-item',function(){
	    		self.area = self.area + $(this).text()
	    		self.cityName = $(this).text()
	    		$("#selectAreaText").text(self.area);
	    		$("#selectAreaItems").off('click')
	    		self.maskOut()
	    	})
	    }
	    cityServer.send();
	},
	maskIn:function(){
		$(maskBgDom).fadeIn();
		$(mastContentDom).show().animate({
			bottom:'0'
		})
	},
	searchUserAccount:function(){
		var self = this;
		var searchAddressService = new Service();
		searchAddressService.api = 'activity/oneyuandraw/receiving/address';
		searchAddressService.data = {
			token:this.token
		}
		searchAddressService.isShowLoading = false;
		searchAddressService.success = function (result) {
			resultArr = result.datas;
			resultArr.forEach(function(item){
				if(item.type == 1){// 邮寄地址
					self.cityName = item.cityName;
					self.mobile = item.mobile;
					self.provinceName = item.provinceName;
					self.receivingAddress = item.receivingAddress;
					self.receivingUserName = item.receivingUserName;
					$("#receivingUserName").val(item.receivingUserName)
					$("#mobile").val(item.mobile)
					$("#receivingAddress").val(item.receivingAddress)
					$("#selectAreaText").text(self.provinceName + self.cityName)
				}else if(item.type == 2){// 爱奇艺账户
					self.thirdAccount = item.thirdAccount;
					self.thirdMobile = item.mobile;
					self.thirdName = item.receivingUserName;
					$("#thirdName").val(self.thirdName)
					$("#thirdAccount").val(self.thirdAccount)
					$("#thirdMobile").val(self.thirdMobile)
				}
			})
		};
		searchAddressService.send();
	},
	saveUserAccount:function(type){
		var self = this;
		this.isRequest = true;
		var saveThirdAccountService = new Service();
		saveThirdAccountService.api = 'activity/oneyuandraw/receiving/address/update';
		if(type == 1){
			saveThirdAccountService.data = {
				cityName:self.cityName,
				mobile:self.mobile,
				provinceName:self.provinceName,
				receivingAddress:self.receivingAddress,
				receivingUserName:self.receivingUserName,
				type:1
			}
		}else if(type == 2){
			saveThirdAccountService.data = {
				mobile:self.thirdMobile,
				receivingUserName:self.thirdName,
				thirdAccount:self.thirdAccount,
				type:2
			}
		}
		saveThirdAccountService.success = function (result) {
		};
		saveThirdAccountService.error = function(msg){
			self.isError = true;
			msg = msg || '信息填写错误'
			comm.alert(msg);
		};
		saveThirdAccountService.send();
	},
	maskOut:function(){
		$(maskBgDom).fadeOut();
		$(mastContentDom).animate({
			bottom:'-100%'
		})
		setTimeout(function(){
			$(mastContentDom).hide()
		},1000)
	}
}

evt.init();