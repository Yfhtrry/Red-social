var htmlTemplate   = null;
var initCallIce    = null;
var currentSetting = [];
var _progress      = false;
var btnOnColor     = 'color_cloud';
var btnOffColor    = 'color_disable';
var changed        = false;

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

function setCloudSetting(env, material, project, font, flag) {
	currentSetting['env']      = env;
	currentSetting['envFont']  = font;
	currentSetting['material'] = material;
	currentSetting['project']  = project;
	changed = false;
	$('#saveBtnColor').removeClass(btnOnColor).addClass(btnOffColor);
	if(flag == 'save') {
		return;
	} else if(flag) {
		settingChanged();
		return;
	}
	if(env == 1) {
		$('#cloud_env_on').attr('checked', 'checked');
	} else {
		$('#cloud_env_off').attr('checked', 'checked');
	}
	if(font == 1) {
		$('#cloud_env_font_on').attr('checked', 'checked');
	} else {
		$('#cloud_env_font_off').attr('checked', 'checked');
	}
	if(material == 1) {
		$('#cloud_material_on').attr('checked', 'checked');
	} else {
		$('#cloud_material_off').attr('checked', 'checked');
	}
	if(project == 1) {
		$('#cloud_project_on').attr('checked', 'checked');
	} else {
		$('#cloud_project_off').attr('checked', 'checked');
	}
}
function saveSetting(){
	if(!changed) return;
	if(_progress) return;
	_progress = true;
	var params = {};
	params['env']      = $('input[name="cloud_env"]:checked').val();
	params['envFont']  = $('input[name="cloud_env_font"]:checked').val();
	params['material'] = $('input[name="cloud_material"]:checked').val();
	params['project']  = $('input[name="cloud_project"]:checked').val();
	setCloudSetting(params['env'], params['material'], params['project'], params['envFont'], 'save');
	callIce('saveCloudSetting', params);
	setTimeout(function(){_progress = false;}, 1000);
}
function getSettingValue(){
	return $('input[name="cloud_env"]:checked').val()+','+$('input[name="cloud_material"]:checked').val()+','+$('input[name="cloud_project"]:checked').val()+','+$('input[name="cloud_env_font"]:checked').val();
}
function checkCloudSetting() {
	changed = false;
	var check = $('input[name="cloud_env"]:checked').val();
	if(check != currentSetting['env']) {
		changed = true;
		return 0;
	}
	var check = $('input[name="cloud_env_font"]:checked').val();
	if(check != currentSetting['envFont']) {
		changed = true;
		return 0;
	}
	var check = $('input[name="cloud_material"]:checked').val();
	if(check != currentSetting['material']) {
		changed = true;
		return 0;
	}
	var check = $('input[name="cloud_project"]:checked').val();
	if(check != currentSetting['project']) {
		changed = true;
		return 0;
	}
	return 1;
}
function settingChanged(){
	if(checkCloudSetting()){
		$('#saveBtnColor').removeClass(btnOnColor).addClass(btnOffColor);
	} else {
		$('#saveBtnColor').removeClass(btnOffColor).addClass(btnOnColor);
	}
}
function btBack(backId) {
	if(_progress){
		spinOff();
		return;
	}
	_progress = true;
	callIce('backCloud',{'backId': backId});
	setTimeout(function(){_progress = false;}, 1000);
}

function cloudBackupErrorHelp(){
	if(!BaseUrl) return;
	location.href = BaseUrl + '/allow/gd.html?page=faq-backup-error:'+LANG;
	return false;
}

$(document).ready(function(){
	if(OS == "iOS" || OS == "Android" || OS == "ChromeOS"){
		$('[text-doWorksSync]').attr('text-doWorksSyncApp','').removeAttr('text-doWorksSync');
		$('[text-doWorksSyncSub]').attr('text-doWorksSyncAppSub','').removeAttr('text-doWorksSyncSub');
		$('[text-doMaterialSync]').attr('text-doMaterialSyncApp','').removeAttr('text-doMaterialSync');
		$('[text-doMaterialSyncSub]').attr('text-doMaterialSyncAppSub','').removeAttr('text-doMaterialSyncSub');
		$('[text-doAppBackup]').attr('text-doAppBackupApp','').removeAttr('text-doAppBackup');
		$('[text-doAppBackupSub]').attr('text-doAppBackupAppSub','').removeAttr('text-doAppBackupSub');
	}
	if(isPhone()){
		btnOnColor     = 'on';
		btnOffColor    = 'off';
	}
	$('input[type="radio"]').change(function(){
		settingChanged();
	});
});
