var ResourceLoading = false;
var resourceMain=document.createElement("script");
resourceMain.type="text/javascript";
resourceMain.src=(location.pathname.match(/\/Phone\//))?"../resource/main.js":"resource/main.js";
document.head.appendChild(resourceMain);
var resourcePage=document.createElement("script");
resourcePage.type="text/javascript";
resourcePage.src=(location.pathname.match(/\/Phone\//))?"../resource/page.js":"resource/page.js";
document.head.appendChild(resourcePage);


//共通
var IceVer = null;
var LANG = 'ja-jp';
var LANGr = 'ja-jp';
var LANGf = null;
var langText = {};
var langLink = {};
var SERVER = null;
var BaseUrl = null;
var COUNT = null;
var OS = null;
var Device = null;
var inFrame = false;
var _progressIce = false;
var tidque = null;
var arrque = [];

if(navigator.userAgent.indexOf("iOS") != -1){
	OS = "iOS";
}else if(navigator.userAgent.indexOf("ChromeOS") != -1){
	OS = "ChromeOS";
}else if(navigator.userAgent.indexOf("Android") != -1){
	OS = "Android";
}else if(navigator.platform.indexOf("Mac") != -1){
	OS = "Mac";
}else if(navigator.platform.indexOf("Win") != -1){
	OS = "Win";
}else{
	OS = "etc";
}

if(OS == 'iOS') {
	if(navigator.platform.indexOf("iPad") != -1 || navigator.platform.indexOf("Mac") != -1){
		Device = 'iPad';
	}else if(navigator.platform.indexOf("iPhone") != -1){
		Device = 'iPhone';
	}else if(navigator.platform.indexOf("iPod") != -1){
		Device = 'iPod';
	}
}else if(OS == 'Android'){
	if(navigator.userAgent.indexOf("Tablet") != -1){
		Device = 'ATab';
	}else{
		Device = 'APhone';
	}
}else{
	Device = OS;
}

function setServer(url, lang){
	if(SERVER) return;
	SERVER = url;
	if(lang) {
		LANG = lang;
		if(LANGf){
			if(lang != 'ja-jp') LANGr = LANGf;
		} else {
			LANGr = lang;
		}
		$('html').attr('lang', LANGr);
	}
	TID = setInterval(function(){
		if(!ResourceLoading) return;
		clearInterval(TID);
		if(langText[LANGr]){
			for(var k in langText[LANGr]){
				$('[' + k + ']').html(getResource(k));
				w = $('[' + k + ']').width();
			}
		}
		if(langLink[LANGr]){
			for(var k in langLink[LANGr]){
				$('a[' + k + ']').attr('href', getLink(k));
			}
		}
		if(!inFrame) callIce('getBaseUrl');
		_afterSetServer();
	},100);
}
function _afterSetServer(){ //必要な場合は、後読みのJSでOverWriteする
	return false;
}
function setBaseUrl(url){
	if(BaseUrl) return;
	BaseUrl = url;
	_afterSetBaseUrl();
}
function _afterSetBaseUrl(){ //必要な場合は、後読みのJSでOverWriteする
	return false;
}
function setCountInfo(newMaterial, newCelsysInfo, newUserInfo, softwareUpdate, additionUpdate){
	COUNT = {
		'newMaterial'   : newMaterial,
		'newCelsysInfo' : newCelsysInfo,
		'newUserInfo'   : newUserInfo,
		'softwareUpdate': softwareUpdate,
		'additionUpdate': additionUpdate
	};
	_afterSetCountInfo();
}
function _afterSetCountInfo(){ //必要な場合は、後読みのJSでOverWriteする
	return false;
}
function initializeComplete(){ //必要な場合は、後読みのJSでOverWriteする
	return;
}
function callIce(methodName, params){
	uri = "callice://" + methodName;
	if(params){
		for (var param_name in params){
			uri += "/" + param_name + "/" + params[param_name];
		}
	}
	arrque.unshift(uri);
	if(!tidque){
		tidque = setInterval(function(){callIceQue();}, 100);
	}
	return false;
}
function _callIce(methodName, params){ //連続クリックによる多重呼び出し防止版
	if(_progressIce == methodName) return;
	_progressIce = methodName;
	setTimeout(function(){_progressIce = false;}, 2500);
	callIce(methodName, params);
}
function callIceQue(){
	if(arrque.length > 0){
		uri = arrque.pop();//末尾を取得
		location.href = uri;
	}else{
		clearInterval(tidque);
		tidque = null;
	}
}
function afterLogin(){}
function afterLogout(){}
function getUrlVars(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
function getIceVer(){
	if(!IceVer) {
		var ua = window.navigator.userAgent;
		var reg = /(CLIPSTUDIO|CLIP STUDIO PAINT)\/(\d+\.\d+\.\d+)/;
		var v = ua.match(reg);
		if(v)IceVer = v[2];
	}
	return IceVer;
}
function isPhone(){
	return (Device == "iPhone" || Device == 'iPod' || Device == 'APhone');
}
function isEdge(){
	return (OS == "Win" && navigator.userAgent.indexOf("Edg/") != -1);
}
function setIceTicket(ticket){}
function openClip(url){
	if(SERVER){ //CLIPサイト専用 or フルパス専用
		if(!url.match(/^http/)){
			host = SERVER.replace("sta-ice.", "sta.www.");
			host = host.replace("ice.", "www.");
			url = host + url;
		}
		location.href = url;
	}else{
		alert(systemMessage[LANGr]['connectNetwork']);
	}
	return false;
}
function openIce(url){
	if(SERVER){ //ICEサイト専用へ
		if(!url.match(/^http/)){
			url = SERVER + '/' + LANG + url;
		}
		location.href = url;
	}else{
		alert(systemMessage[LANGr]['connectNetwork']);
		spinOff();
	}
	return false;
}
function openBaseUrlGd(page){
	if(BaseUrl){
		var url = BaseUrl + '/' + LANG + '/gd.html?app=ice&ver=' + getIceVer() + '&os=' + OS.toLowerCase() + '&page=' + page;
		location.href = url;
	}else{
		alert(systemMessage[LANGr]['connectNetwork']);
	}
	return false;
}
function openModal(url){
	setTimeout(function(){openModalDelay(url);}, 100);
}
function openModalDelay(url){
	if(SERVER){
		if(!url.match(/^http/)){
			url = SERVER + '/' + LANG + url;
		}
		callIce('modalView', {'url' : encodeURIComponent(url)});
	}else{
		alert(systemMessage[LANGr]['connectNetwork']);
	}
	return false;
}
function inModal(){
	if($('#modalWall').attr('name')){
		$('#modalWall').show();
	}else{
		$('body').prepend('<div id="modalWall" name="modalWall"></div>');
		$('#modalWall').attr('style', 'z-index:9999;');
		$('#modalWall').css({position:'fixed',width:'100%',height:'100%',backgroundColor:'#000000',opacity:'0.5'});
	}
}
function outModal(){
	$('#modalWall').hide();
}
function setZoom(){}
function getPixelRatio(){
	var ratio = 1;
	// To account for zoom, change to use deviceXDPI instead of systemXDPI
	if(window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI){
		// Only allow for values > 1
		ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
	}else if(window.devicePixelRatio !== undefined){
		ratio = window.devicePixelRatio;
	}
	return ratio;
}
function setSideMenuColor(colorText){};
function getResource(key, replace){
	var text = langText[LANGr][key];
	if(replace){
		text = text.replace(/%s/, replace);
	}
	return text;
}
function getLink(key, replace){
	var link = langLink[LANGr][key];
	if(replace){
		link = link.replace(/%s/, replace);
	}
	return link;
}
function versionCompare(val1, eq, val2){
	var v1 = val1.split('.');
	var v2 = val2.split('.');
	var n = (v1.length > v2.length) ? v1.length : v2.length;
	val1 = '';val2='';
	for(var i=0; i<n; i++){
		val1 += ('0000'+v1[i]).slice(-4);
		val2 += ('0000'+v2[i]).slice(-4);

	}
	switch(eq){
		case '<':
			return (val1 < val2);
		case '<=':
			return (val1 <= val2);
		case '>':
			return (val1 > val2);
		case '>=':
			return (val1 >= val2);
		case '==':
			return (val1 == val2);
		case '===':
			return (val1 === val2);
		case '!=':
			return (val1 != val2);
		case '!==':
			return (val1 !== val2);
		default:
			return false;
	}
}
function getAspectRatio(){
	if(window.screen.width > window.screen.height){
		return window.screen.width / window.screen.height;
	}else{
		return window.screen.height / window.screen.width;
	}
}
function scrollTop(){
	$('html, body').animate({scrollTop:'0'}, 100,'swing',function(){window.scrollTo(0,0);_afterScrollTop()});
}
function _afterScrollTop(){ //必要な場合は、後読みのJSでOverWriteする
	return false;
}

$(document).ready(function(){
	setTimeout(function(){
		if(OS == "Win" && !location.hash){
			window.scrollTo(0,0);
		}
		if(!inFrame) callIce('getServerInfo');
	}, 150);
	if(isEdge()) $('head').append('<link rel="stylesheet" type="text/css" href="css/edge.css" />');
	$('form').attr('autocomplete','off');
});
