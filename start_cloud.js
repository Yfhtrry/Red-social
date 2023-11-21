function setLastEnvBackup(datetime) {
	if(datetime) {
		$('#cloudEnv .information .datetime').text(datetime);
		$('#cloudEnv .information').show();
	}
}

$(document).ready(function(){
	$('.information').hide();
	callIce('getLastEnvBackup');
});

$(window).load(function(){
});
