var vg = null;

$(document).ready(function(){
	setHover();
	startFadeIn();
});
$(window).load(function(){
//	_afterFadeIn();
});

function _afterSetServer() {
	if(SERVER){
		$('a.animate_action_http').click(function(){
			var path = $(this).attr("href");
			spinScreen(path, "non");
			return false;
		});
	}
	setHover();
	_afterFadeIn();
}
function startFadeIn() {
	//if(OS != "Win") return false;
	$("#animation_area").css({display:'none'}).fadeIn("slow");
	//---グリッドアニメーション制御↓
	vg = $("#main_container").vgrid({
		easing: "easeOutQuint",
		time: 400,
		delay: 20,
		wait: 500
	});
	setTimeout(vgRefresh,50);
}
function _afterFadeIn() {
	if(vg) {
		vgRefresh();
		return false;
	}
	$("#animation_area").css({display:'none'}).fadeIn("slow");
	//---グリッドアニメーション制御↓
	if(!vg) {
		vg = $("#main_container").vgrid({
			easing: "easeOutQuint",
			time: 400,
			delay: 20,
			wait: 500
		});
	}
}
function vgRefresh() {
	if(vg) vg.vgrefresh();
}

//---マウスオーバーアクション↓
function setHover() {
	$('.bt_hover a .hover_opacity02, a.bt_hover .hover_opacity02').css({opacity:'0.3'});
	$('.bt_hover a, a.bt_hover').hover(
		function(){
			$(this).children('.hover_opacity01').stop().animate({'opacity' : '0.5'}, 200);
			$(this).children('.hover_opacity02').stop().animate({'opacity' : '0.1'}, 200);
			$(this).children('.hover_opacity03').stop().animate({'opacity' : '0.8'}, 200);
		},
		function () {
			$(this).children('.hover_opacity01').stop().animate({'opacity' : '1'}, 500);
			$(this).children('.hover_opacity02').stop().animate({'opacity' : '0.3'}, 500);
			$(this).children('.hover_opacity03').stop().animate({'opacity' : '1'}, 500);
		}
	);
	$('a.bt_box, a.bt_back').click(
		function(){
			$(this).css("background","#cccccc");
			$(this).animate({'opacity' : '0.5'}, 200, 'linear', function(){$(this).css({'background' : 'transparent', 'opacity' : '1.0'});});
		}
	);
/*	$('a.bt_box, a.bt_back').hover(
		function(){
		},
		function(){
			$(this).css("background-color","transparent");
			$(this).css("background-image","url(img/start/bt_type01_gradation.png)");
			$(this).css("opacity","1.0");
		}
	);*/
}
