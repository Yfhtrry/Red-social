﻿function _afterSetServer() {
	getSoftwareInfo();
}
function _afterSetSoftwareInfo(soft){
	setSoftwareView();
}

function setSoftwareView() {
	_setSoftwareViewBasic('1.0.2');
	$('a.animate_action_http').click(function(){
		var path = $(this).attr("href");
		spinScreen(path, "non");
		return false;
	});
	setHover();
	_afterFadeIn();
}

$(document).ready(function(){
	setApp('modeler');
});

$(window).load(function(){
});
