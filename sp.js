var initCallIce = null;
var spMode = null;

//---マウスオーバーアクション↓
function setHover(){
	/*$('.bt, .btn').hover(
		function(){
			$(this).children('.bt_color').stop().animate({'opacity' : '0.1'}, 200);
		},
		function(){
			$(this).children('.bt_color').stop().animate({'opacity' : '0.3'}, 500);
		}
	);*/
	if(!$("#animation_area").is(':visible')) $("#animation_area").fadeIn("slow");
}
function _afterFadeIn(){}

function setSideMenuColor(colorText){
	if(!colorText) return;
	var color = colorText.split(':');
	/*
	color[0]：汎用UI文字色
	color[1]：全体の背景色
	color[2]：タブ、メニュー項目の背景色
	color[3]：メニュー項目の選択色
	color[4]：メニュー項目のマウスオーバー色
	color[5]：検索窓の背景色
	color[6]：検索窓の文字色(未入力時)
	color[7]：アクティブ色1 ----v1.9.5
	color[8]：アクティブ色2
	color[9]：アクティブ文字色
	color[10]：スクロールエリア背景色
	color[11]：メニュー項目背景色
	color[12]：項目選択の背景色
	color[13]：テーマ（濃色・淡色）
	 */
	if(typeof SpinColor !== 'undefined') SpinColor = '#'+color[0];
	var style = '<style>'
		+'html,body,input,textarea,button{color:#'+color[0]+';}'
		+'input[type="text"],textarea{background:#'+color[11]+';border-color:#'+color[1]+';}'
		+'a{color:#'+color[0]+';}'
		+'a.link2{color:#'+color[0]+';}'
		+'.active, a:active{background-color:#'+color[4]+';}'
		+'.fbtn{background-color:#'+color[12]+';}'
		+'.fbtn:hover{background-color:#'+color[4]+';}'
		+'.fbtn.ok{background-color:#'+color[7]+';color:#'+color[9]+';}'
		+'.fbtn.ok:hover{background-color:#'+color[8]+';}'
		+'.fbtn.ok:active{background-color:#'+color[7]+';}'
		+'.borderA{border-color:rgba('+parseInt(color[0].substring(0,2),16)+','+parseInt(color[0].substring(2,4),16)+','+parseInt(color[0].substring(4,6),16)+',0.5) !important;}'
		+'.border2{border-color:#'+color[1]+' !important;}'
		+'.borderA{border-color:rgba('+parseInt(color[0].substring(0,2),16)+','+parseInt(color[0].substring(2,4),16)+','+parseInt(color[0].substring(4,6),16)+',0.25) !important;}'
		+'.mark{border-color:#'+color[0]+';}'
		+'.setColor0{background-color:#'+color[0]+';}'
		+'.setColor1{background-color:#'+color[1]+';}'
		+'.setColor2{background-color:#'+color[2]+';}'
		+'.setColor3{background-color:#'+color[3]+';}'
		+'.setColor4{background-color:#'+color[4]+';}'
		+'.setColor5{background-color:#'+color[5]+';}'
		+'.setColor6{background-color:#'+color[6]+';}'
		+'.setColor7{background-color:#'+color[7]+';}'
		+'.setColor8{background-color:#'+color[8]+';}'
		+'.setColor9{background-color:#'+color[9]+';}'
		+'.setColor10{background-color:#'+color[10]+';}'
		+'.setColor11{background-color:#'+color[11]+';}'
		+'.setColor12{background-color:#'+color[12]+';}'
		+'</style>';
	$('body').append(style);
	if(spMode == 'dialog'){
		$('html, body').addClass('setColor2');
		$('h2.label').addClass('borderA').addClass('setColor12');
		$('.fbtn').addClass('borderA');
		$('div.title').addClass('border');
		$('div.title span').addClass('setColor2');
		$('.page_title').addClass('setColor1');
	}
	if(spMode == 'menu'){
		$('html, body').addClass('setColor10');
		$('.page_title').addClass('setColor2').addClass('border2');
		$('.bt').addClass('setColor11');
		$('.bt').hover(function(){
			if($(this).hasClass('thumb')) return;
			$(this).removeClass('setColor11').addClass('setColor4');
		}, function(){
			$(this).removeClass('setColor4').addClass('setColor11');
		});
		$('.bt').click(function(){
			$(this).removeClass('setColor4').addClass('setColor11');
		});
	}
	if(color[13] == '1'){
		$('body').addClass('lights');
	} else {
		$('body').addClass('darks');
	}
	setHover();
}
$(document).ready(function(){
	callIce('getSideMenuColor');
});

