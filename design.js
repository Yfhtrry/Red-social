// JavaScript Document

//ボタンマウスオーバー/////////////////////////////////////////////////////////////
$(function(){
	$(".button_bar button").css("cursor", "pointer").hover(
	function(){
		$(this).stop().animate({"opacity" : "0.6"}, 100);
	},
	function() { 
		$(this).stop().animate({"opacity": "1"}, 100);
	});
});
$(function(){
	$(".material_thumbnail #btn_select_thumb").css("cursor", "pointer").hover(
	function(){
		$(this).stop().animate({"opacity" : "0.6"}, 100);
	},
	function() { 
		$(this).stop().animate({"opacity": "1"}, 100);
	});
	});

