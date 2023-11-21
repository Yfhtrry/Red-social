function composeCSV(array) {
	var data = [];
	for(var i in array) {
		data[i] = array[i].replace(/\"/g, '""');
		data[i] = '"'+data[i]+'"';
	}
	return data.join(',');
}

function parseCSV(text, delim, forceArray) {
	if (!forceArray) forceArray = false;
	if (!delim) delim = ',';
	var data = [['']];

	var lines = text.split(/\r\n|\r|\n/);
	for(var i=0; i < lines.length; i++){
		data[i] = lineSplit(lines[i], delim);
	}
	if(!forceArray && data.length == 1) {
		return data[0];
	}
	return data;
}

//ダブルクォート内のデリミタは分割しない
function lineSplit(line, delim){
	var c = "", s = new String(), d = [],delimFlag = false;
	for(var i=0; i < line.length; i++){
		c = line.charAt(i);
		if(c == delim && !delimFlag){
			d.push(s.toString());
			s = "";
		}else if(c == delim && !delimFlag){
			s += c;
		}else if(c == '"'){
			delimFlag = !delimFlag;
		}else{
			s += c;
		}
	}
	if(s) d.push(s.toString());
	return d;
}
