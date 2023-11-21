var item_path;
var makeCatalog     = false;
var is3Ddata        = false;
var isUpload        = false;
var groupCount      = 0;
var groupMax        = 50; //グループ最大50個まで
var materialNumber  = 0;
var viewGroupMenu   = false;
var catalogVersion  = null;
var catalogRegisted = null;
var compare         = null;
var inCatalog       = false;
var goCoordinate    = false;
var goModeler       = false;
var isLicensed      = false;
var isMine          = false;

var limit = 100;
var catalogList = "";

function setMode(mode){

	if(mode == "make_catalog"){
		makeCatalog = true;
		$('[text-titleMaterialEdit]').html(getResource('text-titleCatalogEdit'));
		setTimeout(function(){$("#composition").text(getResource('text-materialSetting'))}, 500);
		$(".groupMake").show();
	}
	if(mode == "in_catalog"){
		inCatalog = true;
		$("#iCatalog").show();
		$("[text-contentid]").removeClass('t_top');
		$("#saveBtn").hide();
		$("#backCatalogSaveBtn").show();
		$("#upBtn").hide();
	}
	if(mode == "mine"){
		isMine = true;
	}
	if(mode == "3d_data"){
		is3Ddata = true;
	}
	if(mode == "go_coordinate"){
		goCoordinate = true;
	}
	if(mode == "go_modeler"){
		goModeler = true;
	}
	if(mode == "licensed"){
		isLicensed = true;
		$("#getTagBtn").hide();
	}
}
function setVersion(ver, reg){
	catalogVersion = ver;
	catalogRegisted = reg.replace(/\s|\/|\:/g, "");
	compare = (catalogRegisted && catalogVersion > catalogRegisted) ? catalogVersion : null;
}
function modifyMaterialPath(){
	var uri = location.href;
	uri = uri.substring(0, uri.lastIndexOf("/") + 1);
	$("#editor").contents().find("img").each(function(){
		var src = $(this).attr("src");
		if (src){
			src = src.replace(uri, "");
			src = src.replace(getMaterialPath(), "");
			src = src.replace(replaceSpace(getMaterialPath()), "");
			src = src.replace(encodeURI(getMaterialPath()), "");
			src = getMaterialPath() + src;
			$(this).attr("src", src);
		}
	});
}
function setMaterialPath(path){
	item_path = path;
}
function getMaterialPath(){
	return item_path;
}
function replaceSpace(str){
	return str.split(" ").join("%20");
}

function setContentId(contentId){
	if(!contentId) return;
	if (!isLicensed) $("#getTagBtn").show();
	$('.item_content_id').html(contentId);
	isUpload = true;
}
function getContentId(){
	var cid = $('.item_content_id').html();
	if(!parseInt(cid)) return 'none';
	return cid;
}
function setTitle(title){
	if(!title) return;
	$('.item_title').val(title);
	setComposition(title);
}
function getTitle(){
	return $('.item_title').val();
}
function setComposition(title){
	if(makeCatalog || !title) return;
	$('#composition').text(getResource('text-composition', title));
}
function setLocalTitle(title){
	if(!title) return;
	$('.item_local_title').text(title);
}
function getLocalTitle(){
	return $('.item_local_title').html();
}
function setMaterialNumber(num){
	if(!num && num.length==0) return;
	if(!makeCatalog) return;
	materialNumber = num;
	$('.item_number').text(num);
	$('#item_number').show();
}
function setCreatedTool(toolCode){
	if(!toolCode) return;
	$('.item_created_tool').html(CREATED_TOOL[LANGr][toolCode]);
}
function setThumbnail(mime, base64image){
	var img_src = "data:" + mime + ";base64," + base64image;
	$("#movie_thumb_area").html("");
	$("#thumb_area").html("");
	$("#thumb_area").append('<img src="' + img_src + '" />');
}
function setThumbnailPath(thumbnailPath){
	if(!thumbnailPath) return;
	$("#movie_thumb_area").html("");
	$("#thumb_area").html("");
	$("#thumb_area").append('<img src="' + thumbnailPath + '" />');
}
function setMovieThumbnailPath(thumbnailPath){
	if(!thumbnailPath) return;
	$("#movie_thumb_area").html("");
	$("#movie_thumb_area").append(movie_player);
	thumbnailPath = thumbnailPath + "?" + new Date().getTime();
	initMovieThumb(thumbnailPath, thumbnailPath);
}
function setLead(lead){
	if(!lead) return;
	$('.item_lead').val(lead);
}
function getLead(){
	return $('.item_lead').val();
}
function setUpdateHistory(history){
	if(!history) return;
	$('.item_update_history').val(history);
}
function getUpdateHistory(){
	return $('.item_update_history').val();
}
function removeTag(tag){
	$(".registed_tag").each(function(){
		if(tag == $(this).text()){
			$(this).parent().remove();
		}
	});
}
function getTagList(){
	var result = [];
	$(".registed_tag").each(function(){
		result.push($(this).text());
	});
	return composeCSV(result);
}
function clearTagList(){
	$(".registed_tag").each(function(){
		$(this).parent().remove();
	});
}
function getServerTag(){
	callIce("updateTagList");
}
function setDescription(description){
	if(!description) return;
	setTimeout(function(){
		editor.setHtml(false, description);
		modifyMaterialPath()
	}, 500);
}
function getDescription(){
	html = editor.getCleanContents();
	var htmlFilter = new HtmlFilter();
	html = htmlFilter.execute(html);
	html = html.split(getMaterialPath()).join("");
	html = html.split(replaceSpace(getMaterialPath())).join("");
	html = html.split(encodeURI(getMaterialPath())).join("");
	return html;
}
function getDescriptionFileList(){
	html = $("<div>" + editor.getCleanContents() + "</div>");
	fileList = new Array() ;
	html.find("img").each(function(){
		src = $(this).attr("src");
		src = src.split(getMaterialPath()).join("");
		src = src.split(replaceSpace(getMaterialPath())).join("");
		src = src.split(encodeURI(getMaterialPath())).join("");
		fileList[fileList.length] = src;
	});
	return composeCSV(fileList);
}
function makeCatalogList(){
	catalogList = "";
	if(makeCatalog){
		$("div.group").each(function(){
			group_name = $(this).find("input.group_name").val();
			group_name = group_name.replace(/\//g,"%2F");
			//group_name = encodeURI(group_name);
			group_uuid = $(this).attr("uuid");
			catalogList = catalogList + group_name + "," + group_uuid + ",'";
			uuids = [];
			$(this).find("div.part").each(function(){
				uuids.push(this.id.replace(/uuid/g,""));
			});
			catalogList = catalogList + composeCSV(uuids);
			catalogList = catalogList + "'%0A";
		});
	}
	return true;
}
function getCatalogList(cnt){
	return catalogList.substr((cnt * limit), limit);
}
function setMaterialType(materialType){
	if(!materialType) return;
	$('.item_type').html(MATERIAL_TYPE[LANGr][materialType]);
}
function setMaterialGroup(groupName, groupUuid, materialParts, catalogFlag){
	//materialParts : [0]parts_name, [1]parts_thumbnail_path, [2]parts_movie_thumbnail_path, [3]parts_uuid, 
	//[4]parts_uploaded, [5]parts_face_type, [6]parts_ver, [7]growth_flag \r\n....(csv)
	//catalogFlag: [0]その他, [1]未アップロードカテゴリ, [2]アップロードカテゴリ, [3]フェイスありキャラ
	if(!groupName) return;
	if(!makeCatalog && !materialParts) return;
	groupCount++;
	name = (catalogFlag == 1 || catalogFlag == 2) ? groupName : MATERIAL_GROUP[LANGr][groupName.toLowerCase()];
	parts = parseCSV(materialParts, ',', true);
	if(!(is3Ddata && (groupName == "roomparts" || groupName == "smallobjectparts"))){
		addHtml = '<div id="groupNo' + groupCount + '" uuid="' + groupUuid + '" class="group">';
		if(makeCatalog){
			addHtml = addHtml + '<h4>' + getResource('text-category') + groupCount + '</h4>';
			addHtml = addHtml + '<div class="group_edit clear_after">';
			addHtml = addHtml + '<input type="text" name="group_name' + groupCount + '" class="group_name" value="' + name.replace(/%2F/g,"\/").replace(/\"/g, "&quot;") + '" maxlength="40" />';
			addHtml = addHtml + ' ' + getResource('text-attCategory');
			if(groupCount != 1 && catalogFlag != 2){
				addHtml = addHtml + '<button class="base groupDelete red" onclick="groupRemove(this);return false;">' + getResource('text-deleteCategory') + '</button>';
			}
			addHtml = addHtml + '</div>';
			addHtml = addHtml + '<div class="catalog">';
			addHtml = addHtml + '<div class="groupUnset">' + getResource('text-attNoMaterial') + '</div>';
		}else{
			addHtml = addHtml + '<h4>' + name +'</h4>';
		}
		addHtml = addHtml + '<div class="parts">';
		if(catalogFlag == 3){
			addHtml = addHtml + '<div class="partsface">';
		}
		if(materialParts){
			for(var i = 0; i< parts.length; i++){
				j = i + 1;
				if(!parts[i][1]) continue;
				if(catalogFlag == 3 && parts[i][5] == 1){ //フェイス
					addHtml = addHtml + '<div class="model" id="' + parts[i][3] + '" up="' + parts[i][4] + '">';
					if(parts[i][2]){
						if(parts[i][2].match(/^http\:\/\//)){
							addHtml = addHtml + '<a class="colorframe" title="' + parts[i][0] + '" href="' + parts[i][2] + '"><img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/><div class="play"></div></a>';
						}else{
							addHtml = addHtml + '<a class="colorframe" title="' + parts[i][0] + '" href="_movie_thumbnail.html?path=' + parts[i][2] + '"><img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/><div class="play"></div></a>';
						}
					}else{
						addHtml = addHtml + '<img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/>';
					}
					if(isUpload && !parts[i][6]){
						addHtml = addHtml + '<div class="ico ico_upnot">' + getResource('text-noUpload') + '</div>';
					}
					addHtml = addHtml + '<span>' + parts[i][0] + '</span>';
					addHtml = addHtml + '<div class="cleaner separate"></div>';
				}else{
					classPart = "part";
					addHtml = addHtml + '<div class="' + classPart + '" id="uuid' + parts[i][3] + '" up="' + parts[i][4] + '">';
					if(parts[i][2]){
						if(parts[i][2].match(/^http\:\/\//)){
							addHtml = addHtml + '<a class="colorframe" title="' + parts[i][0] + '" href="' + parts[i][2] + '"><img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/><div class="play"></div></a>';
						}else{
						addHtml = addHtml + '<a class="colorframe" title="' + parts[i][0] + '" href="_movie_thumbnail.html?path=' + parts[i][2] + '"><img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/><div class="play"></div></a>';
						}
					}else{
						addHtml = addHtml + '<img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/>';
					}
					if(isUpload && !parts[i][6]){
						addHtml = addHtml + '<div class="ico ico_upnot">' + getResource('text-noUpload') + '</div>';
					}
					addHtml = addHtml + '<p class="wordBreak">';
					if(makeCatalog){
						addHtml = addHtml + parts[i][0];
					}else if(catalogFlag == 3 && parts[i][5] == 2){
						addHtml = addHtml + '<a class="colorface" href="_faces.html?uuid=' + parts[i][3] + '">' + parts[i][0] + '</a>';
					}else{
						addHtml = addHtml + parts[i][0];
					}
					addHtml = addHtml + '</p>';
					if(makeCatalog){
						addHtml = addHtml + '<div class="groupTool">';
						addHtml = addHtml + '<a href="javascript:void(0);" onclick="groupSorting(this, \'l\');return false;" class="toLeft"></a>';
						if(parts[i][4] != '1'){
							addHtml = addHtml + '<a href="javascript:void(0);" onclick="groupMoveMenu(event,this);return false;" class="toMove"></a>';
							addHtml = addHtml + '<a href="javascript:void(0);" onclick="groupDoRemove(this);return false;" class="doRemove"></a>';
						}
						addHtml = addHtml + '<a href="javascript:void(0);" onclick="groupSorting(this, \'r\');return false;" class="toRight"></a>'
						addHtml = addHtml + '</div>';
					}
				}
				addHtml = addHtml + '</div>';
				if(catalogFlag == 3 && parts[j] && parts[j][5] == 1){
					addHtml = addHtml + '<div class="cleaner"></div></div><div class="partsface">';
				}
			}
		}
		addHtml = addHtml + '<div class="cleaner"></div></div><div class="cleaner" style="margin-bottom:10px;"></div></div>';
		if(makeCatalog){
			addHtml = addHtml + '</div>';
		}
		$('#group_end').before(addHtml);
	}
	$('#groups').show();
	$('#update_history').show();
	$(":text").keypress(function(e){
		if(e.keyCode == 13 || e.keyCode == 3){
			return false;
		}
	});
	if(materialParts){
		$("#groupNo" + groupCount + " .groupUnset").hide();
	}
	return true;
}
function addTag(tag){
	if(!tag) return;
	//カンマチェック
	if(tag.indexOf(",") != -1){
		alert(getResource('text-attTagComma'));
		return false;
	}
	//大なり小なりチェック
	if(tag.indexOf(">") != -1){
		alert(getResource('text-attTagGreater'));
		return false;
	}
	if(tag.indexOf("<") != -1){
		alert(getResource('text-attTagLess'));
		return false;
	}
	//空白チェック
	//if(tag.indexOf(" ") != -1 || tag.indexOf("　") != -1){
	//	alert(getResource('text-attTagSpace'));
	//	return false;
	//}
	//重複チェック
	var duplicate = false;
	$(".registed_tag").each(function(){
		if($(this).text() == tag){
			duplicate = true;
			return false;
		}
	});
	if(duplicate){
		$("#input_tag").val("");
		alert(getResource('text-attTagExist'));
		return false;
	}
	var tag_html = '<div class="tag_list_inner border"><span class="registed_tag">' + tag + '</span> <span class="delete_tag"><a href="javascript:void(0);" class="icon icons_sp trash i20"></a></span></div>';
	$("#tag_list").append(tag_html);
	$(".delete_tag").unbind("click");
	$(".delete_tag").bind("click", function(){
		removeTag($(this).parent().children(".registed_tag").text());
	});
	$("#input_tag").val("");
	return true;
}
function addInputTag(){
	var tag = $("#input_tag").val();
	if(tag.length > 20){
		alert(getResource('text-attTagOver'));
		return false;
	}
	if(tag.indexOf(" ") != -1 || tag.indexOf("　") != -1){
		alert(getResource('text-attTagSpace'));
		return false;
	}
	if(!tag){
		return false;
	}
	return addTag(tag);
}
function setTempSavedIcon(dispFlag){
	if (dispFlag == "1"){
		$("#iSave").show();
		$("[text-contentid]").removeClass('t_top');
	}else{
		$("#iSave").hide();
	}
}
function setUploadedIcon(dispFlag){
	if (dispFlag == "1"){
		$("#iUploaded").show();
		$("[text-contentid]").removeClass('t_top');
	}else{
		$("#iUploaded").hide();
	}
}

//グループ編集
function groupSorting(obj, direction){
	target = $(obj).parents().get(1);
	selfid = target.id;
	groupid = $(obj).parents().get(4).id;
	$("#" + groupid + " div.part").removeAttr("style");
	$("#" + groupid + " div.part").each(function(i){
		if(direction == "l"){
			j = i+1;
		}else{
			j = i-1;
		}
		if($("#" + groupid + " div.part").get(j) && $("#" + groupid + " div.part").get(j).id == selfid){
			$("#" + selfid).remove();
			if(direction == "l"){
				$(this).before(target);
			}else{
				$(this).after(target);
			}
			return false;
		}
	}
	);
	$("a.colorframe").colorbox({width:"270px", height:"330px", opacity:0.6, iframe:true}); //動画サムネイル
	$("#" + groupid + " div.part").autoHeight({column:5, clear:1});
}
function groupMoveMenu(evt,obj){
	viewGroupMenu = false;
	selfid = $(obj).parents().get(1).id;
	$("#groupMenu .selectGroup").remove();
	$("div.group").each(function(){
		addHtml = '<li class="selectGroup" onclick="groupToMove(\'' + this.id + '\', \'' + selfid + '\');">&gt; ' + $(this).find("input.group_name").val() + '</li>';
		$("#groupMenuEnd").before(addHtml);
	});
	
	if(document.all){
		mouseX = document.documentElement.scrollLeft + evt.clientX;
		mouseY = document.documentElement.scrollTop  + evt.clientY;
	}else{
		mouseX = evt.pageX;
		mouseY = evt.pageY;
	}
	menuH = $("#groupMenu").height();
	menuW = $("#groupMenu").width();
	bodyH = $("body").innerHeight() - $(".button_bar").height();
	bodyW = $("body").innerWidth();
	if((menuH + mouseY) > bodyH){
		menuY = (mouseY - menuH) - 5;
	}else{
		menuY = mouseY;
	}
	if((menuW + mouseX) > bodyW){
		menuX = (mouseX - menuW);
	}else{
		menuX = mouseX + 10;
	}
	$("#groupMenu").css("top", menuY + "px");
	$("#groupMenu").css("left", menuX + "px");
	$("#groupMenu").show();
	setTimeout(function(){viewGroupMenu = true;}, 200);
}
function groupMoveCancel(){
	$("#groupMenu").hide();
	viewGroupMenu = false;
}
function groupToMove(toGroup, targetId){
	target = $("#" + targetId);
	hereGroup = target.parents().get(1);
	$("#" + targetId).remove();
	$(hereGroup).find(".part").removeAttr("style");
	$(hereGroup).find(".part").autoHeight({column:5, clear:1});
	if($(hereGroup).find(".part").length == 0){
		$(hereGroup).find(".groupUnset").show();
	}
	$("#" + toGroup + " .parts").find("div.cleaner").before(target);
	$("#" + toGroup + " .groupUnset").hide();
	$("#" + toGroup).find("div.part").removeAttr("style");
	$("#" + toGroup).find("div.part").autoHeight({column:5, clear:1});
	$("a.colorframe").colorbox({width:"270px", height:"330px", opacity:0.6, iframe:true}); //動画サムネイル
	groupMoveCancel();
}
function groupDoRemove(obj){
	selfid = $(obj).parents().get(1).id;
	msg = getResource('text-deleteMaterial', $("#" + selfid).find("p").text());
	if(confirm(msg)){
		materialNumber--;
		setMaterialNumber(materialNumber);
		hereGroup = $(obj).parents().get(4);
		$("#" + selfid).remove();
		$(hereGroup).find(".part").removeAttr("style");
		$(hereGroup).find(".part").autoHeight({column:5, clear:1});
		if($(hereGroup).find(".part").length == 0){
			$(hereGroup).find(".groupUnset").show();
		}
	}
	return false;
}
function groupAdd(){
	if(groupCount >= groupMax){
		alert(getResource('text-attCategoryOver', groupMax));
		return false;
	}
	setMaterialGroup(getResource('text-category') + (groupCount + 1), "", "", 1);
}
function groupRemove(Obj){
	group = $(Obj).parents().get(1);
	if($(group).find("div.part[up='1']").length > 0){
		alert(getResource('text-attNotDeleteMaterial'));
		return false;
	}else{
		msg = getResource('text-confirmDeleteCategory', $(group).find(".group_name").val());
		if(confirm(msg)){
			materialNumber -= $(group).find("div.part").length;
			setMaterialNumber(materialNumber);
			$(group).remove();
			groupCount--;
			i=1;
			$(".group h4").each(function(){
				$(this).text(getResource('text-category')+i);
				i++;
			});
			i=1;
			$(".group").each(function(){
				$(this).attr("id","groupNo"+i);
				ititle =  $(this).find("input.group_name");
				$(ititle).attr("name", "group_name" + i);
				i++;
			});
		}
	}
	return false;
}
function checkForm(){
	var title = getTitle();
	if(title.length > 40){
		alert(getResource('text-attTitleOver'));
		return false;
	}
	if(title.length <= 0){
		alert(getResource('text-attTitleRequired'));
		return false;
	}
	title = title.replace(/(^[\s　]+)|([\s　]+$)/g, "");
	setTitle(title);
	if(title.length <= 0){
		alert(getResource('text-attTitleSpace'));
		return false;
	}
	var lead = getLead();
	if(lead.length > 500){
		alert(getResource('text-attLeadOver'));
		return false;
	}
	var tags = [];
	$(".registed_tag").each(function(){
		tags.push($(this).text());
	});
	for (var tag in tags){
		//文字数制限チェック
		if(tags[tag].length > 20){
			alert(getResource('text-checkTagLimit', tags[tag]));
			return false;
		}
		//カンマチェック
		if(tags[tag].indexOf(",") != -1){
			alert(getResource('text-checkTagComma'));
			return false;
		}
		//空白チェック
		if(tags[tag].indexOf(" ") != -1 || tags[tag].indexOf("　") != -1){
			alert(getResource('text-checkTagSpace'));
			return false;
		}
	}
	
	html = editor.getCleanContents();
	if(html.length > 10000){
		alert(getResource('text-attDescriptionOver'));
		html = "";
		return false;
	}
	html = "";
	
	if(makeCatalog){
		checkErr = 0;
		$("input.group_name").each(function(){
			group_name = $(this).val();
			name = $(this).attr("name");
			num = name.replace("group_name", "");
			if(group_name.length > 40){
				alert(getResource('text-attCategoryNameOver', num));
				checkErr++;
				return false;
			}
			if(group_name.length <= 0){
				alert(getResource('text-attCategoryNameRequired', num));
				checkErr++;
				return false;
			}
			group_name = group_name.replace(/(^[\s　]+)|([\s　]+$)/g, "");
			$(this).val(group_name);
			if(group_name.length <= 0){
				alert(getResource('text-attCategoryNameSpace', num));
				checkErr++;
				return false;
			}
			if(group_name.indexOf(",") != -1){
				alert(getResource('text-attCategoryNameComma', num));
				checkErr++;
				return false;
			}
		});
		if(checkErr > 0){
			return false;
		}
	}
	
	var history = getUpdateHistory();
	if(history.length > 1000){
		alert(getResource('text-attHistoryOver'));
		return false;
	}
	
	return true;
}
function notThumbnail(obj,size){
	if(!size) size = "m";
	var path=(isPhone())?"../":"";
	obj.src=path+"img/noimage/noimage_"+size+".jpg";
}
function goDetail(uuid){
	var chk = checkForm();
	if(!chk){
		return false;
	}
	makeCatalogList();
	params = {
		'contentid' : getContentId(),
		'uuid'      : uuid,
		'uuids'     : "",
		'cnt'       : 0,
		'items'     : "",
		'clcnt'     : Math.ceil(catalogList.length / limit),
		'template'  : "index"
	}
	callIce("viewCatalogItem", params);
}
function saveMaterial(){
	var chk = checkForm();
	if(!chk){
		return false;
	}
	makeCatalogList();
	params = {
		'items' : "",
		'clcnt' : Math.ceil(catalogList.length / limit)
	}
	callIce("saveMaterial", params);
}
function uploadSettingMaterial(){
	var chk = checkForm();
	if(!chk){
		return false;
	}
	makeCatalogList();
	params = {
		'items' : "",
		'clcnt' : Math.ceil(catalogList.length / limit)
	}
	callIce("uploadSettingMaterial", params);
}
function backCatalog(flag, tempate){
	params = {
		'contentid' : getContentId(),
		'template'  : tempate,
		'uuids'     : "",
		'cnt'       : 0,
		'save'      : flag
	}
	if(flag){
		var chk = checkForm();
		if(!chk){
			return false;
		}
		makeCatalogList();
		params['items'] = "",
		params['clcnt'] = Math.ceil(catalogList.length / limit);
	}
	callIce("viewCatalog", params);
}
function goModelerCheck(){
	var chk = checkForm();
	if(!chk){
		return false;
	}
	params = {};
	_callIce("goModelerBtn", params);
}
function setFrameName(){
	var frame = $("iframe");
	
	for(var i=0; i < frame.length; i++){
		var targetFrame = frame[i].name;
		if(targetFrame){
			frameMessage(targetFrame, 'setFrameName', targetFrame);
			break;
		}
	}
}
function setFaceTitle(title){
	var frame = $("iframe");
	
	for(var i=0; i < frame.length; i++){
		var targetFrame = frame[i].name;
		if(targetFrame){
			frameMessage(targetFrame, 'setTitle', title);
			break;
		}
	}
}
function setFaceGroup(faceName, materialParts){
	var frame = $("iframe");
	
	for(var i=0; i < frame.length; i++){
		var targetFrame = frame[i].name;
		if(targetFrame){
			frameMessage(targetFrame, 'setFaceGroup', [faceName, materialParts]);
			frameMessage(targetFrame, 'setColor', $('body style').html());
			break;
		}
	}
}
function setGrowth(flag){}
function setLayout(){}
function initializeComplete(){
	setTimeout(function(){editor.focusAndPlaceCursorAtStart();}, 500);
	$('#player').find(".panel").triggerHandler('load');
	$("a.colorframe").colorbox({width:"270px", height:"330px", opacity:0.6, iframe:true}); //動画サムネイル
	if(isPhone()){
		$("a.colorface").colorbox({width:"90%", height:"90%", opacity:0.6, iframe:true}).click(function(){setTimeout(setFrameName, 500);}); //表情パーツ
	}else{
		$("a.colorface").colorbox({width:"665px", height:"400px", opacity:0.6, iframe:true}).click(function(){setTimeout(setFrameName, 500);}); //表情パーツ
	}
	$('.parts').each(function(){
		if(!isPhone()) $(this).children('.part').autoHeight({column:5, clear:1});
	});
	$('.partsface').each(function(){
		if(!isPhone()) $(this).children('.part').autoHeight({column:5, clear:1});
	});
	setLayout();
	if(goCoordinate){
		$("#goCoordinateBtn").show();
	}
	if(goModeler){
		$("#goModelerBtn").show();
	}
	if(!isMine && inCatalog){
		$("#backCatalogBtn, #backCatalogBtnTop").hide();
	}
	setTimeout(function(){editor.focusAndPlaceCursorAtStart();}, 500);
	setHover();
	_afterFadeIn();
	$(window).resize();

	// event initialize
	$("#add_tag").click(addInputTag);
	$(":text").keypress(function(e){
		if(e.keyCode == 13 || e.keyCode == 3){
			return false;
		}
	});
	$("#input_tag").keypress(function(e){
		if(e.keyCode == 13 || e.keyCode == 3){
			addInputTag();
			return false;
		}
	});
	$("#toolbar").mouseover(function(){
		setTimeout(function(){editor.focus();}, 500);
	});
	$("body").click(function(){
		if(viewGroupMenu){
			groupMoveCancel();
		}
	});
}
$(window).resize(function(){
	if($('.buttonLineR').height() > 50){
		$('.buttonLineR').css('top',0);
	} else {
		$('.buttonLineR').css('top','');
	}
});
function _afterSetServer(){
	$("#input_tag").attr('placeholder', getResource('text-defaultTag'));
	var editorJs=document.createElement("script");
	editorJs.type="text/javascript";
	editorJs.src=(isPhone()) ? "../scripts/editor.js" : "scripts/editor.js";
	document.body.appendChild(editorJs);
	setTimeout(function(){
		var app = new editor.App(LANG);
		// data initialize
		var getVars = getUrlVars();
		var params = {}
		if(getVars['uuid']){
			params.uuid = getVars['uuid'];
			setMode('in_catalog');
		}
		$("iframe").contents().find("html").bind("mousedown", function(e){
			if(e.target.tagName == 'HTML') return false;
		});
		callIce("initializeMaterialDetail", params);
	}, 250);
}