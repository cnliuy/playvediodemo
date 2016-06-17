var listData = [
	                {title : "天津大道", pic : "images/index_pic1.jpg"},
	                {title : "城厢东路", pic : "images/index_pic2.jpg"},
	                {title : "快速路",   pic : "images/index_pic3.jpg"},
	                {title : "京津高速", pic : "images/index_pic4.jpg"}
                ];


var menuFocus = 0, menuSize = 8, curPage = 1, totalPage;
var menuData = [], menuCurData = [];

var listFocus = 0, listSize = 4, listCurPage = 1, listTotalPage;
var listCurData = [];
var recData = [];
var areaTip = 0;
var menuObj, listObj;

var ad1Data = {}, ad2Data = {}, ad3Data = {}; 

var config = {		
	MENU:{
		"focusId" : "menuFocus",
		"focusIndex" : menuFocus,          
        "size" : menuSize,
        "iterator" : showMenu,
        "onFocus" : onMenuFocus,
        "onBlur" : onMenuBlur,
        "moveDir" : "V",
        "focusTop" : 6, //0626修改，原始数据61
        "focusStep" : 63,
        "isLoop" : true,
        "isFocusFix" : false
	}			
};
Object.extend(MultiMove, Menu);
Object.extend(MultiMove, List);

function init(){
	if(getGlobalVar("isBack") == "Y"){
		getAllGlobalVar();
		clearAllGlobalVar();
	}
	getJSONData();
	playmedia();//0918add
}

function getJSONData(){
	getData.getMenuData(function(_menuData,_recData) {	//获取栏目数据
		menuData=_menuData;
		recData = _recData;
		initTime();
		//initAD();0702
		getAdTip();//0702
		initMenu();
		createLi();
		$("adpic1").src = ad3Data[0].adBackPic;
		$("adpic2").src = "";
		initList(0);
	});
}


function createLi(){
	var html = "";
	for(var i = 0; i < ad3Data.length; i++){
		html += '<li id="scrollpage_'+i+'"">'+'</li>';
	}
	var offsetWidth = $('scrollpage').offsetWidth;
	var left = parseInt((offsetWidth  - 45 * ad3Data.length) / 2);
	$("scrollpage").style.left = left + "px";
	$("scrollpage").style.width = 45 * ad3Data.length + "px";
	$('scrollpage').innerHTML = html;
}

/**
 * 广告处理
 */

function initAd1(_dataJson){
	ad1Data = {
			"adBPic"     :  "media" + _dataJson.hd + _dataJson.bp,
			"adSPic"     :  "media" + _dataJson.hd + _dataJson.sp,
			"adBackPic"  :  "media" + _dataJson.hd + _dataJson.chPhotos[0].url
	};
}

function initAd2(_dataJson){
	ad2Data = {
			"adBPic"     :  "media" + _dataJson.hd + _dataJson.bp,
			"adSPic"     :  "media" + _dataJson.hd + _dataJson.sp,
			"adBackPic"  :  ""
	};
	
	ad2Data.adBackPic += "media" + _dataJson.hd + _dataJson.chPhotos[0].url;
	for(var i = 1; i <  _dataJson.chPhotos.length; i++){
		ad2Data.adBackPic += ";media" + _dataJson.hd + _dataJson.chPhotos[i].url;
	}	
}

function initAd3(_dataJson){
	ad3Data = [];	
	for(var i = 0; i <  _dataJson.chPhotos.length; i++){
		ad3Data.push({
			adBackPic : "media" + _dataJson.hd + _dataJson.chPhotos[i].url 
		});
	}	
}
/**************0702modifiy***************/
//function initAD(){
	//var adTip = getAdTip();
	//$("tip_text").innerHTML = adTip;
//}

function initTime(){
	var tmpWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	var whcx_getTailNumber = {
			"callBack" : function(_dataJson) {
				$("index_ad_num").innerHTML = _dataJson.data.tailNumber.replace(",", "、" );
			}
		};
		delayNavTime = setTimeout(function() {
			clearTimeout(delayNavTime);
			IEPG.getData(URL.WHCX_GetTailNumber, whcx_getTailNumber);
		}, 200);
	var today = new Date();
	$("ads1").background = 'url(' + ad2Data.adSPic + ') no-repeat 30px';
	$("date").innerHTML = today.getFullYear() + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日  " + tmpWeek[today.getDay()];
}
/**
 * 获取广告信息
 * @returns {String}
 */


/*********0702modifiy****************/
function getAdTip(){
	//if(recData){
	//	return recData.de;
	//}else{						
	//	return "欢迎进入电视交管，这里你将享受最优的服务!";
	//}
		if(recData.de){
			$("tip_text").innerHTML=recData.de;
		}else{
			$("tip_text").innerHTML="欢迎进入电视交管，这里你将享受最优的服务!";
			}
		}


/**
 * 栏目处理
 */

function initMenu(){
	totalPage = Math.ceil(menuData.length/menuSize);
	menuObj = New(MultiMove, config.MENU);
	updataMenuData(0);
}

function updataMenuData(_pos){
	menuCurData = [];
	var curPageDataStart = parseInt((curPage - 1) * menuSize);
	var curPageDataLength = parseInt(menuData.length - curPageDataStart);
	for(var i = 0; i < curPageDataLength && i < menuSize; i++){
		menuCurData.push(menuData[i + curPageDataStart]);
	}		
	menuObj.focusIndex = menuFocus;
	menuObj.initMenuData(menuCurData);
	if(_pos == 1){
		menuObj.focusIndex = 0;
	}else if(_pos){
		menuObj.focusIndex = curPageDataLength > menuSize ? (menuSize-1) : (curPageDataLength-1);
	}
	if(menuCurData.length > 0){
		menuObj.initFocus();
	}
}

function showMenu(_data, _focusIndex, _dataIndex){
	if(_data){
		$("text_" + _focusIndex).innerHTML = IEPG.subText(_data.cn, 16, 0);
		$("images_" + _focusIndex).style.display = "block";
		$("images_" + _focusIndex).style.background = "url(media" + _data.hd + _data.sp + ") no-repeat";
	}else{
		$("text_" + _focusIndex).innerHTML = "";
		$("images_" + _focusIndex).style.display = "none";
		$("images_" + _focusIndex).style.background = "";		
	}
}

function onMenuFocus(_focusIndex, _dataIndex){
	menuFocus = _focusIndex;
	$("text_" + _focusIndex).innerHTML = IEPG.subText(menuCurData[_focusIndex].cn, 16, 1);
	$("text_" + _focusIndex).style.color = "#FFF";										//0223xiugai
	$("images_" + _focusIndex).style.background = "url(media" + menuCurData[_focusIndex].hd + menuCurData[_focusIndex].bp + ") no-repeat";
}

function onMenuBlur(_focusIndex, _dataIndex){
	$("text_" + _focusIndex).innerHTML = IEPG.subText(menuCurData[_focusIndex].cn, 16, 0);
	$("text_" + _focusIndex).style.color = "#FFF";										//0223xiugai
	$("images_" + _focusIndex).style.background = "url(media" + menuCurData[_focusIndex].hd + menuCurData[_focusIndex].sp + ")";
}

/**
 * 
 */

var isOverPageChange = true;
function initList(_index){
	if(ad3Data.length < 2){
		$("adpic1").src = ad3Data[0].adBackPic || "images/adPic.png";
		$("adpic2").src = "";
		return;
	}
	$("adpic1").src = ad3Data[_index].adBackPic;	
	setTimeout(function(){
		$("adpic2").style.display = "none";				
	$("adpic2").src = ad3Data[(_index + 1)%ad3Data.length].adBackPic;

	if(isOverPageChange){
		$("scrollpage_" + _index).className = "pageFocus";
		isOverPageChange = false;
		setTimeout(function(){
			$("scrollpage_" + _index).className = "";
			_index++;		
			if(_index >= ad3Data.length){
				_index = 0;
			}
			$("scrollpage_" + _index).className = "pageFocus";
			changeImg(1, document.getElementById("adpic1"), document.			getElementById("adpic2"),function(){	
			initList(_index);

				}
			);

		}, 5000);	
	

	
	}
	}, 20)
	
}


/**
 *  移动逻辑处理
 */

function moveUp(){
	if(areaTip == 0){
		if(menuObj.focusIndex <= 0){
	      	turnPrevPage();
	      	return;
	    }
		menuObj.moveMenu(-1);
	}else if(areaTip == 1){
		listObj.multiSplit(-1);
	}
}

function moveDown(){
	if(areaTip == 0){
		if(menuObj.focusIndex >= menuCurData.length - 1){
	      	turnNextPage();
	      	return;
	    }
		menuObj.moveMenu(1);
	}else if(areaTip == 1){
		listObj.multiSplit(1);
	}
}

function moveRight(){
	if(areaTip == 0){
		//areaTip = 1;
		//menuObj.hideFocus();
		//menuObj.onBlur(menuFocus);
		//listObj.initFocus();
	}else if(areaTip == 1){
		listObj.moveList(1);
	}
}

function moveLeft(){
	if(areaTip == 1){
		if(listFocus % 2 == 0){
			areaTip = 0;
			listObj.hideFocus();
			listObj.onBlur(listFocus);
			menuObj.initFocus();
		}else{
			listObj.moveList(-1);
		}
	}
}

function turnPrevPage(){
	curPage--;
	if(curPage < 1){
		curPage = totalPage;
	}
	menuObj.onBlur(menuFocus);
	updataMenuData(-1);
}

function turnNextPage(){
	curPage++;
	if(curPage > totalPage){
		curPage = 1;
	}
	menuObj.onBlur(menuFocus);
	updataMenuData(1);
}

function doConfirm(){
	if(areaTip==0){	
		saveAllGlobalVar();
		globalPath.setUrl();
		url = menuCurData[menuObj.focusIndex].ht;
		var adpic = menuCurData[menuObj.focusIndex].chPhotos[0].url;
		closeVideo();//0918add
		if(url){				
			window.location.href = url.split("/")[1]+'?titleName='+encodeURIComponent(menuCurData[menuObj.focusIndex].cn)+'&menuId='+menuCurData[menuObj.focusIndex].id + "&chtUrl=" + encodeURIComponent(menuCurData[menuObj.focusIndex].cht) + "&adPic=" + "media" + menuCurData[menuObj.focusIndex].hd + adpic; 
		}else{
			areaTip = 2;
			isPressBack = true;
			$("tips").style.display = "block";
			$("tips_query").style.display = "block";
		}											
	}															
}

function doExitEvent(){
	areaTip = 0;
	$("tips").style.display = "none";
	$("tips_query").style.display = "none";
}

function doNumberKey(_keycode){
	var numberFocus = _keycode - 48;
	closeVideo();						//0918add
 if(numberFocus == 1){
		saveAllGlobalVar();
		globalPath.setUrl();
		location.href = 'channel_jrxxwh.html?titleName='+encodeURIComponent("限行尾号通知") + "&adPic=" + ad1Data.adBackPic;
	}
}

/**
 * 变量存取
 */

function saveAllGlobalVar(){
	setGlobalVar("index_areaTip", areaTip);
	setGlobalVar("index_menuFocus", menuFocus);
	setGlobalVar("index_curPage", curPage);
}

function getAllGlobalVar(){
	areaTip = getGlobalVar("index_areaTip") ? parseInt(getGlobalVar("index_areaTip")) : 0;
	menuFocus = getGlobalVar("index_menuFocus") ? parseInt(getGlobalVar("index_menuFocus")) : 0;
	curPage = getGlobalVar("index_curPage") ? parseInt(getGlobalVar("index_curPage")) : 1;
}

function clearAllGlobalVar(){
	setGlobalVar("index_areaTip", "");
	setGlobalVar("index_menuFocus", "");
	setGlobalVar("index_curPage", "");
	setGlobalVar("isBack", "");
}