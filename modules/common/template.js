
// 模板替换对象
// temStr：模板字符串
// data：需结合模板字符串的json数据
function template(){}

template.prototype = {

	// 修正constructor
	constructor : template,

	// 默认值分隔符
	splitStr : '|',

	// 替换字符串左边界标识符，为正则元字符需转义
	leftStr : '\\{\\{',

	// 替换字符串右边界标识符
	rightStr : '\\}\\}',

	// 是否开启字段为空，undefined等值时取默认值的模式
	isDefault  : true,

	// 获取转换后的html字符串
	getHtml : function(tem,data){

		var replaceStr = '';
		if( $.isArray( data ) ){	// 数组处理
			for(var i=0; i<data.length; i++){
				replaceStr += this.replaceTemStr( tem,data[i] );
			}
		}else{
			replaceStr = this.replaceTemStr( tem,data );
		}
		return replaceStr;
	},

	// 获取替换数据后的html字符串
	replaceTemStr : function(tem,data){
		var keySortArr = this.getKeySortArr(data);

		for( var k = 0; k < keySortArr.length; k++ ){
			var key = keySortArr[k];

			// 找出所有需要匹配的字符串数组mainRegArr
			var mainRegStr = this.leftStr + '[^('+ this.rightStr +')]*' + key + '[^('+ this.rightStr +')]*' + this.rightStr;	// 匹配正则
			var mainReg = new RegExp( mainRegStr, 'g');
			var mainRegArr = tem.match( mainReg );

			// 去除左右边界标识符正则
			var subStr = '^'+ this.leftStr + '|' + this.rightStr + '$';
			var subReg =  new RegExp( subStr, 'g');

			//当前字段名正则（可替换匹配字符串中多个当前字段）
			var keyReg = new RegExp( key, 'g');	

			if( mainRegArr ){	// 有匹配项(无mainRegArr为null)
				for( var i=0; i < mainRegArr.length; i++){
					var replaceStr = mainRegArr[i];

					if( this.isDefault ){ // 开启了默认值模式
						var splitArr = mainRegArr[i].split( this.splitStr );

						if( splitArr.length > 1 ){	// 有设置默认值(注意：替换字符串中不要出现多个分隔符)
							if( $.trim( data[key] ) == '' ){	// 数据为空则取默认值
								replaceStr = splitArr[1];
							}else{
								replaceStr = splitArr[0];	// 数据正常，忽略默认值
							}
						}
					}

					// 替换字段名
					replaceStr = replaceStr.replace( keyReg,data[key] );
					// 去除左右边界标识符
					replaceStr = replaceStr.replace( subReg,'' );
					// 替换模板字符串
					tem = tem.replace( mainRegArr[i],replaceStr );
				}
			}
		}
		return tem;
	},

	// 对key按照长度排序，优先字符个数多的，避免多个key包含出现的替换错误
	getKeySortArr : function(data){
		var keyArr = [];
		for( key in data ){
			keyArr.push( key );
		}
		keyArr.sort(function(a,b){
			return  b.length - a.length;
		});
		return keyArr;
	}
}

// 公共配置文件
module.exports = new template();






