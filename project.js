var project_uuid = null;
var htmlTemplate = null;
var initCallIce  = null;
var cloudStatus  = null;
var syncStatus   = null;
var docType      = null;
var doNotSync    = false;
var doNotOpen    = false;
var viewBlock    = false;
var _progress    = false;

function setTemplate(page) {
	if(!page) return;
	htmlTemplate = page;
}
function setUuid(uuid) {
	if(!uuid) return;
	project_uuid = uuid;
}
function _afterSetServer() {
	if(LANGr == 'ja-jp'){
		$('[link-kdpPreviewTool], [link-kdpTop1], [link-kdpTop2]').removeAttr('onclick').unbind('click').bind('click', function(){
			openClip($(this).attr('href'));
			return false;
		});
	}
	$('img[visual_kindle01]').attr('src', 'img/kindle/'+LANG+'_bt_box_visual_kindle01.png');
	$('img[visual_kindle02]').attr('src', 'img/kindle/'+LANG+'_bt_box_visual_kindle02.png');
	$('img[visual_kindle03]').attr('src', 'img/kindle/'+LANG+'_bt_box_visual_kindle03.png');
	$('img[visual_kindle04]').attr('src', 'img/kindle/'+LANG+'_bt_box_visual_kindle04.png');
	if(initCallIce) callIce(initCallIce, {});
}
function setProject(title, datetime) {
	$('#projectTitle').text(title).show();
	$('#projectDatetime').text(datetime).show();
}
function setCloudStatus(status, datetime) {
	if(!status) return;
	cloudStatus = status;
	if(datetime) $('#cloudDatetime').text(getResource('text-cloudDatetime')+': '+datetime).show();
}
function setFanzine(make, upload) {
	if(!make) return;
	$('#fanzineDatetime').text(make);
	$('#fanzineData').show();
	if(htmlTemplate == 'fanzine') {
		$('#outputFanzineText').show();
	}
	if(htmlTemplate == 'fanzine') {
		$('#3dPreview').show();
	}
	
	if(upload) {
		if(htmlTemplate == 'fanzine') {
			mDate = Date.parse(make);
			uDate = Date.parse(upload);
			
			if(mDate > uDate){
				$('#fanzineUpdate').show();
			} else {
				$('#fanzineWeb').show();
			}
		}
		if(htmlTemplate == 'fanzine_web'){
			$('#webView').show();
			$('#copyWebViewUrl').show();
			$('#fanzineDelete').show();
		}
	} else {
		if(htmlTemplate == 'fanzine'){
			$('#fanzineUpload').show();
		}
	}
}
function setKindle(make) {
	if(!make) return;
	$('#kindleDatetime').text(make);
	$('#kindleData').show();
	if(htmlTemplate == 'kindle') {
		$('#outputKindle').removeClass('color_kindle').addClass('color_common');
		$('#outputKindle').removeClass('hover_opacity01').addClass('hover_opacity02');
		$('#outputKindleText').show();
		$('#kindlePreview').show();
		$('#KDP_h01').hide();
		$('#KDP_h02').show();
		$('#kindlePreviewtool').removeClass('h02').addClass('h01');
	}
}
function setEpub(make) {
	if(!make) return;
	$('#epubDatetime').text(make);
	$('#epubData').show();
	if(htmlTemplate == 'epub') {
		$('#outputEpub').removeClass('color_updater').addClass('color_common');
		$('#outputEpub').removeClass('hover_opacity01').addClass('hover_opacity02');
		$('#outputEpubText').show();
	}
}
function setPrint(make) {
	if(!make) return;
	$('#printDatetime').text(make);
	$('#printData').show();
	if(htmlTemplate == 'print') {
		$('#outputPrint').hide();
		$('#reOutputPrint').show();
	}
}
function setWebView(url) {
	$('#webView').click(function(){
		openClip(url);
		return false;
	});
}
function uploadFanzine() {
	if(confirm(getResource('text-uploadFanzine'))) {
		callIce('uploadFanzine');
	}
}
function deleteFanzine() {
	if(confirm(getResource('text-deleteFanzine'))) {
		callIce('deleteFanzine');
	}
}
function setProjectThumbnailPath(thumbnailPath) {
	if(!thumbnailPath) return;
	$("#thumb_area").html("");
	$("#thumb_area").append('<img src="' + thumbnailPath + '" />');
}
function setDocumentType(documentType, work, owner) {
	//work = 1:共同作業 2:外部リンクあり 3:チーム制作権限なし
	//owner = 1:オーナー それ以外:非オーナー
	if(!documentType) return;
	work = parseInt(work);
	owner = parseInt(owner);
	if(owner == 1){
		viewBlock = true;
	}
	docType = documentType;
	//docName = DOCUMENT_TYPE[LANGr][documentType];
	if(documentType == 'paintwork' || documentType == 'paintwork2') {
		//if(viewBlock) {
			$('#viewShare').show();
			$('#viewShareWebtoon').show();
			if(OS == 'Win') $('#viewKindle').show();
			$('#viewEpub').show();
			$('#viewFanzine').show();
			if (LANGr == 'ja-jp') {
				$('#viewPrint').show();
			}
		//}
	}
	if(documentType == 'paintpage' || documentType == 'clipstudioformat') {
		if(LANGr == 'ja-jp'/* && viewBlock*/) {
			$('#viewPrint').show();
		}
		$('#viewShareWebtoon').show();
	}
	if(work) {
		doNotSync = true;
	}
	if(work == 3){
		doNotOpen = true;
	}
	//$('#projectApps').html(docName);
}
function startupApplication(app) {
	if(doNotOpen) return;
	if(app == "paint") $("#goPaintBtn").show();
	if(app == "paint_rc") $("#goPaintRcBtn").show();
	if(app == "action") $("#goActionBtn").show();
	if(app == "coordinate") $("#goCoordinateBtn").show();
	if(app == "modeler") $("#goModelerBtn").show();
}
function setPreviewtoolBack(id) {
	if(!id) {
		$('#backBtn').hide();
	} else {
		$('#backId').text(id);
	}
}
function backProjectPlus(){
	var params = {};
	params['backId'] = $('#backId').text();
	callIce('backProject', params);
}
function checkSync(sync) {
	if(_progress) return;
	_progress = true;
	callIce('cloudSync',{'sync':sync});
	setTimeout(function(){_progress = false;}, 1000);
}
function goCloudSync() {
	if(_progress) return;
	_progress = true;
	callIce('syncCloudData');
	setTimeout(function(){_progress = false;}, 1000);
}
function setCloudSync(sync) {
	if(doNotSync) return;
	if(sync == 'on') {
		syncStatus = 1;
		$("#cloudOff").hide();
		if(viewBlock) $("#cloudOn").show();
		cloudStatus = 'still';
		$("#cloud_status").html("");
		$("#cloudSync").show();
	} else {
		syncStatus = 0;
		if(viewBlock) $("#cloudOff").show();
		$("#cloudOn").hide();
		cloudStatus == 'off'
		$("#cloud_status").html("");
		$("#cloudSync").hide();
	}
	setHover();
	_afterFadeIn();
}
function getCloudImageTag(status){
	return '<img src="img/common/cloud_' + status + '.png" class="cloud_icon"/>';
}

function initializeComplete() {
	if(htmlTemplate == 'index') {
		if(!doNotSync && (docType == 'clipstudioformat'
		 || docType == 'paintwork' || docType == 'paintpage' || docType == 'paintwork2'
		 || docType == 'modelerfeature' || docType == 'modelercharacter' || docType == 'modelerobject' || docType == 'modelerbg')
		) {
			$("#cloud_status").html("");
			switch(cloudStatus) {
				case 'still':
				case 'husk':
				case 'full':
					$("#cloudSync").show();
					if(viewBlock) $("#cloudOn").show();
					$("#cloudOff").hide();
					break;
				default:
					if(viewBlock) $("#cloudOff").show();
					break;
			}
		}
		if(docType != 'kakooyo' && docType != 'ipv') {
			if(!doNotOpen) $("#editProject").show();
			$("#openSaveFolder").show();
		}
		if(doNotOpen) $('#openSaveFolder').hide();
	}
	if(htmlTemplate == 'kindle' && OS == 'Mac') {
		$('a.bt_box').hide();
		$('#kindleData').show();
	}
	setHover();
	_afterFadeIn();
}