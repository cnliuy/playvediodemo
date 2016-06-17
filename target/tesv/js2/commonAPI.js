var dataUrl = "http://10.105.8.96:8180";//修改服务器地址
//var dataUrl = "http://10.10.92.6:8183";//修改服务器地址

/**
 * @description 页面在取数据时，涉及到所有URL前缀接口部分 。
 * @param {string}
 * URL.VOD_getRootContent为接口URL,注所有"键"都是以模块名称加"_"开头，如"VOD_"，以接口方法名结尾"getRootContent",取根栏目接口方法名
 * @param {string} "/column/columnAction!getRootContent.action" 根栏目数据请求接口
 * @return 共48个接口URL
 */

var URL = {
		/**********   民意调查获取问卷    **********/
		"MYDC_getTestList" : "/traffic/Satis!getQuestionnaireByBu.action?businessId=1",
		/**********   民意调查获取试题    **********/
		"MYDC_getQuestionList" : "/traffic/Satis!getQuestionByNaireid.action",	
	    /**********   保存问题及选项    **********/
		"MYDC_saveQuestionAndAnswer" : "/traffic/Satis!saveDatas",
	    /**********   问题统计    **********/
		"MYDC_othersQuestionsAnswer" : "/traffic/Satis!statisUserSelect",
	    /**********   尾号查询    **********/
	    "WHCX_GetTailNumber" : "/traffic/selectNumber!query.action", 
	    /**********   车辆违法查询 | 驾驶人违法查询   **********/
	    "XXCX_QueryByCar"    : "/traffic/bindCar!queryCar.action",
	    /**********   车辆绑定 | 车辆修改  **********/
	    "XXCX_BindingByCarResult"    : "/traffic/bindCar!bindCar.action",
	    /**********   驾驶人绑定 | 驾驶人修改  **********/
	    "XXCX_BindingByNameResult"    : "/traffic/bindUser!bindUser.action",  
	    
	    /**********   车辆修改  **********/
	    "XXCX_UpdateByCarResult"    : "/traffic/bindCar!updateCar.action",
	    /**********   驾驶人修改  **********/
	    "XXCX_UpdateByNameResult"    : "/traffic/bindUser!updateUser.action",  
	    
	    /**********   删除绑定用户   **********/
	    "XXCX_DeleteByNameResult"    : "/traffic/bindUser!deleteUser.action",
	    /**********   删除绑定车牌号   **********/
	    "XXCX_DeleteByCarResult"    : "/traffic/bindCar!deleteCar.action",
	    /**********   根据身份证号，查询违法记录数   **********/
	    "XXCX_QueryRecordByID"    : "/traffic/QueryUser!queryUserVioSurvei.action",
	    /**********   根据车牌号，查询违法记录数   **********/
	    "XXCX_QueryRecordByCar"    : "/traffic/QueryCar!queryCarVioSurvei.action",
	    
	    
	    /**********   学习助手接口     *************/
	    /**********   顺序查询接口科目一   **********/
	    "XXZS_QueryExamByOrder"    : "/ttqbms/subject1/getByNormal",
	    /**********   随机查询接口科目一   **********/
	    "XXZS_QueryExamByRandom"    : "/ttqbms/subject1/getByRand",
	    /**********   章节查询类型接口科目一   **********/
	    "XXZS_QueryKindByChapter"    : "/ttqbms/subject1/getChapter",
	    /**********   用户进度查询   **********/
	    "XXZS_QueryProgress"    : "/ttqbms/getProgress/",
	    /**********   用户进度增加   **********/
	    "XXZS_AddProgress"    : "/ttqbms/addProgress",
	    /**********   用户进度修改   **********/
	    "XXZS_UpdateProgress"    : "/ttqbms/updateProgress",
	    /**********   用户进度删除   **********/
	    "XXZS_DeleteProgress"    : "/ttqbms/delProgress",
	    /**********   章节试题查询接口科目一   **********/
	    "XXZS_QueryExamByChapter"    : "/ttqbms/subject1/getByChapter",
	    
	    /**********   顺序查询接口科目四   **********/
	    "XXZS_QueryExamByOrder4"    : "/ttqbms/subject4/getByNormal",
	    /**********   随机查询接口科目四   **********/
	    "XXZS_QueryExamByRandom4"    : "/ttqbms/subject4/getByRand",
	    /**********   章节查询类型接口科目四   **********/
	    "XXZS_QueryKindByChapter4"    : "/ttqbms/subject4/getChapter",
	    /**********   章节试题查询接口科目四   **********/
	    "XXZS_QueryExamByChapter4"    : "/ttqbms/subject4/getByChapter",
};



IEPG.getData = function(_APIUrl, _configs) {
    var paramUrl;
    if( typeof _configs.param == "object") {
        paramUrl = "?" + IEPG.param(_configs.param);
    } else {
        paramUrl = "";
    }
    paramUrl = dataUrl + _APIUrl + paramUrl;
    new AjaxUrl(paramUrl, _configs.callBack);
};

IEPG.getDataPost = function(_APIUrl, _configs){
	 new AjaxUrlPost(dataUrl+_APIUrl, _configs.callBack, _configs.data);
};
/**
 * @description
 * 此函数作用是json对象中的"键"与"值"进行分离提取并用"&"相连，json格式为{key:value,key:value}，value为string或number类型
 * @param {string} _configs 根据数据API接口需要，传入参数对象,此时为VOD_getRootContent.param。比如
 *	var VOD_getRootContent =
 *	{
 *		"param" :
 *		{
 *			"columnCode" : "gqhddb",
 *			"siteId" : "1"
 *		},
 *		"callBack" : getRootColumn
 *	};
 */

IEPG.param = function(_configs) {
    var i = 0;
    var paramArr = [];
    for(var key in _configs) {
        paramArr[i] = encodeURIComponent(key) + "=" + encodeURIComponent(_configs[key]);//搜索输入框的汉字需要编码
        i++;
    }
    return paramArr.join("&");
};

/* 
 *@description 购买及播放的对象定义（列表直接按播放键时不需在页面定义）
 */

/**
 * @description 购买提示的回调函数
 * @param {object} _dataJson ajax返回数据后解析的json对象
 */

function buyTip(_dataJson) {
    var tipMsg = "您好！您选择了(" + Buy.assetName + ")，价格为人民币" + _dataJson.discountedPrice + "元，购买后在" + _dataJson.chargeTerm + "之内任何时间可以观看，是否要购买?";
    showMsg(epgUrl + "tip/a_buyTip.htm", tipMsg);
}

/**
 * @description 购买的回调函数
 * @param {object} _dataJson ajax返回数据后解析的json对象
 */
