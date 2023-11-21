function _afterSetServer() {
	if(LANGr == 'ja-jp'){
		$('#buyPaintEx').addClass('animate_action').click(function(){
			var path = $(this).attr("href");
			spinScreen(path);
			return false;
		});
		$('[link-kdpTop]').removeAttr('onclick').unbind('click').bind('click', function(){
			openClip($(this).attr('href'));
			return false;
		});
	}else{
		$('#buyPaintEx').append('<div class="web_mark"><span>Web↗</span></div>');
	}
	$('img[visual_kindle01]').attr('src', 'img/kindle/'+LANG+'_bt_box_visual_kindle01.png');
	$('img[visual_kindle02]').attr('src', 'img/kindle/'+LANG+'_bt_box_visual_kindle02.png');
	$('img[visual_kindle03]').attr('src', 'img/kindle/'+LANG+'_bt_box_visual_kindle03.png');
	$('img[visual_kindle04]').attr('src', 'img/kindle/'+LANG+'_bt_box_visual_kindle04.png');
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
			$('#kindlePreviewtool').show();
		} else {
			$('#buyPaintEx').show();
		}
	}
	setHover();
	_afterFadeIn();
}

$(document).ready(function(){
	$('#selectProject').hide();
	$('#kindlePreviewtool').hide();
	$('#buyPaintEx').hide();
	setApp('paint');
});

$(window).load(function(){
});
