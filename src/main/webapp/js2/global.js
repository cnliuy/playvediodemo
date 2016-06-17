/** @description npvrServiceUrl npvr服务器IP，port*/
var npvrServiceUrl = "http://172.20.101.13:8081";
/** @description videoUrl index页面中的直播流 */
var videoUrl = "delivery://490000.6875.64QAM.1901.515.515";
/* @description 全局对象    **/
var V, IEPG = V = IEPG || {};
/** @description userId 为用户ID */
var userId = getUserId();
/** @description epgUrl 业务模板存放路径，到1HD_blue的下层*/
var epgUrl = location.href.substring(0,parseInt(location.href.lastIndexOf("/"))+1);
var epgVodUrl = "../../";
var defaultPic = "images/show_pic.png";
//var defaultNoPic = "images/pm_pic.jpg";
var skinImgUrl = "skin/images/";

var mediaTipFlag = false;//剧集弹出框标识
var searchTipFlag = false;//搜索弹出框标识
var tipFlag=false;
var isPressBack = false;
var pinyin = getQueryStr(location.href, 'pinyin');//拿取index_3j页面所设的参数下标
var cardId = getSid();
String.prototype.trim = function(){
	var str = this ,
	str = str.replace(/^\s\s*/, '' ),
	ws = /\s/,
	i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
};

try {
	if (Coship) {
		Coship.setDrawFocusRing(1);
	}
	if (Utility) {
		Utility.setDrawFocusRing(0);
	}
} catch (e) {

}

function initTitle(){
	$("title").innerHTML = " • " + decodeURIComponent(getQueryStr(location.href, "titleName"));
}

var ipAndPort = 'http://10.10.90.19:8080';//设置本地ip链接返回url
/** @description 键值定义 */
var KEY = {

	"ZERO" : 48,
	"ONE" : 49,
	"TWO" : 50,
	"THREE" : 51,
	"FOUR" : 52,
	"FIVE" : 53,
	"SIX" : 54,
	"SEVEN" : 55,
	"EIGHT" : 56,
	"NINE" : 57,

	"LEFT" : 37,
	"RIGHT" : 39,
	"UP" : 38,
	"DOWN" : 40,
	"ENTER" : 13,
	"PREV" : 33,
	"NEXT" : 34,
	"QUIT" : 27,
	"RED" : 403,
	"GREEN" : 404,
	"YELLOW" : 405,
	"BLUE" : 406,
	"PLAY" : 3864,
	"PLAY1" : 3862,
	"SEARCH" : 3880,

	"UP_N" : 87,		//N9101盒子键值
	"DOWN_N" : 83,
	"LEFT_N" : 65,
	"RIGHT_N" : 68,
	"ENTER_N" : 10,
	"PREV_N" : 306,
	//"NEXT_N" : 307,
	"NEXT_N" : 222,
	//"QUIT_N" : 72,
	"RED_N" : 320,
	"GREEN_N" : 321,
	"YELLOW_N" : 322,
	"BLUE_N" : 323,
	//"PLAY_N": 39,

	"BACK" : 8,
	"RETURN" : 640,

	"RED_T" : 82,		//E600浏览器调试
	"YELLOW_T" : 89,	//E600浏览器调试
	"BLUE_T" : 66,		//E600浏览器调试
	"GREEN_T" : 71,		//E600浏览器调试
	
	"STATIC":67,
	"VOICEUP":61,
	"VOICEDOWN":45
};

function New(aClass, params) {
    function _new() {
        if(aClass.initializ) {
            aClass.initializ.call(this, params);
        }
    }
    _new.prototype = aClass;
    return new _new();
}

Object.extend = function(destination, source) {
    for(var property in source) {
        destination[property] = source[property];
    }
    return destination;
};

/**
 * @description $ 代替document.getElementById
 * @param {string} _id 为页面DIV的id
 */
var $ = function(_id) {
    return typeof _id == 'string' ? document.getElementById(_id) : _id;
};
var G = function(_object, _attribute) {
    return _object.getAttribute(_attribute);
};
var tags = function(_object, _tagname) {
    return _object.getElementsByTagName(_tagname);
};


var changeBg = function (id, url) {//改变背景图
    if (url.indexOf("url") >= 0){
        $(id).style.background = url + " no-repeat";
    }else{
        $(id).style.background = "url(" + url + ") no-repeat";
    } 
};

function changeObjClass(id, className) {//改变对象样式
	$(id).className = className;
}

/**
 * @description trim 去掉字符串前后空格
 * @param {string} _str 需要处理的字符串
 */
function trim(_str) {return _str.replace(/(^\s*)|(\s*$)/g, "");}

/**
 * @description getUserId 取AAA下发的userId，供页面请求数据用，此参数是请求数据的url必带字段
 */
function getUserId() {
    try {
        var userId = Utility.getSystemInfo("UID");
        if (userId == ""){
            return 0;
        }else{
            return userId;
        }
    } catch (e) {
        return 0;
    }
}

function getSid() {
    try {
        return Utility.getSystemInfo("SID");
    } catch (e) {
        return 0;
    }
}

//*********** 逻辑操作时，检查CA和uerId  **************

function checkUser() {
	var userId = getUserId();
	if(userId == "" || userId == "0" || userId == undefined) {
		//showMsg(epgUrl + "tip/a_errorTip.htm", "认证失败，请检查机顶盒和智能卡！");
		return false;
	}
	return true;
}

//检查智能卡插入、拔出消息
document.onsystemevent = function(e) {
    var code = e.which || e.keyCode;
    var keyType = e.type?e.type:1001;
 	if(keyType == 1001){
  		switch(code) {
			case 40070: //中山，卡插入
			case 11703://南海，卡插入
				break;
			case 40071: //中山，卡被拔出
			case 11704://南海，卡被拔出
				//showMsg(epgUrl + "tip/a_errorTip.htm", "认证失败，请检查机顶盒和智能卡！");
				break;
			case 10902:
			case 40201://播放的流文件到头
				break;
			case 10901:
			case 40200://播放的流文件到尾
				playNextNews();//播放下一个新闻
				break;
			default:
				break;
		}
	}
};

/**
 * @description 写cookie，设置全局参数
 * @param {string} _sName 全局参数名称
 * @param {string} _sValue 全局参数名称对于的值
 */

function setGlobalVar(_sName, _sValue) {
	try {
		_sValue = _sValue + "";
		if(Utility.setEnv) {
			Utility.setEnv(_sName, _sValue);
		} else {
			SysSetting.setEnv(_sName, "" + encodeURIComponent(_sValue));//9101
		}
	} catch(e) {
		document.cookie = escape(_sName) + "=" + escape(_sValue);
	}
}

/**
 * @description 读cookie，获取全局参数
 * @param {string} _sName 全局参数名称（对应setGlobalVar方法中的_sName）
 * @return {string} result 返回值（对应setGlobalVar方法中的_sValue）
 */

function getGlobalVar(_sName) {
	var result = "";
	try {
		if(Utility.getEnv) {
			result = Utility.getEnv(_sName);
		} else {
			result = decodeURIComponent(SysSetting.getEnv(_sName));//9101
		}
		if(result == "undefined") {
			result = "";
		}
	} catch (e) {
		var aCookie = document.cookie.split("; ");
		for(var i = 0; i < aCookie.length; i++) {
			var aCrumb = aCookie[i].split("=");
			if(escape(_sName) == aCrumb[0]) {
				result = unescape(aCrumb[1]);
				break;
			}
		}
	}
	return result;
}

//----------------------  路径缓存操作---------------------------------------------------------
/*
 * 在有页面跳转动作时调用 ，用来保存当前页面的URL，URL 之间以 urlSplitChar 号分隔，
 * 调用此方法之前页面需要保存其它的变量需要自己操作
 */
var urlSplitChar = "#";//URL之间的分隔符，可配，但注意确保不会与URL参数重复
var globalPath = {
    setUrl : function() {
        var tempUrl = getGlobalVar("GLOBALURLPATH") == undefined ? "" : getGlobalVar("GLOBALURLPATH");//取全局变量
        tempUrl = tempUrl + urlSplitChar + location.href;  //将已存在的路径和当前URL之间加上分隔符
		var arr = tempUrl.split(urlSplitChar);
		if(arr.length > 6) {
			var removeLength = arr.length - 6;
			var newArr = arr.slice(removeLength);//从指定位置开始复制数组，一直到最后
			tempUrl = arr[1] + urlSplitChar + newArr.join(urlSplitChar);//保留原来数组中第一个路径（portal进入的路径）
		}
        setGlobalVar("GLOBALURLPATH", tempUrl);
		var tempUrl = getGlobalVar("GLOBALURLPATH");
    },
    getUrl : function(_index) {//返回上一路径
        var tempUrl = getGlobalVar("GLOBALURLPATH");
        var tuArr = tempUrl.split(urlSplitChar);
        var tl = tuArr.length;
        var tul;
        if(_index){
        	for(var i = 0; i < _index; i++){
        		tul = tuArr.pop();
        	}
        }else{
        	tul = tuArr.pop();
        }
        if(!tul || tul == "") {
            tul = getGlobalVar("PORTAL_ADDR");
        }
        var newUrl = tuArr.join(urlSplitChar);
        setGlobalVar("GLOBALURLPATH", newUrl);
        location.href = tul;
    },
    cleanUrl : function() {
        setGlobalVar("GLOBALURLPATH", "");
    }
};

/**
 * @description showTime 用于页面中时间，日期的显示
 * @param {string} _objId 可以是2D页面中的时间对象，也可以是div中的id
 */
var showTime = {
    init : function() {
        if($("time")) {
            this.getTime();
            setInterval(this.getTime, 60000);
        }
    },
    getTime : function() {
        var date = new Date();      
        var hour = date.getHours();
        var minute = date.getMinutes();
        hour = hour < 10 ? "0" + hour : hour;
        minute = minute < 10 ? "0" + minute : minute;
        var time_ = hour + ":" + minute;
        if($("week")){
        	var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        	var week_ = week[date.getDay()];
        	$("week").innerHTML = week_;	
        }
        if($("date")) {
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var day = date.getDate();
	        month = month < 10 ? "0" + month : month;
	        day = day < 10 ? day = "0" + day : day;
	        //var day_ = year + "." + month + "." + day;
			var day_=month+"月"+day+"号";
            $("date").innerHTML = day_;
        }
       	$("time").innerHTML = time_;
    }
};

/**
 * @description GetXmlHttpObject ajax请求时状态判断
 * @param {function} _handler 回调函数
 */

//var xmlHttp;
function GetXmlHttpObject(_handler) {
	var objXmlHttp = null;
	if(window.XMLHttpRequest) {
		objXmlHttp = new XMLHttpRequest();
	} else {
		if(window.ActiveXObject) {
			objXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	objXmlHttp.onreadystatechange = function() {
		if(objXmlHttp.readyState == 4) {
			if(objXmlHttp.status == 200 || objXmlHttp.status == 0) {
				callBackData(xmlHttp, _handler);
			} else {
				//超时间方法,传入空会自动弹出服务器忙的提示
				//showMsg("","系统忙,请稍候重试。");
			}
		}
	};
	return objXmlHttp;
}

/**
 * @description GetXmlHttpObject ajax请求时状态判断
 * @param {function} _handler 回调函数
 */

function AjaxUrl(url, handler) {
	this.xmlHttp = null;
	this.createXMLHttpRequest = function() {
		if (window.ActiveXObject) {
			this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		} else {
			this.xmlHttp = new XMLHttpRequest();
		}
	}
	this.getData = function() {
		this.createXMLHttpRequest();
		var xmlhttp = this.xmlHttp;
		var obj = new Object();
		this.xmlHttp.open("get", url, true);
		this.xmlHttp.send(null);
		this.xmlHttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {				
				if (xmlhttp.status == 200 || xmlhttp.status == 0) {
					callBackData(xmlhttp, handler);
				}else{
					showErrorMessage("系统繁忙！", false);
				}
			}
		};
	}
	this.getData();
}

function AjaxUrlPost(url, handler, param) {
	this.xmlHttp = null;
	this.createXMLHttpRequest = function() {
		if (window.ActiveXObject) {
			this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		} else {
			this.xmlHttp = new XMLHttpRequest();
		}
	}
	this.getData = function() {
		this.createXMLHttpRequest();
		var xmlhttp = this.xmlHttp;
		var obj = new Object();
		this.xmlHttp.open("post", url, true);
		this.xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		this.xmlHttp.send(param);
		this.xmlHttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200 || xmlhttp.status == 0) {
					callBackData(xmlhttp, handler);
				}
			}
		};
	}
	this.getData();
}
/**
 * @description callBackData 对ajax返回的数据进行统一的处理
 * @param {object} xmlHttp 为ajax返回xmlHttp对象
 * @param {function} _handler 当请求的数据成功返回时，为页面的回调函数
 */

function callBackData(_xmlHttp, _handler) {
	var resText = parseJSON(_xmlHttp.responseText);
	if (!_xmlHttp.responseText || _xmlHttp.responseText.indexOf("errMessage") >= 0) { //返回错误数据
		isComeFrom = "Ajax";
		showErrorMessage("系统繁忙！", false);
		getErrorMsg(resText.data.errMessage[0]);
	} else { //返回正常数据时
		_handler(resText);
	}
}


/**
 * @description ajaxUrl ajax请求函数，与服务器进行数据交互
 * @param {string} _callbackfun 回调函数
 */

function ajaxUrl(_url, _callbackfun) {
	//var xmlHttp;
	var xmlHttp = GetXmlHttpObject(_callbackfun);
	xmlHttp.open("GET", _url, true);
	xmlHttp.send(null);
}

/**
 * @description 此函数的作用是解析ajax返回的json，将数据变为json对象
 * @param {string} _data ajax返回xmlHttp.responseText
 */

function parseJSON(_data) {
	if( typeof _data !== "string" || !_data) {
		return null;
	}
	if(window.JSON && window.JSON.parse) {
		return window.JSON.parse(_data);
	} else {
		return eval("(" + _data + ")");
	}
}

function Ajax(url,dosth) {
	this.xmlHttp = null;
	this.createXMLHttpRequest = function () {
		if (window.ActiveXObject) {
			this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		else {
			this.xmlHttp = new XMLHttpRequest();
		}
	}
	this.getData = function () {
		this.createXMLHttpRequest();
		var xmlhttp = this.xmlHttp;
		var obj = new Object();
		this.xmlHttp.open("get", url, true);
		this.xmlHttp.send(null);
		this.xmlHttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200 || xmlhttp.status == 0) {
					var data = parseJSON(xmlhttp.responseText);	//将字符串转换为对象
					dosth(data);								//返回数据
				}
			}
		}
	}
	this.getData();
}

/**
 * @description callBackData 对ajax返回的数据进行统一的处理
 * @param {object} xmlHttp 为ajax返回xmlHttp对象
 * @param {function} _handler 当请求的数据成功返回时，为页面的回调函数
 */



/** @description goToPortal 对业务的整体键值进行监听*/
//document.onkeypress = grabEvent;
document.onkeydown = grabEvent;
var keycode;
function grabEvent(_e) {
	if(isPressBack){
		isPressBack = false;
		doExitEvent();
		return;
	}
	keycode = _e.keyCode || _e.which;
	//debug({"keycode":keycode});
	if(tipFlag) {
		switch(keycode) {
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.QUIT:
				_e.preventDefault();				
				closeTip();				
				break;
		}
	} else if(mediaTipFlag) {//弹出集数选择框
		switch(keycode) {
			case KEY.ENTER:
			case KEY.ENTER_N:
				doMediaConfirm();
				break;
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.QUIT:
				_e.preventDefault();
				closeTip();
				break;
			case KEY.LEFT:
			case KEY.LEFT_N:
				_e.preventDefault();
				moveMediaLeft();
				break;
			case KEY.RIGHT:
			case KEY.RIGHT_N:
				_e.preventDefault();
				moveMediaRight();
				break;
			case KEY.NEXT:
			case KEY.NEXT_N:
				turnNextMediaPage();
				break;
			case KEY.PREV:
			case KEY.PREV_N:
				turnPrevMediaPage();
				break;
		}
	} else {
		switch(keycode) {
			case KEY.ONE:
			case KEY.TWO:
			case KEY.THREE:
			case KEY.FOUR:
			case KEY.FIVE:
			case KEY.SIX:
			case KEY.SEVEN:
			case KEY.EIGHT:
			case KEY.NINE:
			case KEY.ZERO:
				doNumberKey(keycode);
				break;
			case KEY.UP:
			case KEY.UP_N:
				moveUp();
				break;
			case KEY.DOWN:
			case KEY.DOWN_N:
				moveDown();
				break;
			case KEY.LEFT:
			case KEY.LEFT_N:
				moveLeft();
				break;
			case KEY.RIGHT:
			case KEY.RIGHT_N:
				moveRight();
				break;
			case KEY.NEXT:
			case KEY.NEXT_N:
				turnNextPage();
				break;
			case KEY.PREV:
			case KEY.PREV_N:
				turnPrevPage();
				break;
			case KEY.ENTER:
			case KEY.ENTER_N:
				doConfirm();
				break;
			case KEY.PLAY:
			case KEY.PLAY1:
			case KEY.PLAY_N:
				doPlayKey();
				break;
			case KEY.BACK:
			case KEY.RETURN:
				doEvent.back();
				_e.preventDefault();
				break;
			case KEY.RED:
			case KEY.RED_N:
			case KEY.RED_T:
				doEvent.red();
				break;
			case KEY.YELLOW:
			case KEY.YELLOW_N:
			case KEY.YELLOW_T:
				doEvent.yellow();
				break;
			case KEY.BLUE:
			case KEY.BLUE_N:
			case KEY.BLUE_T:
				doEvent.blue();
				break;
			case KEY.GREEN:
			case KEY.GREEN_N:
			case KEY.GREEN_T:
				 _e.preventDefault();
				doEvent.green();
				break;
			//case KEY.QUIT_N:
			case KEY.QUIT:
				_e.preventDefault();
				doEvent.home();
				break;
			case KEY.SEARCH:
			    _e.preventDefault();
				doEvent.position();
				break;
			case KEY.STATIC:
				if(videoObj != undefined){
					videoObj.resetStatic();
				}
				break;
			case KEY.VOICEUP:
			case KEY.VOICEDOWN:
				if(videoObj != undefined){
					if(!isDisplayVoice()){
						voice.displayVoice(true);
					}else{
						doVoice(keycode, _e);
					}
				}
				break;
			default:
				break;
		}
	}
}


var doEvent = {
    /** @description  红色键处理函数*/
    red : function() {
        goTo.myZone();
    },
    /** @description  绿色键处理函数*/
    green : function() {
		goTo.search();
    },
    /** @description  黄色键处理函数*/
    yellow : function() {

    },
    /** @description  蓝色键处理函数*/
    blue : function() {
        goTo.top();
    },
    /** @description  返回键处理函数*/
    back : function(_index) {
        goTo.back(_index);
    },
    /** @description  主页键处理函数*/
    home : function() {
        goTo.portal();
    },
    /** @description  定位键处理函数*/
    position : function() {
        goTo.search();
    }
};

/** @description 页面静态跳转*/
var goTo = {
    /** @description  返回上一目录*/
    back : function(_index) {
    	globalPath.getUrl(_index); 
        setGlobalVar("isBack", "Y");
    },
    portal : function(){
  window.location.href =getGlobalVar("PORTAL_ADDR");//"index.html";
  //	window.location.href = //"file:////workdir/mnt/hd/HDD0/flash/portal_2.0/Context/index.htm";
    }
};


//****************时间秒转换为00：00：00格式**********************
function convertToShowTime(second) {
    if (isNaN(second) || second < 0) second = 0;
    var hh = parseInt(second / 3600);
    var mm = parseInt((second % 3600) / 60); 
    var ss = (second % 3600) % 60;
    return addZero(hh) + ":" + addZero(mm) + ":" + addZero(ss);
}
function addZero(val) {
    if (val < 10) return "0" + val;
    return val;
}
/**
 * @description subText 汉字与字符都都在时截取长度
 * @param {string} _str 需要截取的字符串
 * @param {string} _subLength 页面上展示字符串的长度（汉字个数*2）
 * @param {number} _num 是否滚动（num等于0时字符截取，num等于1时数据进行滚动）
 */

IEPG.subText = function(_str, _subLength, _num) {
	var temp1 = _str.replace(/[^\x00-\xff]/g, "**");
	var temp2 = temp1.substring(0, _subLength);
	var x_length = temp2.split("\*").length - 1;
	var hanzi_num = x_length / 2;
	_subLength = _subLength - hanzi_num;
	var res = _str.substring(0, _subLength);
	if(_num === 0) {
		if(_subLength < _str.length) {
			res = res + "...";
		}
		return res;
	} else {
		if(_subLength < _str.length) {
			return "<marquee  behavior=\"alternate\" scrollamount=\"3\">"+"&nbsp;"+_str+"&nbsp;"+"</marquee>";
		}
		return _str;
	}
};
//******************************* 取url中的相关参数  **********************************************
//获取url中param参数的值  例子：var serviceCode = getQueryStr(location.href, "serviceCode");
function getQueryStr(_url, _param){
	var rs = new RegExp("(^|)" + _param + "=([^\&]*)(\&|$)", "g").exec(_url), tmp;
	if( tmp = rs){
	    return tmp[2];
	}
	return "";
}

/*替换字符串中参数的值searchStr：查找的字符串，replaceVal：替换的变量值
 var backUrl=backUrl.replaceQueryStr(breakpointTime,"vod_ctrl_breakpoint");
 */
String.prototype.replaceQueryStr = function(_replaceVal, _searchStr) {
	var restr = _searchStr + "=" + _replaceVal;
	var rs = new RegExp("(^|)" + _searchStr + "=([^\&]*)(\&|$)", "g").exec(this), tmp;
	var val = null;
	if( tmp = rs){
		val = tmp[2];
	}
	if(val == null) {
		if(this.lastIndexOf("&") == this.length - 1){
			return this + restr;
		}else if(this.lastIndexOf("?") >= 0){
			return this + "&" + restr;
		}
		return this + "?" + restr;
	}
	var shs = _searchStr + "=" + val;
	if(this.lastIndexOf("?" + shs) >= 0){
		return this.replace("?" + shs, "?" + restr);
	}
	return this.replace("&" + shs, "&" + restr);
};

//页面做分页处理时，pageLength：总数据长度，pageSize：页面可显示的数据长度
function getMaxPage(_pageLength, _pageSize) {//求最大页数
	if(_pageLength == 0 || _pageLength == undefined) {
		return 0;
	}
	if(_pageLength % _pageSize != 0) {
		return Math.ceil(_pageLength / _pageSize);
	}
	return _pageLength / _pageSize;
}

function getMaxPageSize(_pageLength, _pageSize) {//求为最大页数时pagesize
	if(_pageLength == 0 || _pageLength == undefined) {
		return 0;
	}
	if(_pageLength % _pageSize != 0) {
		return _pageLength % _pageSize;
	}
	return _pageSize;
}

//******************************* 真焦点处理 *********************************
var inputsStates;// inputs 标签状态保存
//将页面上所有的标签都设为可用
function enabledAll() {//所有 input 标签
	var inputs = document.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = inputsStates[i];
	}
}

//将页面上所有的标签都设为不可用
function disabledAll() {//所有 input 标签
	var inputs = document.getElementsByTagName("input");
	inputsStates = new Array(inputs.length);
	for(var i = 0; i < inputs.length; i++) {
		inputsStates[i] = inputs[i].disabled;
		inputs[i].disabled = true;
	}
}

function substringText(str,sub_length,targerElementName,num)
{
    var timeFlag = 0;
    var txtSpan1 = "";
    var txtSpan2 = "";
    var windowDiv  = "";
    var topDiv =  "";
    var fontSize = 20; //当前元素限定字体的大小
    var textLength = 0;
    var speed = 30; // 滚动的速度

    function doWithString(str,sub_length,targerElementName,num)
    {		//汉字与字符都都在时截取长度
        var temp1 = str.replace(/[^\x00-\xff]/g,"**");
        var temp2 = temp1.substring(0,sub_length);
        var x_length = temp2.split("\*").length - 1 ;
        var hanzi_num = x_length /2 ;
        sub_length = sub_length - hanzi_num ;//实际需要sub的长度是总长度-汉字长度
        var res = str.substring(0,sub_length);
        if(num==0)
        {
            if(sub_length < str.length )
            {
                res = res;
                createNormalDiv(targerElementName,res);
            }else
            {
                createNormalDiv(targerElementName,str);
            }
        }else
        {
            if(sub_length < str.length )
            {
                createScrollDiv(targerElementName,str);
            }else
            {
                createNormalDiv(targerElementName,str);
            }
        }
    }
    function createNormalDiv(targerElementName,text)
    {

    }
    function createScrollDiv(divName,text)
    {
        initElement(divName,text);
        window.setInterval(Marquee,speed);
    }
    function initElement(divName,text)
    {
        textLength = text.replace(/[^\x00-\xff]/g,"**").length;
        topDiv = document.getElementById(divName);
        topDiv.innerText = ' ';
        var childNodes = topDiv.getElementsByTagName("span");
        if(childNodes.length == 0)
        {
            for(var i=0; i<childNodes.length; i++)
            {
                topDiv.removeChild(childNodes[i]);
            }
        }
        windowDiv = document.createElement("div");
        txtSpan1 = document.createElement("span");
        txtSpan2 = document.createElement("span");

        windowDiv.appendChild(txtSpan1);
        windowDiv.appendChild(txtSpan2);
        topDiv.appendChild(windowDiv);

        windowDiv.style.position = "absolute";
       // windowDiv.style.width = topDiv.offsetWidth + "px";
        //windowDiv.style.width = "100px";//310
		windowDiv.style.width = $(targerElementName).offsetWidth+"px";
        windowDiv.style.height = "391px";
        windowDiv.style.overflow = "hidden";
        windowDiv.className=topDiv.className;
        //windowDiv.style.top=(topDiv.offsetTop) + "px";
        windowDiv.style.lineHeight="39px";
        windowDiv.style.textAlign="left";

        txtSpan1.innerHTML = text;
        txtSpan1.style.float = "left";
       // txtSpan1.style.textAlign="left";
        txtSpan1.style.paddingLeft="10px";
        txtSpan1.style.width = fontSize*textLength/2  + windowDiv.offsetWidth + "px";
        txtSpan1.style.display = "block";
        txtSpan1.style.wordWrap = "normal";
        txtSpan1.style.overflow = "hidden";
        txtSpan1.style.fontSize=fontSize+"px";

        txtSpan2.innerHTML = text;
        txtSpan2.style.position = "absolute";
       // txtSpan2.style.textAlign="left";
        txtSpan2.style.paddingLeft="10px";
        txtSpan2.style.left = windowDiv.offsetWidth + "px";
        txtSpan2.style.width = fontSize*textLength/2  + windowDiv.offsetWidth + "px";
        txtSpan2.style.display = "none"
        txtSpan2.style.fontSize=fontSize+"px";

    }
    function Marquee()
    {
        if(timeFlag == 0)
        {
            if(txtSpan1.offsetWidth - windowDiv.offsetWidth - windowDiv.scrollLeft<=0)
            {
                txtSpan1.style.display = "none";
                txtSpan2.style.display = "block"
                windowDiv.scrollLeft = 0;
                timeFlag = 1;
            }else
            {
                windowDiv.scrollLeft++;
            }
        }else
        {
            if(txtSpan2.offsetWidth - windowDiv.scrollLeft<=0)
            {
                windowDiv.scrollLeft = 0;
            }else
            {
                windowDiv.scrollLeft++;
            }
        }
    }
    doWithString(str,sub_length,targerElementName,num);
}

/*
 * @description debug函数为页码打印方式，可以替代alert对页面效果的影响。一个htm只能有一个Debug函数。
 * @param {object} _configs 可以为Array或者为json对象。
 */
function debug(_configs) {
    var paramArr = [], debugType = "0", arrLength;
    if( typeof _configs != "object") {
        return;
    }
    arrLength = _configs.length;
    if(arrLength == undefined) {
        var i = 0;
        for(var key in _configs) {
            paramArr[i] = key + "=" + _configs[key];
            i++;
        }
        arrLength = paramArr.length;
        debugType = "1";
    } else {
        arrLength = _configs.length;
    }
    var newDiv = document.createElement("div");
    newDiv.setAttribute("id", "DEBUG");
    newDiv.setAttribute("style", "background:#D6D6D6; width:auto; heigth:auto; position:absolute; left:50px; top:50px;")
    document.body.appendChild(newDiv);
    var obj = document.getElementById("DEBUG");
    for(var i = 0; i < arrLength; i++) {
        var testDiv = document.createElement("div");
        testDiv.setAttribute("id", "MSG_" + i);
        if(i % 2 == 0) {        //偶数样式
            testDiv.setAttribute("style", "background:#A9A9A9;");
        }
        if(debugType == "0") {  //为数组
            testDiv.innerHTML = "No." + i + " ==== " + _configs[i];
        } else {                //为json对象
            var arr = paramArr[i].split("=");
            testDiv.innerHTML = arr[0] + " ==== " + arr[1];
        }
        obj.appendChild(testDiv);
    }
}

var ajax = function(param) {
    var url = param.url || "";
    var method = param.method || "get";
    var data = param.data || "";
    var handler = param.handler;
    var xmlHttp = this.createXMLHttp(method);
    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == 4) {// 已收到响应
            if(xmlHttp.status == 200) {// 请求成功
                callBackData(xmlHttp, handler);
            } else {
                //超时间方法,传入空会自动弹出服务器忙的提示
                showMsg("", "系统忙,请稍候重试。");
            }
        }
    };
    xmlHttp.open(method, url, true);
    if(method.toLowerCase() == "post") {
        xmlHttp.send(data);
    } else {
        xmlHttp.send(null);
    }
};
function createXMLHttp(method) {
    if(window.XMLHttpRequest) {
        XMLHttp = new XMLHttpRequest();
        //if(XMLHttp.overrideMimeType && method.toLowerCase() == "post") {
        //   XMLHttp.overrideMimeType('text/xml');
        // }
    } else if(window.ActiveXObject) {
        var ActiveXObj = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
        for(var i = 0; i < ActiveXObj.length; i++) {
            try {
                XMLHttp = new ActiveXObject(ActiveXObj[i]);
                if(XMLHttp) {
                    return XMLHttp;
                }
            } catch (e) {
            }
        }
    }
    return XMLHttp;
}

function getCharLength(str){	
	var temp1 = str.replace(/[^\x00-\xff]/g, "**");
	return temp1.split("\*").length - 1;
}


/**
 * @description 焦点滑动实现函数
 * @param {String}
 *            _divId 滑动的焦点层ID
 * @param {Number}
 *            _preTop 滑动前的top值
 * @param {Number}
 *            _top 滑动后的top值
 * @param {String}
 *            _moveDir 滑动方向，V纵向，H横向
 * @param {Number}
 * 			  _percent 滑动系数  默认0.7
 * @return null
 */
function slide(_divId, _preTop, _top, _moveDir, _percent) {
    if( typeof (_divId) != 'undefined' && typeof (_preTop) != 'undefined' && typeof (_top) != 'undefined' && typeof (_moveDir) != 'undefined') {
        this.focusId = _divId;
        this.preTop = _preTop;
        this.focusTop = _top;
        this.moveDir = _moveDir;
    }
    var moveStep = (this.focusTop - this.preTop) * _percent;
    if(Math.abs(moveStep) > 3) {
        this.preTop += moveStep;
        if(this.moveDir == "V") {
            $(this.focusId).style.top = this.preTop + "px";
        } else {
            $(this.focusId).style.left = this.preTop + "px";
        }
        clearTimeout(this.slideTimer);
        this.slideTimer = setTimeout(slide, 1);
    } else {
        if(moveDir == "V") {
			try{
            	$(this.focusId).style.top = this.focusTop + "px";
			}catch(e){}
        } else {
            $(this.focusId).style.left = this.focusTop + "px";
        }
    }
}

var turnHeight=0,totalHeight=0,totalPages=0,currentPage=1,currentPos=0;
var show = {
		page:function(){
			turnHeight = $("outId").offsetHeight;
			totalHeight = $("inId").offsetHeight;
			totalPages = Math.ceil(totalHeight/turnHeight);
			if(totalPages==0){
				$("curPage").innerHTML="0";
				$("totalPage").innerHTML="0";
			}
			else{
				$('page').innerHTML = '第' + currentPage + '/' + totalPages + '页';
			}
				
		},
		turnPage:function(direction){
			if(direction>0){   //下翻
				if(currentPage>=totalPages){
					currentPage=1;  
					currentPos=0;
				}else{
					currentPos-=turnHeight*direction;
					currentPage+=direction;
				}					
			}else if(direction<0){  //上翻
				if(currentPage<=1){
					currentPage=totalPages;
					currentPos=-turnHeight*(totalPages-1);
				}else{
					currentPos+=-turnHeight*direction;
					currentPage+=direction;
				}
			}
			$('page').innerHTML = '第' + currentPage + '/' + totalPages + '页';
			$("inId").style.top=currentPos+"px";
		}
    }
	
function init(){
	subText("divTest", "谢谢你的光临！！", 1);
}	

function subText(_id, _str, _flag) {
	document.getElementById(_id).style.overflow = "hidden";
	var tmpDivHeight    = document.getElementById(_id).offsetHeight;
	document.getElementById(_id).innerHTML = '<div id = "scroolSpan_' + _id + '" name = "scroolSpan" style="visibility: hidden; line-height: ' + tmpDivHeight + 'px;">' + _str + '</div>';	
	showText(_flag, _id);		
};

var timeArray = [];

function inArrayTimer(_name, _array){
	for(var i = 0; i < _array.length; i++){
		if(_array[i].name == _name){
			return i;
		}
	}
	return -1;
}

function showText(_flag, _id){
	var tmpSpanObject   = document.getElementById("scroolSpan_" + _id);
	var tmpDivObject    = document.getElementById(_id);
	var tmpScroolHeight = tmpSpanObject.offsetHeight;
	var tmpScroolWidth  = tmpSpanObject.offsetWidth;
	var tmpDivHeight    = tmpDivObject.offsetHeight;
	var tmpDivWidth     = tmpDivObject.offsetWidth;
	if(_flag == 0){
		var tmpTimerFocus = inArrayTimer(tmpSpanObject.id + "_timer", timeArray);
		if(tmpTimerFocus != -1){
			clearInterval(timeArray[tmpTimerFocus].timer);
			timeArray.splice(tmpTimerFocus, 1);
		}		
		if(tmpScroolHeight > tmpDivHeight){
			tmpFontSize = tmpDivObject.style.fontSize;
			if(tmpFontSize){
				tmpLength = tmpScroolWidth / parseInt(tmpFontSize) * 2;						
			}else{
				tmpLength = tmpScroolWidth / 8;
			}
			var tmpHTML = tmpSpanObject.innerHTML;		
			tmpSpanObject.innerHTML = tmpHTML.substring(0, Math.ceil(tmpLength)) + "...";
			var tmpTimer = setInterval(function(){
				if(tmpSpanObject.offsetHeight > tmpDivHeight){
					tmpHTML = tmpSpanObject.innerHTML.split("...")[0];
					tmpSpanObject.innerHTML = tmpHTML.substring(0, tmpHTML.length - 1) + "...";
				}else{
					tmpSpanObject.style.visibility = "visible";
					clearInterval(tmpTimer);
				}
			}, 10);		
		}else{
			tmpSpanObject.style.visibility = "visible";
			return false;
		}			
			
	}else if(_flag == 1){
		tmpSpanObject.style.visibility = "visible";
		if(tmpScroolHeight > tmpDivHeight){
			scrollSpan(tmpSpanObject, tmpDivObject, tmpScroolHeight, tmpScroolWidth, tmpDivHeight, tmpDivWidth);
		}
	}else{
		tmpSpanObject.style.visibility = "visible";
		if(tmpScroolHeight > tmpDivHeight){	
			scrollSpan(tmpSpanObject, tmpDivObject, tmpScroolHeight, tmpScroolWidth, tmpDivHeight, tmpDivWidth);
		}else{
			scrollSpan(tmpSpanObject, tmpDivObject, tmpScroolHeight, tmpScroolWidth, tmpDivHeight, tmpDivWidth);			
		}
	}		
};

function scrollSpan(tmpSpanObject, tmpDivObject, tmpScroolHeight, tmpScroolWidth, tmpDivHeight, tmpDivWidth){
	var i = 1;
	timeArray.push({
		name : tmpSpanObject.id + "_timer",
		timer: ""
	});
	for(; tmpSpanObject.offsetHeight > tmpDivHeight; ){
		i++;
		tmpSpanObject.style.width = tmpDivWidth * i + "px";		
		if(tmpSpanObject.offsetHeight <= tmpDivHeight){
			var tmpHTML = tmpSpanObject.innerHTML;
			var tmpTimer = setInterval(function(){				
				tmpHTML += "&nbsp;";
				tmpSpanObject.innerHTML = tmpHTML;
				if(tmpSpanObject.offsetHeight > tmpDivHeight){			
					tmpSpanObject.innerHTML = tmpHTML + tmpHTML.substring(0, tmpHTML.length-6);					
					tmpSpanObject.style.width = tmpDivWidth * i * 2 + "px";
					clearInterval(tmpTimer);			
					var tmpLeft = tmpDivWidth * i;
					timeArray[timeArray.length-1].timer = setInterval(function(){	
						if(tmpDivObject.scrollLeft > tmpLeft + 28){
							tmpDivObject.scrollLeft = 0;
						}else{
							tmpDivObject.scrollLeft += 2;
						}
					}, 100);	
				}
			}, 5);		
		}		
	}
		
}

function changeImg(method, element1, element2, func){
	element1.parentNode.style.overflow = "hidden";
	var currentWidth, currentHeight;
	var totalWidth, totalHeight;
	var time = 30;
	var frag = 15;
	var currentFrag = 1;
	totalWidth = element1.width;	
	totalHeight = element1.height;
	currentWidth = totalWidth;	
	currentHeight = totalHeight;
	var startChange = function(){
		if(method == 1){
			horizontalChange(element1, element2);
		}
		else if(method == 2){
			verticalChange(element1, element2);
		}
	};
	
	var horizontalChange = function(element1, element2){
		timer = setInterval(function(){
			if(currentWidth <= 0){
                                
				element1.style.left = "0px";
				element2.style.left = "0px";
				isOverPageChange = true;
                               
				clearInterval(timer);
                                func();
								
				return;
			}
			currentWidth = Math.floor(totalWidth - totalWidth*currentFrag/frag);
			currentFrag++;
			element1.style.left = currentWidth-totalWidth + "px";
			element2.style.left = currentWidth + "px";	
	                element2.style.display = "block";	
		}, time);
	};		
	
	var verticalChange = function(element1, element2){
		if(currentHeight == 0){
                        
			element1.style.top = "0px";
			element2.style.top = "0px";
			isOverPageChange = true;
			clearInterval(timer);
                        func();
		        element2.style.display = "none";
						
						
						
			return;
		}
		currentHeight = Math.floor(totalHeight - totalHeight*currentFrag/frag);
		currentFrag++;
		element1.style.top = currentHeight-totalHeight + "px";
		element2.style.top = currentHeight + "px";
                element2.style.display = "block";
		timer = setInterval(function(){
			verticalChange(element1, element2);
		}, time);
	};
	
	startChange();
}