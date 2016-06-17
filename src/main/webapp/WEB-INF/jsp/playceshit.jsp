<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>

<!DOCTYPE html lang="utf-8">
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" />
	<title>Insert title here</title>
</head>
<body bgColor="transparent" onload="init();" onunload="clearVideo();">
	<div id="info" style="background-color:#000000; color:#FFF; font-size:22px; font-weight:bold; text-indent:30px;"></div>

<script language="javascript" type="text/javascript">
alert(${vedioplaynum});
</script>
</body>
</html>

<script language="javascript" type="text/javascript">
	var mp = new MediaPlayer();
	var nativePlayerInstanceId = null;
	var isFull = false;
	var status = 1;
	var areaCode = Utility.getSystemInfo("ARC");
	var userId = Utility.getSystemInfo("UID");
	alert(${vedioplaynum});
	alert(areaCode);
	alert(userId);
	//rtsp://10.80.0.51:554/2531446188902036^^^?&startTime=0&endTime=&areaCode=113&resgroupId=&userId=6500838&sessionId=0&sessionType=null&payType=1&productId=0&displayName=&provider=coship&ssId=2009976&vcrInfo=
	//2531445566252032   测试     2531446188902036 jg
	var mediaStr="rtsp://010.080.000.051:554/${vedioplaynum}^^^?&startTime=&endTime=&areaCode="+areaCode+"&resgroupId=&userId="+userId+"&sessionId=0&sessionType=null&payType=1&productId=0&displayName=&provider=coship&ssId=2009976&vcrInfo=";
	function init(){
		nativePlayerInstanceId = (Utility.getEnv("nativePlayerInstanceId") || mp.getNativePlayerInstanceId());
		if( nativePlayerInstanceId ){
			mp.bindNativePlayerInstance(nativePlayerInstanceId);
		}
		Utility.setEnv("nativePlayerInstanceId",nativePlayerInstanceId);
		mp.setAllowTrickmodeFlag(0);
		mp.setSingleMedia(mediaStr);
		mp.setVideoDisplayArea(100,100,400,300);
		mp.setVideoDisplayMode(0);
		mp.refreshVideoDisplay();
		mp.playFromStart();
		status = 2;
	}
	function clearVideo(){
		mp.stop();
		mp.releaseMediaPlayer(nativePlayerInstanceId);
	}
	document.onkeypress = function(e){
		e = e || event;
		var keyCode = e.which || e.keyCode;
		switch( keyCode.toString() ){
			case "3864":
				try{
					if( status == 2 ){
						mp.pause();	
						status = 3;
					}else if(status == 3){
						mp.resume();
						status = 2;	
					}else{
						mp.stop();
						status = 1;
						init();	
					}
				}catch(e){
					alert(e.message);	
				}
				break;
			case "112":
				if( isFull ){
					mp.setVideoDisplayMode(0);
					mp.refreshVideoDisplay();
					isFull = false;
				}else{
					mp.setVideoDisplayMode(1);
					mp.refreshVideoDisplay();
					isFull = true;
				}
				//alert(keyCode);
				break;
			/*case "":
				break;*/
		}	
	}
setInterval(function(){document.getElementById("info").innerHTML = status+"||"+printGlobal().join("||");},1000);



paramToGlobal();
function paramToGlobal(){
	var keyList = "tvCode|userCode|userToken".split('|');
	var URI = location.search;
	var URI = URI.substr(1);
	var URIs = URI.split('&');
	var keyAndValue = new Array;
	for(var i=0;i<URIs.length;i++){
		keyAndValue = URIs[i].split('=');
		for(var j=0;j<keyList.length;j++){
			if( keyAndValue[0] == keyList[j] && keyAndValue[0]!=""){
				wirteGlobalVar(keyAndValue);
			}
		}
	}
}
function writeClogalVar(keyAndValue){
	if( Utility.setEnv ){
		Utility.setEnv(keyAndValue[0],keyAndValue[1]);
	}else{
		//写COOKIE;	
	}
}
function readGlobalVar(key){
	if( Utility.getEnv ){
		var Value = Utility.getEnv(key);
		if( Value ){
			return Value;	
		}
	}else{
		//读COOKIE;
	}
}
function printGlobal(){
	var keyList = "tvCode|userCode|userToken".split('|');
	var value = new Array;
	for(var j=0;j<keyList.length;j++){
		value.push(readGlobalVar(keyList[j]));
	}
	return value;
}
</script>