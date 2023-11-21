var project_path = "";
var noimage       = false;

function startupApplication(app){}
function setMode(mode){}
function modifyMaterialPath(){
	var uri = location.href;
	uri = uri.substring(0, uri.lastIndexOf("/") + 1);
	$("#editor").contents().find("img").each(function(){
		var src = $(this).attr("src");
		if(src){
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
	project_path = path;
}
function getMaterialPath(){
	return project_path;
}
function replaceSpace(str){
	return str.split(" ").join("%20");
}
function setContentId(contentId){
	if(!contentId) return;
	isDownload = true;
	if (!isLicensed) $("#getTagBtn").show();
	$('.item_content_id').text(contentId);
}
function getContentId(){
	return $('.item_content_id').html();
}
function setTitle(title){
	if(!title) return;
	$('input[name="item_title"]').val(title);
}
function getTitle(){
	return $('input[name="item_title"]').val();
}
function setCreatedTool(toolCode){
	if(!toolCode) return;
	$('.item_created_tool').text(CREATED_TOOL[LANGr][toolCode]);
}
function setThumbnail(mime, base64image){
	var img_src = "data:" + mime + ";base64," + base64image;
	$("#movie_thumb_area").html("");
	$("#thumb_area").html("");
	$("#thumb_area").append('<img src="' + img_src + '" width="120" height="120" />');
}
function setThumbnailPath(thumbnailPath){
	if(!thumbnailPath) return;
	$("#movie_thumb_area").html("");
	$("#thumb_area").html("");
	$("#thumb_area").append('<img src="' + thumbnailPath + '" width="120" height="120" />');
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
function setDocumentType(documentType){
	//if(!documentType) return;
	//$('.item_type').html(DOCUMENT_TYPE[LANGr][documentType]);
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
		add_tag_blur();
		return false;
	}
	
	var tag_html = '<div class="tag_list_inner"><span class="registed_tag">' + tag + '</span> <span class="delete_tag"><a href="javascript:void(0);" class="icon trash"></a></span></div>';
	$("#tag_list").append(tag_html);
	$(".delete_tag").unbind("click");
	$(".delete_tag").bind("click", function(){
		removeTag($(this).parent().children(".registed_tag").text());
	});
	$("#input_tag").val("");
	add_tag_blur();
	return true;
}
function addInputTag(){
	add_tag_focus();
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
		add_tag_blur();
		return false;
	}
	return addTag(tag);
}
var default_tag_txt;
function add_tag_focus(){
	//デフォルトメッセージの場合はフォーカス時、消去する。また、文字色を起こす
	if($('#input_tag').val() != default_tag_txt)return;
	$('#input_tag').val('');
	$('#input_tag').css('color', '#000');
}
function add_tag_blur(){
	//フォーカスを失う時、空文字の場合のみデフォルトメッセージを表示する。また、文字色を寝かす
	if($('#input_tag').val() != '' && $('#input_tag').val() != default_tag_txt)return;
	$('#input_tag').val(default_tag_txt);
	$('#input_tag').css('color', '#c0c0c0');
}
function encode_entities(s){
	return s.replace(/[<>&"]/g, function(m0){ //"
		return{'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;'}[m0] || m0;
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
			alert(getResource('text-checkTagLimit20', tags[tag]));
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
	return true;
}
function saveDocument(){
	var chk = checkForm();
	if(!chk){
		return false;
	}
	callIce("saveDocument");
}
function notThumbnail(obj,size){
	if(!size) size = "m";
	var path=(isPhone())?"../":"";
	obj.src=path+"img/noimage/noimage_"+size+".jpg";
}
function initializeComplete(){
	setTimeout(function(){editor.focusAndPlaceCursorAtStart();}, 500);
	$("#openFolderBtn").hide();
	$("#goPaintBtn").hide();
	$("#goPaintRcBtn").hide();
	$("#goActionBtn").hide();
	$("#goCoordinateBtn").hide();
	$("#goModelerBtn").hide();
	
	setHover();
	_afterFadeIn();

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
			add_tag_focus();
			return false;
		}
	});
	add_tag_blur();
	$("#input_tag").focus(function(){
		add_tag_focus();
	});
	$("#input_tag").blur(function(){
		add_tag_blur();
	});
	$("#toolbar").mouseover(function(){
		setTimeout(function(){editor.focus();}, 500);
	});
}

function _afterSetServer(){
	default_tag_txt = getResource('text-defaultTag');
	add_tag_blur();
	var editorJs=document.createElement("script");
	editorJs.type="text/javascript";
	editorJs.src="scripts/editor.js";
	document.body.appendChild(editorJs);
	setTimeout(function(){
		var app = new editor.App(LANG);
		$("iframe").contents().find("html").bind("mousedown", function(e){
			if(e.target.tagName == 'HTML') return false;
		});
		// data initialize
		var params = {}
		callIce("initializeDocumentDetail", params);
	}, 250);
}