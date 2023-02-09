var accent = '92,149,199';
var text = '139,148,158';
var bg = '01,04,09';
var rgb = 0;

document.addEventListener("DOMContentLoaded", () => {
	SetColor();
	SetDarkMode();
	setInterval(function () {
		RotateRGB();
	}, 2000);
});

function SetColor() {
	var color = getCookie("color");
	HideColorPicker();

	switch (color) {
		case 'red':
			accent = '169,71,71';
			break;
		case 'orange':
			accent = '227,168,95';
			break;
		case 'yellow':
			accent = '191,175,80';
			break;
		case 'green':
			accent = '68,163,69';
			break;
		case 'blue':
			accent = '92,149,199';
			break;
		case 'violet':
			accent = '156,87,188';
			break;
		case 'pink':
			accent = '234,142,226';
			break;
		case 'magenta':
			accent = '195,77,127';
			break;
		case 'gamer':
			accent = '169,71,71';
			break;
		case 'custom':
			ShowColorPicker();
			/* Load color values from cookie */
			if (getCookie("color_custom") == "")
			{
				setCookie("color_custom", "50,50,50", 999);
			}
			accent = getCookie("color_custom");
			break;
		default:
			accent = '92,149,199';
			break;
	}

	/* Override CSS color values */
	document.documentElement.style.setProperty('--accent', accent);
}

function RotateRGB() {
	var color = getCookie("color");
	if (color == "gamer")
	{
		switch (rgb)
		{
			case 0:
				accent = '169,71,71';
				break;
			case 1:
				accent = '227,168,95';
				break;
			case 2:
				accent = '191,175,80';
				break;
			case 3:
				accent = '68,163,69';
				break;
			case 4:
				accent = '92,149,199';
				break;
			case 5:
				accent = '156,87,188';
				break;
			default:
				accent = '169,71,71';
				break;
		}
		rgb++;
		/* Override CSS color values */
		document.documentElement.style.setProperty('--accent', accent);
	}
	if (rgb > 5) { rgb = 0 }
}

function DarkModeSelect() {
	/* Update light/dark mode cookie */
	var toggle = document.getElementById("darkToggle");
	if (toggle.checked == true) {
		setCookie("darkmode", "on", 999);
	} else {
		setCookie("darkmode", "off", 999);
	}

	SetDarkMode();
}

function SetDarkMode() {
	var darkmode = getCookie("darkmode");
	var toggle = document.getElementById("darkToggle");

	switch (darkmode) {
		case 'on':
			toggle.checked = true;
			document.documentElement.className = 'fd_dark';
			text = '139,148,158';
			bg = '01,04,09';
			break;
		case 'off':
			toggle.checked = false;
			document.documentElement.className = 'fd_light';
			text = '01,04,09';
			bg = '225,225,225';
			break;
		default:
			toggle.checked = true;
			document.documentElement.className = 'fd_dark';
			text = '139,148,158';
			bg = '01,04,09';
			break;
	}

	/* Override CSS values */
	document.documentElement.style.setProperty('--text', text);
	document.documentElement.style.setProperty('--bg', bg);
}

function ColorSelect() {
	/* Update color scheme cookie */
	var color = document.getElementById("color").value.toLowerCase();
	setCookie("color", color, 999);

	SetColor();
}

function updateAccent(picker) {
	var rgb = picker.toRGBString().replace("rgb(", "").replace(")", "");
	setCookie("color_custom", rgb, 999);
	SetColor();
}

function updateColorPicker() {
	accentstring = 'rgba(' + accent + ',1);'
	document.querySelector('#customaccent').jscolor.fromString(accentstring);
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCookie(cname, val, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(val) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = cname + "=" + c_value + ";path=/";
}

function selectElement(id, valueToSelect) {
	let element = document.getElementById(id);
	element.value = valueToSelect;
}

function ShowColorPicker() {
	var c = document.getElementById('colorpicker');
	c.setAttribute("style", "display: initial;");
}

function HideColorPicker() {
	var c = document.getElementById('colorpicker');
	c.setAttribute("style", "display: none;");
}