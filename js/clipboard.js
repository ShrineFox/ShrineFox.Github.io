function copyDivToClipboard(id) {
	var range = document.getSelection().getRangeAt(0);
	range.selectNode(document.getElementById(id));
	window.getSelection().addRange(range);
	document.execCommand("copy");
	$('.copied').show();
	$('.copied').fadeOut(1500);
}