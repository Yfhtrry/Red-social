var fn = {'getParentLang':getParentLang};

window.addEventListener('message',function(event){
	if(event.data[0] && typeof fn[event.data[0]] !== "undefined"){
		fn[event.data[0]](event.data[1]);
	}
}, false);
function frameMessage(target, method, value){
	var data = [method, value];
	if(document.getElementById(target)) {
		document.getElementById(target).contentWindow.postMessage(data,'*');
	} else if(document.getElementsByName(target)[0]) {
		document.getElementsByName(target)[0].contentWindow.postMessage(data,'*');
	}
}

function getParentLang(target){
	frameMessage(target, 'setParentLang', LANG);
}