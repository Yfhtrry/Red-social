(function($) {
	$.parapara = function(element, options) {
		var defaults = {
			rownum: null,
			width: null,
			height: null,
			img: null,
			total: null,
			framerate: 10,
			repeat: false,
			start: false,
			border_color: "#4d4d4d",
			slider_num: 10,
			slider_color: "#EAEAEA",
			slider_active_color: "#C2C2C2",
			slider_size: "8px"
		}
		
		var loaded_num = 0;
		var loaded_img = new Array();
		
		var plugin = this;
		plugin.settings = {}
		var $element = $(element),
			element = element;
		
		$element.find(".play").hide();
		$element.html('<div class="croc"></div>' + $element.html() + '<div class="loading"></div><div class="pause"></div><div class="slider_box"></div>');
		$element.find(".pause").hide();
		$element.find(".slider_box").hide();
		$element.find(".croc").hide();
		$element.find(".play").removeAttr("onclick");
		
		/**
		 * event
		**/
		$element.find(".play").click(function(){
			play();
		});
		$element.find(".pause").click(function(){
			pause();
		});
		$element.find(".stop").click(function(){
			stop();
		});
		
		/**
		 * initialize
		**/
		plugin.init = function() {
			plugin.settings = $.extend({}, defaults, options);
			
			//Play&Pause
			$element.find(".play").css("width", plugin.settings.width - 2 + "px").css("height", plugin.settings.height - 2 + "px").css("top", "1px").css("left", "1px").css("border", "solid 1px " + plugin.settings.border_color);
			$element.find(".pause").css("width", plugin.settings.width - 2  + "px").css("height", plugin.settings.height - 2 + "px").css("z-index", "5").css("position", "absolute").css("cursor", "pointer").css("top", "1px").css("left", "1px").css("border", "solid 1px " + plugin.settings.border_color);
			
			//Panel
			$element.find(".croc").css("position", "relative").css("width", plugin.settings.width + "px").css("height", plugin.settings.height + "px").css("overflow", "hidden");
			$element.find(".croc").html('<img class="panel" />');
			
			$element.find(".panel").attr("src", plugin.settings.img);
			$element.find(".panel").css("position", "absolute").css("width",plugin.settings.rownum * plugin.settings.width + "px").css("height", Math.ceil(plugin.settings.total/plugin.settings.rownum) * plugin.settings.height + "px").css("top", "0");
			$element.find(".panel").load(function(){
				$element.find(".croc").show();
				$element.find(".slider_box").show();
				$element.find(".thumb").hide();
				$element.find(".loading").hide();
				render();
				if(plugin.settings.start){
					play();
				} else {
					if(playing_timer == null){
						$element.find(".play").show();
					}
				}
			});
			
			//Slider
			var slider = $element.find(".slider_box");
			for(var i=1; i<=plugin.settings.slider_num; i++){
			  slider.html(slider.html() + '<span class="slider slider_' + i + '" style="cursor: pointer;">◆</span>')
			}
			//slider.css("color", plugin.settings.slider_color);
			slider.css("text-align", "center");
			//slider.css("cursor", "pointer");
			slider.css("font-size", plugin.settings.slider_size);
			slider.find("span").click(function(){
				var tarr = $(this).attr("class").split("_");
				var no = tarr[1];
				var per_slider = Math.floor(plugin.settings.total / plugin.settings.slider_num);
				current_frame = per_slider * (no - 1);
				render();
			});
		}
		
		/***********************
		 * private
		*************************/
		/**
		 * play
		**/
		var playing_timer = null;
		var current_frame = 0;
		var play = function() {
			if(playing_timer != null){
				return;
			}
			var rate = 1000 / plugin.settings.framerate;
			$element.find(".play").hide();
			$element.find(".pause").show();
			playing_timer = setInterval(function(){
				render();
				current_frame++;
				if(current_frame >= plugin.settings.total){
					if(plugin.settings.repeat){
						current_frame = 0;
					}else{
						current_frame = 0;
						pause();
					}
				}
			}, rate);
		}
		
		/**
		 * pause
		**/
		var pause = function(){
			if(playing_timer == null){
				return;
			}
			clearInterval(playing_timer);
			playing_timer = null;
			$element.find(".play").show();
			$element.find(".pause").hide();
		}
		
		/**
		 * stop
		**/
		var stop = function(){
			current_frame = 0;
			render();
			pause();
		}
		
		var render = function(){
			var row = Math.floor(current_frame / plugin.settings.rownum);
			var col = Math.floor(current_frame % plugin.settings.rownum) + 1;
			//上
			var top = row * plugin.settings.height;
			//左
			var left = (col - 1) * plugin.settings.width;
			//下
			var bottom = parseInt(top) + parseInt(plugin.settings.height);
			//右
			var right = parseInt(left) + parseInt(plugin.settings.width);
			$element.find(".panel").css("clip", "rect(" + top + "px " + right + "px " + bottom + "px " + left + "px)")
								   .css("top", "-" + top + "px")
								   .css("left", "-" + left + "px");
			
			//Slider
			$element.find(".slider").css("background-color", plugin.settings.slider_color);
			var per_slider = Math.floor(plugin.settings.total / plugin.settings.slider_num);
			var current_slider = Math.floor(current_frame / per_slider) + 1;
			if(current_slider > plugin.settings.slider_num){
				current_slider = plugin.settings.slider_num;
			}
			$element.find(".slider_" + current_slider).css("background-color", plugin.settings.slider_active_color);
		}
		
		plugin.init();
	}
	
	$.fn.parapara = function(options) {
		return this.each(function() {
			if (undefined == $(this).data('parapara')) {
				var plugin = new $.parapara(this, options);
				$(this).data('parapara', plugin);
			}
		});
	}
})(jQuery);