var fn = {'setFrameName':setFrameName, 'setParentLang':setParentLang};
var frameName = null;

window.addEventListener('message',function(event){
	if(event.data[0] && typeof fn[event.data[0]] !== "undefined"){
		fn[event.data[0]](event.data[1]);
	}
}, false);
function parentMessage(method, value){
	var data = [method, value];
	window.parent.postMessage(data,'*');
}

function setFrameName(name) {
	frameName = name;
	getParentLang();
}
function getParentLang(){
	parentMessage('getParentLang', frameName);
}
function setParentLang(lang){
	setServer('', lang);
	_afterSetParentLang();
}
function _afterSetParentLang(){}