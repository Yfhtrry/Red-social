var material_uuid = null;
var htmlTemplate  = null;
var initCallIce   = null;
var cloudStatus   = null;
var isMine        = false;
var goCoordinate  = false;
var goModeler     = false;
var cloudPreIn    = null;
var contentId     = null;
var _progress     = false;

function setTemplate(page) {
	if(!page) return;
	htmlTemplate = page;
}
function setUuid(uuid) {
	if(!uuid) return;
	material_uuid = uuid;
}
function _afterSetServer() {
	if(initCallIce) callIce(initCallIce, {});
}
function setMode(mode) {
	if(mode == "mine") {
		isMine = true;
	}
	if(mode == "go_coordinate") {
		goCoordinate = true;
	}
	if(mode == "go_modeler") {
		goModeler = true;
	}
	if(mode == "cloud_pre_in") {
		cloudPreIn = true;
	}
}
function setContentId(content_id) {
	if(!content_id) return;
	contentId = content_id;
	$("#getUpdate").show();
}
function setMaterial(title, datetime) {
	$('#materialTitle').text(title).show();
	//$('#materialDatetime').text('更新日時 '+datetime).show();
	//$('#materialDatetime').text(datetime).show();
}
function setCloudStatus(status, datetime) {
	if(!status) return;
	cloudStatus = status;
	if(datetime) $('#cloudDatetime').text(getResource('text-cloudDatetime')+': '+datetime).show();
}
function setMaterialThumbnailPath(thumbnailPath) {
	if(!thumbnailPath) return;
	$("#thumb_area").html("");
	$("#thumb_area").append('<img src="' + thumbnailPath + '" />');
}
function setMaterialType(materialType) {
	if(!materialType) return;
	$('#materialApps').text(MATERIAL_TYPE[LANGr][materialType]);
	if(materialType == 'catalog') {
		$('[text-titleMaterial]').html(getResource('text-titleCatalog'));
		$('[text-goMaterialDetail]').html(getResource('text-goMaterialDetailCatalog'));
	}
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
	if(sync == 'on') {
		syncStatus = 1;
		$("#cloudOff").hide();
		$("#cloudOn").show();
		cloudStatus = 'still';
		$("#cloud_status").html("");
		$("#cloudSync").show();
	} else {
		syncStatus = 0;
		$("#cloudOff").show();
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
function getUpdate(){
	callIce("getUpdate");
}
function initializeComplete() {
	if(goCoordinate) {$("#goCoordinate").show();}
	if(goModeler) {$("#goModeler").show();}
	if(isMine && contentId == null) $("#goMaterialEdit").show();
	$("#cloud_status").html("");
	if(isMine) {
		switch(cloudStatus) {
			case 'still':
			case 'full':
				$("#cloudSync").show();
				$("#cloudOn").show();
				$("#cloudOff").hide();
				break;
			case 'husk':
				$("#cloudSync").show();
				break;
			default:
				$("#cloudOff").show();
				break;
		}
	} else if(cloudPreIn) {
		$("#cloudSync").show();
	}
	setHover();
	_afterFadeIn();
}