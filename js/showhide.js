$(document).ready(function(){
	jQuery(".text .toggle-title").click(function() {
	  if (jQuery(this).hasClass("active")) {
		jQuery(this)
		  .removeClass("active")
		  .closest(".text")
		  .find(".toggle-inner")
		  .slideUp(200);
	  } else {
		jQuery(this)
		  .addClass("active")
		  .closest(".text")
		  .find(".toggle-inner")
		  .slideDown(200);
	  }
	});
});

