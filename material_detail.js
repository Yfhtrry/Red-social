var item_path;
var ifrDescription;
var descriptionHtml = null;
var groupCount      = 0;
var isDownload      = false;
var isCatalog       = false;
var is3Ddata        = false;
var isFace          = false;
var catalogVersion  = null;
var catalogRegisted = null;
var compare         = null;
var inCatalog       = false;
var goCoordinate    = false;
var goModeler       = false;
var isLicensed      = false;
var isMine          = false;
var add3Ddata       = false;

var limit = 100;
var dl_uuids = [];
var ck_uuids = [];

function setMode(mode){
	if(mode == "in_catalog"){
		inCatalog = true;
		$("#iCatalog").show();
		$("[text-contentid]").removeClass('t_top');
		$("#saveBtn").hide();
		$("#backCatalogSaveBtn").show();
		$("#getTagBtn").hide();
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
	if(mode == "add_3d_data"){
		add3Ddata = true;
	}
}
function setVersion(ver, reg){
	catalogVersion = ver;
	catalogRegisted = reg.replace(/\s|\/|\:/g, "");
	compare = (catalogRegisted && catalogVersion > catalogRegisted) ? catalogVersion : null;
}
function setMaterialPath(path){
	item_path = path;
}
function getMaterialPath(){
	return item_path;
}
function setContentId(contentId){
	if(!contentId) return;
	isDownload = true;
	if (!isLicensed && !inCatalog){
		$("#getTagBtn").show();
		$("#getUpdate").show();
	}
	$('.item_content_id').text(contentId);
}
function getContentId(){
	var cid = $('.item_content_id').html();
	if(!parseInt(cid)) return 'none';
	return cid;
}
function setGrowthId(gid){}
function setTitle(title){
	if(!title) return;
	$('input[name="item_title"]').val(title);
	setComposition(title);
}
function getTitle(){
	return $('input[name="item_title"]').val();
}
function setComposition(title){
	if(!title) return;
	$('#composition').text(getResource('text-composition', title));
}
function setLocalTitle(title){
	if(!title) return;
	$('.item_local_title').val(title);
}
function getLocalTitle(){
	return $('input[name="item_local_title"]').val();
}
function setMaterialNumber(num){
	if(!num) return;
	if(!isCatalog) return;
	$('.item_number').text(num);
	$('#item_number').show();
}
function setCreatedTool(toolCode){
	if(!toolCode) return;
	$('.item_created_tool').text(CREATED_TOOL[LANGr][toolCode]);
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
	$("#thumb_area").html("");
	$("#movie_thumb_area").html("");
	$("#movie_thumb_area").append(movie_player);
	thumbnailPath = thumbnailPath + "?" + new Date().getTime();
	initMovieThumb(thumbnailPath, thumbnailPath);
}
function setLead(lead){
	if (!lead) return;
	lead = encode_entities(lead);
	txtVal = lead.replace(/\r\n|\n|\r/g, "<br />");
	$('.item_lead').html(txtVal);
}
function getLead(){
	return $('.item_lead').html();
}
function setUpdateHistory(history){
	if(!history) return;
	history = encode_entities(history);
	txtVal = history.replace(/\r\n|\n|\r/g, "<br />");
	$('.item_update_history').html(txtVal);
}
function getUpdateHistory(){
	return $('.item_update_history').html();
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
	if (!description) return;
	descriptionHtml = description;
}
function setMaterialType(materialType){
	if(!materialType) return;
	$('.item_type').html(MATERIAL_TYPE[LANGr][materialType]);
}
function setMaterialGroup(groupName, groupUuid, materialParts, catalogFlag){
	//materialParts : [0]parts_name, [1]parts_thumbnail_path, [2]parts_movie_thumbnail_path, [3]parts_uuid, 
	//[4]parts_parent_uuid, [5]parts_exist, [6]parts_require, [7]parts_select, [8]parts_ver, [9]growth_flag \r\n....(csv)
	//catalogFlag: [0]その他, [1]未アップロードカテゴリ, [2]アップロードカテゴリ, [3]フェイスありキャラ
	if(!groupName) return;
	if(!materialParts && !(catalogFlag == 1 || catalogFlag == 2)) return;
	groupCount++;
	if(catalogFlag == 1 || catalogFlag == 2){
		name = groupName;
		isCatalog = true;
		$('[text-titleMaterialDetail]').html(getResource('text-titleCatalogDetail'));
	}else{
		name = MATERIAL_GROUP[LANGr][groupName.toLowerCase()];
	}
	if(catalogFlag == 3){
		isFace = true;
	}
	if(!(is3Ddata && (groupName == "roomparts" || groupName == "smallobjectparts" || groupName == "featurepointgroup"))){
		addHtml = '<div id="groupNo' + groupCount + '" uuid="' + groupUuid + '">';
		addHtml = addHtml + '<h4 class="clear_after"><span class="left_float wordBreak" style="max-width:28em;">' + name +'</span>';
		if(isCatalog){
			if(isDownload && catalogFlag != 3){
				addHtml = addHtml + '<a href="javascript:void(0)" onclick="checkAllItem(this, false); return false;" class="item_all_check">' + getResource('text-allCancel') + '</a><a href="javascript:void(0)" onclick="checkAllItem(this, true); return false;" class="item_all_check">' + getResource('text-allSelect') + '</a>';
			}
		}
		addHtml = addHtml + '</h4>';
		addHtml = addHtml + '<div class="parts">';
		if(catalogFlag == 3){
			addHtml = addHtml + '<div class="partsface">';
		}
	}else{
		addHtml = "";
	}
	parts = parseCSV(materialParts, ',', true);
	hide = {};
	for(var i=0; i < parts.length; i++){
		j = i + 1;
		if(parts[i][1] && !(is3Ddata && (groupName == "roomparts" || groupName == "smallobjectparts" || groupName == "featurepointgroup"))){ //表示
			if(catalogFlag == 3 && !parts[i][3] && parts[i][4]){ //フェイス
				addHtml = addHtml + '<div class="model" id="' + parts[i][4] + '">';
				if(parts[i][2]){
					if(parts[i][2].match(/^http\:\/\//)){
						addHtml = addHtml + '<a class="colorframe" title="' + parts[i][0] + '" href="' + parts[i][2] + '"><img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/><div class="play"></div></a>';
					}else{
					addHtml = addHtml + '<a class="colorframe" title="' + parts[i][0] + '" href="_movie_thumbnail.html?path=' + parts[i][2] + '"><img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/><div class="play"></div></a>';
					}
				}else{
					addHtml = addHtml + '<img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/>';
				}
				if(!isLicensed){
					if(isDownload && parts[i][5] != '1'){
						addHtml = addHtml + '<div class="ico ico_dl">' + getResource('text-noDownload') + '</div>';
					}
					if(isDownload && !parts[i][8]){
						addHtml = addHtml + '<div class="ico ico_upnot">' + getResource('text-noUpload') + '</div>';
					}else if(isDownload && compare && compare == parts[i][8]){
						addHtml = addHtml + '<div class="ico ico_update">' + getResource('text-update') + '</div>';
					}
				}
				addHtml = addHtml + '<span>';
				addHtml = addHtml + parts[i][0] + '</span>';
				addHtml = addHtml + '<div class="cleaner separate"></div>';
			}else{
				addHtml = addHtml + '<div class="part">';
				if(parts[i][2]){
					if(parts[i][2].match(/^http\:\/\//)){
						addHtml = addHtml + '<a class="colorframe" title="' + parts[i][0] + '" href="' + parts[i][2] + '"><img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/><div class="play"></div></a>';
					}else{
					addHtml = addHtml + '<a class="colorframe" title="' + parts[i][0] + '" href="_movie_thumbnail.html?path=' + parts[i][2] + '"><img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/><div class="play"></div></a>';
					}
				}else{
					addHtml = addHtml + '<img src="' + parts[i][1] + '" onerror="notThumbnail(this, \'s\');"/>';
				}
				if(!isLicensed){
					if(isDownload && !parts[i][8]){
						addHtml = addHtml + '<div class="ico ico_upnot">' + getResource('text-noUpload') + '</div>';
					} else if(isDownload && compare && compare == parts[i][8]){
						addHtml = addHtml + '<div class="ico ico_update">' + getResource('text-update') + '</div>';
					}
					if(isDownload && parts[i][5] != '1'){
						addHtml = addHtml + '<div class="ico ico_dl">' + getResource('text-noDownload') + '</div>';
					}
					if(parts[i][7] != 0){
						icheck = 'checked="checked" ';
					}else{
						icheck = "";
					}
					if(parts[i][5] == '1'){
						req = 2;
					}else if(parts[i][6] == '1'){
						req = 1;
					}else{
						req = 0;
					}
					if((parts[i][3] && parts[i][4]) || catalogFlag == 1 || catalogFlag == 2){
						if(parts[i][3] == parts[i][4]){
							iname = "download_uuid[]";
						}else{
							iname = "parent_uuid[]";
							req = (req == 2) ? "" : req;
						}
						if(catalogFlag != 3){
							iatt = "";
							iface = "";
						}else{
							iatt = "";
							iface = ' face="1"';
						}
					}else{
						iname = "download_uuid[]";
						iatt = "";
						iface = "";
					}
					if(catalogFlag == 1 || catalogFlag == 2){
						iuuid = "";
						ival  = parts[i][4];
					}else{
						iuuid = parts[i][3];
						ival  = parts[i][3];
					}
					if(!parts[i][3]){
						ipchk = ' pchk="1"';
					}else{
						ipchk = "";
					}
				}
				addHtml = addHtml + '<p class="wordBreak godetail">';
				if(isCatalog && !parts[i][9]){
					if(isDownload && parts[i][8]){
						addHtml = addHtml + '<input type="checkbox" name="' + iname + '" value="' + ival + '" req="' + req + '" onClick="checkItem(\'' + iuuid + '\', \'' + parts[i][4] + '\')" style="margin-right:5px;" ' + icheck + ipchk + iface + '/>' + iatt;
					}
				}
				if(catalogFlag == 1 || catalogFlag == 2){
					addHtml = addHtml + parts[i][0];
				}else if(catalogFlag == 3 && parts[i][3] && parts[i][4]){
					addHtml = addHtml + '<a href="_faces.html?uuid=' + parts[i][3] + '" class="colorface">' + parts[i][0] + '</a>';
				}else{
					addHtml = addHtml + parts[i][0];
				}
				addHtml = addHtml + '</p>';
			}
			addHtml = addHtml + '</div>';
		}
		if(catalogFlag == 3 && parts[j] && !parts[j][3] && parts[j][4]){
			addHtml = addHtml + '<div class="cleaner"></div></div><div class="partsface">';
		}
	}
	if(!(is3Ddata && (groupName == "roomparts" || groupName == "smallobjectparts" || groupName == "featurepointgroup"))){
		addHtml = addHtml + '<div class="cleaner"></div></div><div class="cleaner" style="margin-bottom:10px;"></div></div>';
	}
	$('#groups').show();
	$('#update_history').show();
	$('#group_end').before(addHtml);
	if(!isLicensed){
		if(isDownload && !isCatalog){
			addHide = '<input type="checkbox" name="download_uuid[]" value="' + groupUuid + '" req="1" checked="checked" ' + '/>';
			$('#hide_end').before(addHide);
		}
		if(isDownload && !inCatalog){
			if(!isCatalog){
				$('#downloadBtn').text(getResource('text-btReDownload'));
			}
			$('#downloadBtn').show();
		}
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
function checkItem(uuid, parentid){
	//選択された時の処理（子アイテムの解除や必須確認）
	if(uuid){
		Obj = $("div.parts input[value='" + uuid + "']");
		if(Obj.attr("req") == 1){
			alert(getResource('text-attRequiredItem'));
			$('input[req="1"][face!="1"]').attr("checked", "checked");
			if(!isCatalog) checkSelect();
			return false;
		}
		if(parentid && Obj.attr("checked")){
			$("div[uuid='" + uuid + "'] input").attr("checked", "checked");
			checkGroup(parentid);
		}else{
			//$("div input[value=" + parentid + "]").removeAttr("checked");
			$("div[uuid='" + uuid + "'] input").removeAttr("checked");
			checkGroup(parentid);
		}
		$('input[req="1"][face!="1"]').attr("checked", "checked");
		if(!isCatalog) checkSelect();
	}else if(parentid){
		Obj = $("div.parts input[value='" + parentid + "']");
		if(Obj.attr("name") == "face_uuid[]"){
			var parent = Obj.parents().get(2);
			$(parent).find("input").each(function(){
				euuid = $(this).val();
				if(euuid == parentid) return true;
				if(Obj.attr("req") == 1){
					if($(this).attr("req") == 1){
						$(this).attr("checked", "checked");
						return true;
					}
				}
				if(Obj.attr("checked")){
					$(this).attr("checked", "checked");
					$("div[uuid='" + euuid + "'] input").attr("checked", "checked");
				}else{
					$(this).removeAttr("checked");
					$("div[uuid='" + euuid + "'] input").removeAttr("checked");
				}
			});
			//checkGroup(parentid);
			if(!isCatalog) checkSelect();
			return false;
		}
		if(Obj.attr("req") == 1){
			alert(getResource('text-attRequiredItem'));
			$('input[req="1"]').attr("checked", "checked");
			if(!isCatalog) checkSelect();
			return false;
		}
		if(Obj.attr("name") == "parent_uuid[]"){
			if(Obj.attr("checked")){
				$("div[uuid='" + Obj.val() + "'] input").attr("checked", "checked");
			}else{
				$("div[uuid='" + Obj.val() + "'] input").removeAttr("checked");
			}
			checkGroup(parentid);
		}
		$('input[req="1"]').attr("checked", "checked");
		if(!isCatalog) checkSelect();
	}
}
function checkAllItem(Obj, flag){
	id = $(Obj).parents().get(1).id;
	$("#" + id + " input").each(function(){
		if(is3Ddata && $(this).attr("req") == 1){
			$(this).attr("checked", "checked");
			return true;
		}
		if(flag){
			$(this).removeAttr("checked");
		}else{
			$(this).attr("checked", "checked");
		}
		if($(this).attr("req") == 2){
			$(this).attr("checked", "checked");
		}
		$(this).click();
	});
}
function checkSelect(){
	if(isFace){
		$("input[name='face_uuid[]']").each(function(){
			checkGroup($(this).val());
		});
	}else if(isCatalog){
		$("input[name='parent_uuid[]']").each(function(){
			checkGroup($(this).val());
		});
	}
}
function checkGroup(groupid){
	var Obj = $("input[value='" + groupid + "']");
	var check = true;
	var disabled = 0;
	var item = 0;
	var part_check = false;
	var pchk = Obj.attr("pchk");
	if(Obj.attr("name") == "download_uuid[]"){
		return;
	}else if(Obj.attr("name") == "face_uuid[]"){
		var parent = Obj.parents().get(2);
		if(!Obj.attr("checked") && $(parent).find("input:checked").length > 0){
			Obj.attr("checked","checked");
		}
		if(Obj.attr("checked")){
			$(parent).find("input[req='1']").attr("checked","checked");
		}
		$(parent).find("input").each(function(){
			if($(this).val() == groupid) return true;
			item++;
			//checkGroup($(this).val());
			if(!$(this).attr("checked")){
				check = false;
				//return false;
			}else{
				part_check = true;
			}
			if($(this).attr("req") == 2){
				disabled++;
			}
		});
	} else if(Obj.attr("name") == "parent_uuid[]"){
		if(!pchk) return;
		var parent = Obj.parents().get(0);
		$("div[uuid='" + groupid + "'] input").each(function(){
			item++;
			if(!$(this).attr("checked")){
				check = false;
				//return false;
			}else{
				part_check = true;
			}
			if($(this).attr("req") == 2){
				disabled++;
			}
		});
	}
	if(item > 0 && check){
		Obj.attr("checked", "checked");
	} else if(item > 0 && !check){
		Obj.removeAttr("checked");
	}
	if(!check && part_check){
		$(parent).find("span.part_check").show();
	}else{
		$(parent).find("span.part_check").hide();
	}
	if(item > 0 && item == disabled){
		var parent1 = Obj.parents().get(1);
		Obj.attr("req", "2");
	}
}
function downloadItem(){
	dl_uuids = [];
	$("#groups input").each(function(){
		if($(this).attr("name") == "face_uuid[]"){
			return true;
		}else if($(this).attr("name") == "parent_uuid[]"){
			if($(this).attr("checked") && $(this).val()){
				dl_uuids.push($(this).val());
			}
		}else if($(this).attr("name") == "download_uuid[]"){
			if($(this).val() && $(this).attr("req") == 1){
				dl_uuids.push($(this).val());
			}else if($(this).attr("checked") == true){
				dl_uuids.push($(this).val());
			}
		}
	});
	$("#hide_parts input").each(function(){
		if($(this).attr("checked") == true){
			dl_uuids.push($(this).val());
		}
	});

	if(dl_uuids.length == 0){
		alert(getResource('text-attSelectItem'));
		return false;
	}
	params = {
		'contentId' : getContentId(),
		'ptype'     : "0",
		'uuids'     : "",
		'cnt'       : Math.ceil(dl_uuids.length / limit)
	};
	callIce("downloadCatalogItem", params);
}
function getDownloadUuids(cnt){
	var uuids = [];
	for(var i=(cnt * limit); i<(cnt+1)*limit; i++){
		if(i >= dl_uuids.length){
			break;
		}
		uuids.push(dl_uuids[i]);
	}
	return composeCSV(uuids);
}
function setColumnHeight(){
	if($('#groups').css("display") == "none"){
		var h = $('.left_column').height();
		$('#description').css("min-height", h - 40 -26 + "px");
	}
}
function encode_entities(s){
	return s.replace(/[<>&"]/g, function(m0){ //"
		return {'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;'}[m0] || m0;
	});
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
	return true;
}
function saveMaterial(){
	var chk = checkForm();
	if(!chk){
		return false;
	}
	callIce("saveMaterial");
}
function notThumbnail(obj,size){
	if(!size) size = "m";
	var path=(isPhone())?"../":"";
	obj.src=path+"img/noimage/noimage_"+size+".jpg";
}
function getCheckUuids(){
	ck_uuids = [];
	$('input[name="download_uuid[]"],input[name="parent_uuid[]"]').each(function(){
		var item = [];
		item.push($(this).val());
		if($(this).attr("checked")){
			item.push('1');
		}else{
			item.push('0');
		}
		ck_uuids.push(composeCSV(item, 1) + '%0A');
	});
	return true;
}
function goDetail(uuid){
	var chk = checkForm();
	if(!chk){
		return false;
	}
	getCheckUuids();
	params = {
		'contentid' : getContentId(),
		'uuid'      : uuid,
		'uuids'     : "",
		'cnt'       : Math.ceil(ck_uuids.length / limit),
		'template'  : "detail"
	};
	callIce("viewCatalogItem", params);
}
function backCatalog(flag){
	if(flag == true){
		var chk = checkForm();
		if(!chk){
			return false;
		}
	}
	getCheckUuids();
	params = {
		'contentid' : getContentId(),
		'template'  : "detail",
		'uuids'     : "",
		'cnt'       : Math.ceil(ck_uuids.length / limit),
		'save'      : flag
	};
	callIce("viewCatalog", params);
}
function goEdit(){
	var chk = checkForm();
	if(!chk){
		return false;
	}
	params = {};
	callIce("goEdit", params);
}
function goModelerCheck(){
	var chk = checkForm();
	if(!chk){
		return false;
	}
	params = {};
	_callIce("goModelerBtn", params);
}
function getSelectUuids(cnt){
	var uuids = "";
	for(var i=(cnt * limit); i<(cnt+1)*limit; i++){
		if(i >= ck_uuids.length){
			break;
		}
		uuids = uuids + ck_uuids[i];
	}
	return uuids;
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
function checkGrowth(){}
function goJudge(job){}
function getUpdate(){
	callIce("getUpdate");
}
function getUpdateInfo(){
	getUpdate();
}
function setLayout(){}
function initializeComplete(){
	// Description
	$('#description').load(function(){
		if(descriptionHtml){
			frameMessage('description', 'setDescription', descriptionHtml);
			frameMessage('description', 'setMaterialPath', getMaterialPath());
		} else {
			if(isPhone()){
				frameMessage('description', 'setDescription', '<img src="../img/common/detail_noimage.png" style="display:block; margin:20px auto;" />');
			} else {
				frameMessage('description', 'setDescription', '<img src="./img/common/detail_noimage.png" style="display:block; margin:35px auto 0;" />');
			}
		}
	});
	$('#description').triggerHandler('load');
	$('#player').find(".panel").triggerHandler('load');
	$("a.colorframe").colorbox({width:"270px", height:"330px", opacity:0.6, iframe:true}); //動画サムネイル
	if(isPhone()){
		$("a.colorface").colorbox({width:"90%", height:"90%", opacity:0.6, iframe:true}).click(function(){setTimeout(setFrameName, 500);}); //表情パーツ
	}else{
		$("a.colorface").colorbox({width:"665px", height:"400px", opacity:0.6, iframe:true}).click(function(){setTimeout(setFrameName, 500);}); //表情パーツ
	}
	
	checkSelect();
	$('.parts').each(function(){
		if(!isPhone()) $(this).children('.part').autoHeight({column:5, clear:1});
	});
	$('.partsface').each(function(){
		if(!isPhone()) $(this).children('.part').autoHeight({column:5, clear:1});
	});
	setColumnHeight();
	setLayout();
	if(goCoordinate){
		$("#goCoordinateBtn").show();
	}
	if(goModeler){
		$("#goModelerBtn").show();
	}
	
	if(isMine){
		if(inCatalog){
			$("#editOnlyBtn").show();
		}else{
			$("#editBtn").show();
		}
	}
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
}
$(window).resize(function(){
	if($('.buttonLineR').height() > 50){
		$('.buttonLineR').css('top',0);
	} else {
		$('.buttonLineR').css('top','');
	}
	setLayout();
});
function _afterSetServer(){
	$("#input_tag").attr('placeholder', getResource('text-defaultTag'));
	// data initialize
	var getVars = getUrlVars();
	var params = {}
	if(getVars['uuid']){
		params.uuid = getVars['uuid'];
		setMode('in_catalog');
	}
	callIce("initializeMaterialDetail", params);
}
