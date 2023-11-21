function _afterSetServer() {
	if(LANGr == 'ja-jp'){
		$('#buyPaintEx').addClass('animate_action').click(function(){
			var path = $(this).attr("href");
			spinScreen(path);
			return false;
		});
	}else{
		$('#buyPaintEx').append('<div class="web_mark"><span>Web↗</span></div>');
	}
	getSoftwareInfo();
}
function _afterSetSoftwareInfo(soft){
	setSoftwareView();
}

function setSoftwareView() {
	if(!SOFTWARE[APP]) return false;
	var type = decodeURIComponent(SOFTWARE[APP]['type']);
	if(type == TOOL_TYPE[LANGr]['tr']) {
		SOFTWARE[APP]['grade'] = "ex";
	}
	if(SOFTWARE[APP]['grade']) {
		if(SOFTWARE[APP]['grade'] == "ex") {
			$('#selectProject').show();
		} else {
			$('#buyPaintEx').show();
		}
	}
	setHover();
	_afterFadeIn();
}

$(document).ready(function(){
	$('#selectProject').hide();
	$('#buyPaintEx').hide();
	setApp('paint');
});

$(window).load(function(){
});
