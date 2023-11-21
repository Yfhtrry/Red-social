var htmlTemplate   = null;
var initCallIce    = null;
var currentPath = null;
var _progress      = false;

function setTemplate(page) {
	if(!page) return;
	htmlTemplate = page;
}

function _afterSetServer() {
	if(initCallIce) callIce(initCallIce, {});
	setTimeout("setHover();", 250);
}
function startFadeIn() {
	$("#animation_area").css({display:'none'}).fadeIn("slow");
	//グリッドなし
	return false;
}

function setLocationPath(path, div, flag) {
	if(path){
		$('#location').val(path);
		if(div == 'current') currentPath = path;
	}
	if(flag == "1"){
		$('#btSave').show();
		$('#attOkVer').show();
	} else {
		$('#attNgVer').show();
	}
}
function saveSetting(){
	if(_progress) return;
	if(!currentPath){
		alert(getResource('text-errPath'));
		return;
	}
	var locationPath=$('#location').val();
	if(currentPath == locationPath){
		alert(getResource('text-errNotChang'));
		return;
	} else {
		if(confirm(getResource('text-saveConfirm'))){
			_progress = true;
			var params = {};
			params['path'] = locationPath;
			callIce('changeCommonLocation', params);
			setTimeout(function(){_progress = false;}, 1000);
		}
	}
}
