var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (currentScrollPos > 200) {
	  if (prevScrollpos > currentScrollPos) {
		document.getElementsByClassName("navbar")[0].style.top = "0px";
	  } else {
		document.getElementsByClassName("navbar")[0].style.top = "-350px";
	  }
	  prevScrollpos = currentScrollPos;
  }
}