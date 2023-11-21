var SOFTWARE = [];
var APP = null;
var infoSetCnt = [];

var COORDINATE_TYPE = "無料ダウンロード版";

function setApp(app) {
	APP = app;
}
function getSoftwareInfo(getLocalInfo) {
	if(SERVER && !getLocalInfo) {
		params = {'software':'server'};
		callIce('getSoftwareInfo', params);
	} else if (APP == 'all') {
		_afterSetServer(true);
	} else if (APP) {
		params = {'software':APP};
		callIce('getSoftwareInfo', params);
	} else {
		return false;
	}
}
function setSoftwareInfo(app, data, type, ver, grade) {
	if(infoSetCnt[app]) return;
	infoSetCnt[app] = app;
	if(app == 'server') {
		if(data) {
			try{
				SOFTWARE = JSON.parse(data);
			}catch(e){
				getSoftwareInfo(true);
				return;
			}
		} else {
			getSoftwareInfo(true);
			return;
		}
	} else {
		SOFTWARE[app] = [];
		SOFTWARE[app]['serialno'] = data;
		SOFTWARE[app]['type'] = type;
		SOFTWARE[app]['ver'] = ver;
		SOFTWARE[app]['grade'] = grade;
	}
	_afterSetSoftwareInfo(app);
}
function _afterSetSoftwareInfo(soft) { //必要な場合は、後読みのJSでOverWriteする
	return false;
}

function clipInformation(obj) {
	if(SERVER) {
		if($(obj).attr('href')) {
			if(confirm("商品情報ページを表示します。\nよろしいですか？")) {
				openClip($(obj).attr('href'));
			}
		}
	} else {
		alert("ネットワークに接続してください。");
	}
	return false;
}
function iceInformation(obj) {
	if($(obj).attr('href')) {
		openModal($(obj).attr('href'));
	}
	return false;
}

function _setSoftwareViewBasic(_v) {
	if(!APP || !SOFTWARE || !SOFTWARE[APP]) return false;
	var type = decodeURIComponent(SOFTWARE[APP]['type']);
	if(SOFTWARE[APP]['serialno']) {
		$('#app_trial').hide();
		if(SOFTWARE[APP]['unlimited']) {
			type = TOOL_TYPE[LANGr]['ul'];
		}
		if(!SOFTWARE['check'] && type == TOOL_TYPE[LANGr]['vl']) {
			type = "スマート版/バリュー版/無期限版";
		}
		if(!SOFTWARE[APP]['limited'] && type != TOOL_TYPE[LANGr]['tr']) {
			$('#app_buy').hide();
		}
	}
	if(SOFTWARE[APP]['ver']) {
		$('#app_description').hide();
		$('#app_kick .app_name').text(type);
		var limited = (SOFTWARE[APP]['limited']) ? "（期限切れ）" : "";
		var ver = (SOFTWARE[APP]['grade'] || type) ? ' - Ver.' : 'Ver.';
		$('#app_kick .app_ver').text(ver + SOFTWARE[APP]['ver'] + limited);
		if(_v && versionCompare(_v, '<=', SOFTWARE[APP]['ver'])) $('#app_kick').show();
		if(!_v) $('#app_kick').show();
		if(SOFTWARE[APP]['update']) {
			$('#app_update .catch_copy h2 span').text("最新版(Ver." + SOFTWARE[APP]['update']['ver'] + ")にアップデート");
			$('#app_update').click(function(){
				if(SOFTWARE[APP]['grade']) {
					openClip(decodeURIComponent(SOFTWARE[APP]['update']['url'] + '?grade=' + SOFTWARE[APP]['grade']));
				} else {
					openClip(decodeURIComponent(SOFTWARE[APP]['update']['url']));
				}
				return false;
			});
			$('#app_update').show();
		}
		if(SOFTWARE[APP]['upgrade']) {
			$('#app_upgrade').click(function(){
				openModal(decodeURIComponent(SOFTWARE[APP]['upgrade_info']));
			});
			$('#app_upgrade .app_text').text(decodeURIComponent(SOFTWARE[APP]['upgrade_text']));
			if(SOFTWARE[APP]['upgrade_css']) {
				$('#app_upgrade .hover_opacity01').attr("class", "hover_opacity01 " + SOFTWARE[APP]['upgrade_css']);
			}
			if(SOFTWARE[APP]['upgrade_color']) {
				$('#app_upgrade .hover_opacity01').css("background-color", SOFTWARE[APP]['upgrade_color']);
			}
			$('#app_upgrade').show();
		}
	}
	if(SOFTWARE[APP]['campaign']) {
		for(var i in SOFTWARE[APP]['campaign']) {
			if(i == 'title') continue;
			var copy = $('#app_campaign').clone();
			copy.attr("id", 'app_campaign' + i);
			var url = decodeURIComponent(SOFTWARE[APP]['campaign'][i]['url']);
			copy.click(function(){
				openModal(url);
			});
			copy.find('.app_text').text(decodeURIComponent(SOFTWARE[APP]['campaign'][i]['text']));
			if(SOFTWARE[APP]['campaign'][i]['css']) {
				copy.find('.hover_opacity01').attr("class", "hover_opacity01 " + SOFTWARE[APP]['campaign'][i]['css']);
			}
			if(SOFTWARE[APP]['campaign'][i]['color']) {
				copy.find('.hover_opacity01').css("background-color", SOFTWARE[APP]['campaign'][i]['color']);
			}
			$('#app_campaign').after(copy);
			$('#app_campaign' + i).show();
		}
	}
	if(SOFTWARE[APP]['addFrontInfo']) {
		for(var i in SOFTWARE[APP]['addFrontInfo']) {
			$("#main_container").prepend(decodeURIComponent(SOFTWARE[APP]['addFrontInfo'][i]));
		}
	}
	if(SOFTWARE[APP]['addRearInfo']) {
		if($('#rear_point').attr('id')) {
			for(var i in SOFTWARE[APP]['addRearInfo']) {
				$("#rear_point").before(decodeURIComponent(SOFTWARE[APP]['addRearInfo'][i]));
			}
		} else {
			for(var i in SOFTWARE[APP]['addRearInfo']) {
				$("#main_container").append(decodeURIComponent(SOFTWARE[APP]['addRearInfo'][i]));
			}
		}
	}
	if(SOFTWARE[APP]['addPrInfo']) {
		for(var i in SOFTWARE[APP]['addPrInfo']) {
			$("#main_container").append(decodeURIComponent(SOFTWARE[APP]['addPrInfo'][i]));
		}
	}
//	setHover();
}

$(document).ready(function(){
	$('#app_kick').hide();
	$('#app_update').hide();
	$('#app_upgrade').hide();
	$('#app_get').hide();
	$('#app_campaign').hide();
});

$(window).load(function(){
});
