$(document).ready(function () {
	jQuery(".text .toggle-title").click(function () {
		if (jQuery(this).hasClass("activ")) {
			jQuery(this)
				.removeClass("activ")
				.closest(".text")
				.find(".toggle-inner")
				.slideUp(200);
		} else {
			jQuery(this)
				.addClass("activ")
				.closest(".text")
				.find(".toggle-inner")
				.slideDown(200);
		}
	});
});

