fn['setTitle'] = setTitle;
fn['setFaceGroup'] = setFaceGroup;
fn['setColor'] = setColor;

function setTitle(title) {
	if(!title) return;
	$('h3').text(title);
}
function setFaceGroup(data) {
	var faceName = data[0];
	var materialParts = data[1];
	//materialParts : [0]parts_name, [1]parts_thumbnail_path \r\n....(csv)
	if(!faceName || !materialParts) return;
	addHtml = '<h4>' + FACE_PRESET[LANGr][faceName.toLowerCase()] +'</h4>';
	parts = parseCSV(materialParts, ',', true);
	addHtml = addHtml + '<div class="group_items">';
	for(var i=0; i < parts.length; i++) {
		addHtml = addHtml + '<div class="group_item">';
		addHtml = addHtml + '<img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/>';
		addHtml = addHtml + '<p>' + parts[i][0] + '</p>';
		addHtml = addHtml + '</div>';
	}
	addHtml = addHtml + '</div><div class="cleaner" style="margin-bottom:10px;"></div>';
	$('#groups').show();
	$('#group_end').before(addHtml);
	$('.parts_group').addClass('setColor11');
	$('h4').addClass('border2');
	return true;
}
function setColor(style){
	$('body').append('<style>'+style+'</style>');
	$('html, body').addClass('setColor2');
}
function notThumbnail(obj,size) {
	if(!size) size = "m";
	var path=(isPhone())?"../":"";
	obj.src=path+"img/noimage/noimage_"+size+".jpg";
}

function _afterSetParentLang(){
	getVars = getUrlVars();
	var params = {}
	if(getVars['uuid']) {
		params.uuid = getVars['uuid'];
		
		// data initialize
		callIce("initializeFaceDetail", params);
	}
	/*$('.parts').each(function() {
		$(this).children('.part').autoHeight({column:5, clear:1});
	});*/
}
