function _afterSetServer() {
	getSoftwareInfo();
}
function _afterSetSoftwareInfo(soft){
	setSoftwareView();
}

function setSoftwareView() {
	_setSoftwareViewBasic('1.5.0');
	if(!SOFTWARE[APP]) return false;
	$('#app_buy_pro').hide();
	$('#app_buy_ex').hide();
	if(SOFTWARE[APP]['ver']) {
		var type = decodeURIComponent(SOFTWARE[APP]['type']);
		var grade = SOFTWARE[APP]['grade'].toUpperCase();
		if(type == TOOL_TYPE[LANGr]['tr']) {
			grade = "PRO/EX";
		}
		$('#app_kick .app_grade').text(grade);
	}
	if(SOFTWARE[APP]['grade']) {
		if(SOFTWARE[APP]['grade'] != "ex") {
			$('#app_description').show();
			$('#app_buy').show();
			if(type != TOOL_TYPE[LANGr]['tr']) $('#app_trial').show();
		}
		$('#wrapper').attr("class", "color_" + SOFTWARE[APP]['grade']);
	}
	if(SOFTWARE[APP]['upgrade_pro']) {
		$('#app_buy_pro').removeAttr('onclick');
		$('#app_buy_pro').bind('click', function(){
			openModal(decodeURIComponent(SOFTWARE[APP]['upgrade_pro']['url']));
		});
		$('#app_buy_pro .app_buy_text').text(decodeURIComponent(SOFTWARE[APP]['upgrade_pro']['text']));
		if(SOFTWARE[APP]['upgrade_pro']['css']) {
			$('#app_buy_pro .hover_opacity01').attr("class", "hover_opacity01 " + SOFTWARE[APP]['upgrade_pro']['css']);
		}
		if(SOFTWARE[APP]['upgrade_pro']['color']) {
			$('#app_buy_pro .hover_opacity01').attr("class", "hover_opacity01");
			$('#app_buy_pro .hover_opacity01').attr("style", "background:" + SOFTWARE[APP]['upgrade_pro']['color'] + ";");
		}
		$('#app_buy_pro').show();
	}
	if(SOFTWARE[APP]['upgrade_ex']) {
		$('#app_buy_ex').removeAttr('onclick');
		$('#app_buy_ex').bind('click', function(){
			openModal(decodeURIComponent(SOFTWARE[APP]['upgrade_ex']['url']));
		});
		$('#app_buy_ex .app_buy_text').text(decodeURIComponent(SOFTWARE[APP]['upgrade_ex']['text']));
		if(SOFTWARE[APP]['upgrade_ex']['css']) {
			$('#app_buy_ex .hover_opacity01').attr("class", "hover_opacity01 " + SOFTWARE[APP]['upgrade_ex']['css']);
		}
		if(SOFTWARE[APP]['upgrade_ex']['color']) {
			$('#app_buy_ex .hover_opacity01').attr("class", "hover_opacity01");
			$('#app_buy_ex .hover_opacity01').attr("style", "background:" + SOFTWARE[APP]['upgrade_ex']['color'] + ";");
		}
		$('#app_buy_ex').show();
	}
	$('a.animate_action_http').click(function(){
		var path = $(this).attr("href");
		spinScreen(path, "non");
		return false;
	});
	setHover();
	_afterFadeIn();
}

$(document).ready(function(){
	setApp('paint');
	$('#plugin_pdf').hide();
});

$(window).load(function(){
});
