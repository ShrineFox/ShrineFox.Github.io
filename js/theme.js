var accent = '9,54,109';
var text = '230,230,230';
var bg = '28,30,33';
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
			accent = '250,0,0';
			break;
		case 'orange':
			accent = '250,106,0';
			break;
		case 'yellow':
			accent = '250,216,0';
			break;
		case 'green':
			accent = '0,250,0';
			break;
		case 'blue':
			accent = '0,159,255';
			break;
		case 'violet':
			accent = '255,0,220';
			break;
		case 'gamer':
			accent = '250,0,0';
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
			accent = '0,159,255';
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
				accent = '250,0,0';
				break;
			case 1:
				accent = '250,106,0';
				break;
			case 2:
				accent = '250,216,0';
				break;
			case 3:
				accent = '0,250,0';
				break;
			case 4:
				accent = '0,159,255';
				break;
			case 5:
				accent = '255,0,220';
				break;
			default:
				accent = '250,0,0';
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
			text = '230,230,230';
			bg = '28,30,33'; 
			break;
		case 'off':
			toggle.checked = false;
			text = '28,30,33';
			bg = '230,230,230';
			break;
		default:
			toggle.checked = true;
			text = '230,230,230';
			bg = '28,30,33'; 
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