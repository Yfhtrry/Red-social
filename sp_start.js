var ClientId = null;
var UpdateInformation = false;
var _windowResize = false;
function _afterSetServer(){
    if(SERVER && navigator.onLine !== false){
        var read = 0;
        try{
            read = (localStorage.getItem('phone-start-popup'))? localStorage.getItem('phone-start-popup') : 0;
        }catch(e){}
        $('body').append('<script type="text/javascript" src="'+SERVER+'/'+LANG+'/phone-start?read='+read+'"></script>')
    }
    callIce('getClientId');
    callIce('getSideMenuColor');
    callIce('getCanvasList');
    callIce('getProjectHistory',{'limit':10});
    callIce('getUpdateInformation');
}
function _afterSetBaseUrl(){
    if(BaseUrl){
        $('body').append('<script type="text/javascript" src="'+BaseUrl+'/notice/notice.js"></script>')
    }
}
function setClientId(_clientid){
    if(_clientid) ClientId = _clientid;
}
function setCanvasList(json_data){
    var firstTab = null;
    if(json_data){
        try{
            var data = JSON.parse(json_data);
            $('#canvas_tab').html('');
            $('#canvases').html('');
            for(var key in data){
                if(!firstTab) firstTab = key;
                $('#canvas_tab').append('<a href="javascript:void(0);" class="sub" name="'+key+'">'+data[key]['name']+'</a>');
                $('#canvases').append('<div name="'+key+'" class="x-scroll thumb-list group"></div>');
                for(var canvas in data[key]['canvas']){
                    var names = data[key]['canvas'][canvas]['name'].split(/\r\n|\n|\r/);
                    var name = (names[1]) ? names[0]+'<small>'+names[1]+'</small>' : names[0];
                    $('#canvases [name="'+key+'"]').append('<a href="javascript:void(0);" onclick="makeCanvas(this);return false;" canvasid="' + data[key]['canvas'][canvas]['canvasid'] + '"><div class="thumb subbk"><img src="' + data[key]['canvas'][canvas]['thumb'] + '"/></div><span>' + name + '</span></a>');
                }
                $('#canvases [name="'+key+'"]').append('<div class="spacer"></div>');
            }
            $('#canvas_tab').append('<div class="spacer"></div>');
            if(firstTab){
                $('#canvas_tab a').click(function(){changeCanvasGroup(this.name)});
                changeCanvasGroup(firstTab);
                if(!$("#canvas").is(':visible')) $("#canvas").fadeIn("slow");
                adjustThumb('#canvas [name="'+firstTab+'"]');
            }
        }catch(e){
            return;
        }
    }
}
function changeCanvasGroup(_target){
    $('#canvas_tab .on').removeClass('on').addClass('sub');
    $('#canvas_tab [name="'+_target+'"]').removeClass('sub').addClass('on');
    $('#canvases .group').hide();
    $('#canvases .group[name="'+_target+'"]').show();
    adjustThumb('#canvas [name="'+_target+'"]');
    $('#canvases .group').scrollLeft(0);
}
function makeCanvas(obj){
    var canvasid = $(obj).attr('canvasid');
    if(canvasid){
        callIce('makeCanvas', {canvasid:canvasid});
    }
}
function setProjectHistory(json_data){
    var project = null;
    if(json_data){
        try{
            var data = JSON.parse(json_data);
            $('#projects').html('');
            for(var key in data){
                project = key;
                var cloud = (data[key]['cloud']) ? '<i class="icons_sp cloud-on"></i>' : '<i class="icons_sp cloud-off"></i>';
                $('#projects').append('<a href="javascript:void(0);" onclick="doProject(this);return false;" uuid="' + data[key]['uuid'] + '"><div class="thumb subbk"><img src="' + data[key]['thumb'] + '"/>'+cloud+'</div><span>' + data[key]['name'] + '</span></a>');
            }
            $('#projects').append('<div class="spacer"></div>');
            if(project){
                if(!$("#project").is(':visible')) $("#project").fadeIn("slow");
                adjustThumb('#projects');
            }
        }catch(e){
            return;
        }
    }
}
function doProject(obj){
    var uuid = $(obj).attr('uuid');
    if(uuid){
        callIce('doProjectFile', {uuid:uuid});
    }
}
function adjustThumb(_target){
    setTimeout(function(){
        var h = $(_target + ' .thumb').innerHeight();
        $(_target + ' .thumb img').each(function(){
            var hh = $(this).height();
            if(h > hh || h < hh){
                $(this).css('border-radius', '0');
            }
        });
    }, 500);
}
function setUpdateInformation(url){
    UpdateInformation = url;
}
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
    if(color[13] == '1'){
        $('body,#main').addClass('lights');
    } else {
        $('body,#main').addClass('darks');
    }
    if(!$('#main').is(':visible')) $('#main').fadeIn('slow');
}
function setViewport(force){
    if(_windowResize) return;
    _windowResize = true;
    setTimeout(function(){
        var col = 2; //2段組:560
        if(window.outerWidth > 960){
            col = 5;
        }else if(window.outerWidth > 770){
            col = 4;
        }else if(window.outerWidth > 580){
            col = 3;
        }
        $("meta[name='viewport']").attr("content",'width='+(250 * col + 20 * (col + 1))+',user-scalable=no');
        _windowResize = false;
    },50);
}
function pushBackButton(){
    if(checkMaintenance()) return 1;
    if(checkPopup()) return 1;
    return 0;
}
function checkMaintenance(){
    return false;
}
function checkPopup(){
    return false;
}

$(window).resize(function(){setViewport(true)});
$(window).on('orientationchange', function(){scrollTop()});
$(document).ready(function(){
    setViewport();
    setTimeout(function(){
        window.scrollTo(0,0);
        if(navigator.onLine === false){
            $('.offline').removeClass('offline');
        }else{
            $('.online').removeClass('online');
        }
    }, 150);
});
