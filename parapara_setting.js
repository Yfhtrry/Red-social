/*
* 動画サムネイル
*/
function initMovieThumb(imagepath, filename, autostart) {
	if(!autostart) autostart = false;
	var params = get_paraparam(filename);
	if(params.frm == 0) return false;
	$("#player").parapara({
		rownum: params.colums,          //１行あたりの画像枚数
		width: params.width,            //１枚あたりの横サイズ
		height: params.height,          //１枚あたりの縦サイズ
		framerate: params.fps,          //1秒あたり何フレーム表示するか
		total: params.frm,              //全部で何フレームか
		repeat: true,                   //繰り返すか
		img: imagepath,                 //読み込む画像
		start: autostart,               //読み込み完了次第再生するか
		border_color: "#4d4d4d",        //内側のボーダー色
		slider_num: 10,                 //スライダーの数
		slider_color: "#555",           //非アクティブなスライダーの色
		slider_active_color: "#C2C2C2", //アクティブなスライダーの色
		slider_size: "10px"             //スライダーのサイズ
	});
	
}

function get_paraparam(url) {
	var result = {
		width:  0,
		height: 0,
		colums: 0,
		fps:    0,
		frm:    0
	};
	var filename = null;
	var chkurl = url.split("?");
	url = chkurl[0];
	if(url.match(".+\\\\(.+?)\.[a-z]+$")) {
		filename = url.match(".+\\\\(.+?)\.[a-z]+$")[1];
	} else if (url.match(".+/(.+?)\.[a-z]+$")) {
		filename = url.match(".+/(.+?)\.[a-z]+$")[1];
	} else {
		return result;
	}
	
	var params = filename.split("_");
	if(params.length != 7 && params.length != 8) return result;
	
	result = {
		width:  params[1].substring(1),
		height: params[2].substring(1),
		colums: params[3].substring(1),
		fps:    params[4].substring(3),
		frm:    params[5].substring(3)
	};
	return result;
}

/*
* 動画サムネイル再生設定
*/
var tm = null;
var per = 10;
var n = 0;
var movie_player = '<div id="player"><div class="play"></div></div>';