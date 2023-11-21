////////////////////////////////////////////////////
//
//　SlideMove
//
////////////////////////////////////////////////////
var spinner = null;
var SpinColor = null;

$(function(){
	//$('#animation_area:not(body#index #animation_area)').css({display:'block',marginLeft:$(window).width(),opacity:'0'});
	//$('#animation_area:not(body#index #animation_area)').animate({marginLeft:'0px',opacity:'1'},500);

	//$('body#index #animation_area').css({display:'block',opacity:'0'});
	//$('body#index #animation_area').animate({opacity:'1'},1000);

	$('a.animate_action').click(function(){
		var path = $(this).attr("href");
		spinScreen(path);
		return false;
	});
});

function spinScreen(path, nonLocation) {
	$('#main_container, #footer').animate({marginLeft:'-=' + $(window).width() + 'px',opacity:'0'},400,function(){
		if(!nonLocation) {
			location.href = path;
		}
	});
	var color = (SpinColor) ? SpinColor : '#fff';
	//preloader(spin.js http://fgnass.github.io/spin.js/)
	var opts = {
		lines: 17,				// The number of lines to draw
		length: 0,				// The length of each line
		width: 4,				// The line thickness
		radius: 35,				// The radius of the inner circle
		corners: 0,				// Corner roundness (0..1)
		rotate: 0,				// The rotation offset
		direction: 1,			// 1: clockwise, -1: counterclockwise
		color: color,			// #rgb or #rrggbb or array of colors
		speed: 1,				// Rounds per second
		trail: 100,				// Afterglow percentage
		shadow: false,			// Whether to render a shadow
		hwaccel: false,			// Whether to use hardware acceleration
		className: 'spinner',	// The CSS class to assign to the spinner
		zIndex: 2e9,			// The z-index (defaults to 2000000000)
		top: 'auto',			// Top position relative to parent in px
		left: 'auto'			// Left position relative to parent in px
	};
	var target = document.getElementById('disp');
	spinner = new Spinner(opts).spin(target);
	$('#disp').css({opacity:'0.5'});
	//preloader end
	return false;
}

function spinOff(){
	setTimeout(function(){
		if(spinner){
			$('#main_container, #footer').stop();
			spinner.stop();
		}
		$('#main_container, #footer').css({marginLeft:'0px',opacity:'1'});
		$('#disp').css({opacity:'1'});
		return false;
	}, 50);
}