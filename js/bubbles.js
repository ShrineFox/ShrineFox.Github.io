var canvas = document.getElementById('bgCanvas');
var score = 0;
var bubbleColor = '255,255,255';
var lightColor = '0,159,255';
var darkColor = '9,46,109';
var linkHover = '251,158,59';

window.onload = function() {
	/* Set Performance from Cookie */
	SetPerformance();
	
	/* Set Theme from Cookie or Dropdown */
	SetTheme();
	
	/* Set Bubble Popping Score from Cookie */
	score = getCookie("score");
	document.getElementById('score').innerText = score;
	
	/* Set Bubble SFX Icon from Cookie*/
	SetSound();
	
	/* Spawn Bubbles */
	var c = document.getElementById('bgCanvas'),
		$ = c.getContext('2d'),
		w = c.width = window.innerWidth,
		h = c.height = window.innerHeight;

	var i, bubblesNumber = w * h > 750000 ? 50 : 10,
	objects = [],
	maxRadius = w * h > 500000 ? 20 : 15,
	maxYVelocity = 2;

	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	function Vector(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	Vector.prototype.add = function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	};

	Vector.prototype.multiply = function(value) {
		this.x *= value;
		this.y *= value;
		return this;
	};

	Vector.prototype.getMagnitude = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};

	function Fragment(position, velocity, radius, hue) {
		this.position = position;
		this.velocity = velocity;
		this.startSpeed = this.velocity.getMagnitude();
		this.radius = radius;
		this.hue = hue;
	}

	Fragment.prototype.update = function(world) {
		this.velocity.multiply(world.physicalProperties.friction);
		this.position.add(this.velocity);
		this.radius *= this.velocity.getMagnitude() / this.startSpeed;
		if (this.radius < 0.1) {
			world.objects.splice(world.objects.indexOf(this), 1);
		}
	}

	Fragment.prototype.render = function($) {
		$.beginPath();
		$.fillStyle = 'rgba(' + bubbleColor + ',' + this.opacity + ')';
		$.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		$.fill();
	};

	function Bubble(x, y, speed, radius, fragments, swing, hue) {
		this.x = x;
		this.y = y;
		this.startX = this.x;
		this.speed = speed;
		this.radius = radius;
		this.fragments = fragments;
		this.swing = swing;
		this.hue = hue;
		this.opacity = randomInRange(0.01, 0.2);
	}

	Bubble.prototype.update = function(world) {
		this.x = this.startX + Math.cos(this.y / 80) * this.swing;
		this.y += this.speed;
		if (this.y + this.radius < 0) {
			this.y = world.physicalProperties.height + this.radius;
		}
	}

	Bubble.prototype.render = function($) {
		$.beginPath();
		$.fillStyle = 'rgba(' + bubbleColor + ',' + this.opacity + ')';
		$.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		$.fill();
	};

	Bubble.prototype.pop = function(world) {
		world.objects.splice(world.objects.indexOf(this), 1);
		for (var i = 0; i < this.fragments; i++) {
			world.objects.push(new Fragment(new Vector(this.x, this.y), new Vector(randomInRange(-2, 2), randomInRange(-2, 2)), randomInRange(2, this.radius / 4), this.hue));
		}
		objects.push(new Bubble(Math.random() * w, Math.random() * h, -randomInRange(0.5, maxYVelocity), randomInRange(5, maxRadius), randomInRange(1, 10), randomInRange(-40, 40), randomInRange(180, 200)));
		score++;
		setCookie("score", score, 999);
		document.getElementById('score').innerText = score;
		var sound = getCookie("sound");
		if (sound == "1") {
			const rndInt = Math.floor(Math.random() * 4) + 1;
			var audio = new Audio('./wav/pop' + rndInt + '.wav');
			audio.play();
		}
		
	};

	function World(physicalProperties, objects, ctx, background) {
		this.physicalProperties = physicalProperties;
		this.objects = objects;
		this.ctx = ctx;
		this.background = background;
		this.frameID = 0;
	}

	World.prototype.update = function() {
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].update(this);
		}
	};

	World.prototype.render = function() {
		this.ctx.clearRect(0, 0, this.physicalProperties.width, this.physicalProperties.height);
		if (this.background) {
			this.ctx.fillStyle = this.background;
		}
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].render(this.ctx);
		}
	};

	World.prototype.animate = function() {
		this.update();
		this.render();
		this.frameID = requestAnimationFrame(this.animate.bind(this));
	};

	for (i = 0; i < bubblesNumber; i++) {
		objects.push(new Bubble(Math.random() * w, Math.random() * h, -randomInRange(0.5, maxYVelocity), randomInRange(5, maxRadius), randomInRange(1, 10), randomInRange(-40, 40), randomInRange(180, 200)));
	}

	var world = new World({
		width: c.width,
		height: c.height,
		friction: 0.997
	}, objects, $, 'rgba(0, 0, 0, 0)');

	$.globalCompositeOperation = 'lighter';

	world.animate();

	window.addEventListener('resize', function() {
		w = world.physicalProperties.width = c.width = window.innerWidth;
		h = world.physicalProperties.height = c.height = window.innerHeight;
		$.globalCompositeOperation = 'lighter';
	});

	window.addEventListener('mousemove', function(e) {
	for (var i = 0; i < world.objects.length; i++) {
		if ((world.objects[i] instanceof Bubble) && (e.clientX > world.objects[i].x - world.objects[i].radius && e.clientX < world.objects[i].x + world.objects[i].radius && e.clientY < world.objects[i].y + world.objects[i].radius && e.clientY > world.objects[i].y - world.objects[i].radius)) {
			world.objects[i].pop(world);
	  }
	}
	});

	window.addEventListener('touchmove', function(e) {
	for (var i = 0; i < world.objects.length; i++) {
	  if ((world.objects[i] instanceof Bubble) && (e.touches[0].clientX > world.objects[i].x - world.objects[i].radius && e.touches[0].clientX < world.objects[i].x + world.objects[i].radius && e.touches[0].clientY < world.objects[i].y + world.objects[i].radius && e.touches[0].clientY > world.objects[i].y - world.objects[i].radius)) {
		world.objects[i].pop(world);
	  }
	}
	});

};

function SoundToggle() {
	if ( document.getElementById("sound").classList.contains('fa-volume-mute') )
	{
		document.getElementById("sound").classList.remove('fa-volume-mute');
		document.getElementById("sound").classList.add('fa-volume-up');
		setCookie("sound", 1, 999);
		console.log("Set Sound: On" );
	}
	else 
	{
		document.getElementById("sound").classList.remove('fa-volume-up');
		document.getElementById("sound").classList.add('fa-volume-mute');
		setCookie("sound", 0, 999);
		console.log("Set Sound: Off" );
	}
}

function SetSound() {
	if ( getCookie("sound") == "1")
	{
		document.getElementById("sound").classList.remove('fa-volume-mute');
		document.getElementById("sound").classList.add('fa-volume-up');
		console.log("Sound: On" );
	}
	else 
	{
		document.getElementById("sound").classList.remove('fa-volume-up');
		document.getElementById("sound").classList.add('fa-volume-mute');
		console.log("Sound: Off" );
	}
}

function PerformanceToggle() {
	if ( document.getElementById("performance").classList.contains('fa-toggle-off') )
	{
		document.getElementById("performance").classList.remove('fa-toggle-off');
		document.getElementById("performance").classList.add('fa-toggle-on');
		setCookie("performance", 1, 999);
		console.log("Set Performance: On" );
	}
	else 
	{
		document.getElementById("performance").classList.remove('fa-toggle-on');
		document.getElementById("performance").classList.add('fa-toggle-off');
		setCookie("performance", 0, 999);
		console.log("Set Performance: Off" );
	}
	
	SetPerformance();
}

function SetPerformance() {
	var c = document.getElementById('bgCanvas');
		
	if ( getCookie("performance") == "1")
	{
		/* Toggle Icon */
		document.getElementById("performance").classList.remove('fa-toggle-off');
		document.getElementById("performance").classList.add('fa-toggle-on');
		console.log("Performance: On" );
		
		/* Toggle Background */
		c.setAttribute("style", "display: none;");
		document.getElementsByTagName("body")[0].setAttribute("style", "background: var(--link);");
		
		/* Toggle Wave Animation */
		for(var i = 0; i < 4; i++) {
			document.getElementsByTagName("use")[i].classList.add('noanimation');
			document.getElementsByTagName("use")[i].setAttribute("x", 25 * i + i);
		}
		c.offsetHeight; /* Reflow CSS */		
	}
	else 
	{
		/* Toggle Icon */
		document.getElementById("performance").classList.remove('fa-toggle-on');
		document.getElementById("performance").classList.add('fa-toggle-off');
		console.log("Performance: Off" );
		
		/* Toggle Background */
		c.setAttribute("style", "display: initial;");
		document.getElementsByTagName("body")[0].setAttribute("style", "background: transparent;");
		
		/* Toggle Wave Animation */
		for(var i = 0; i < 4; i++) {
			document.getElementsByTagName("use")[i].classList.remove('noanimation');
			document.getElementsByTagName("use")[i].setAttribute("x", 48);
		}
		c.offsetHeight; /* Reflow CSS */
	}
}

function ThemeToggle() {
	var theme = document.getElementById("theme").value.toLowerCase();
	setCookie("theme", theme, 999);
	
	SetTheme();
}

function SetTheme() {
	var game = document.getElementById("game").value.toLowerCase();
	var theme = getCookie("theme");
	console.log("Theme: " + theme );
	selectElement("theme", theme);

	if (theme == "") {
		if (game == "") {
			lightColor = '0,159,255'; darkColor = '9,46,109'; linkHover = '251,158,59'; }
		if (game == "p5" || game == "p5r" || game == "p5d" || game == "p5s" || game == "smt3") {
			lightColor = '216,47,47'; darkColor = '0,0,0'; linkHover = '255,255,255'; }
		if (game == "p4" || game == "p4g" || game == "p4d" || game == "p4au") {
			lightColor = '255,175,57'; darkColor = '89,57,0'; linkHover = '255,255,255'; }
		if (game == "p3fes" || game == "p3p" || game == "p3d") {
			lightColor = '38,133,191'; darkColor = '10,91,0'; linkHover = '255,255,255'; }
		if (game == "cfb" || game == "pq" || game == "pq2") {
			lightColor = '255,135,185'; darkColor = '83,9,88'; linkHover = '255,255,255'; }
	}
	else {
		if (theme == "p5") {
			lightColor = '216,47,47'; darkColor = '0,0,0'; linkHover = '255,255,255'; }
		if (theme == "p4") {
			lightColor = '255,175,57'; darkColor = '89,57,0'; linkHover = '255,255,255'; }
		if (theme == "p3fes") {
			lightColor = '38,133,191'; darkColor = '10,91,0'; linkHover = '255,255,255'; }
		if (theme == "pq") {
			lightColor = '255,135,185'; darkColor = '83,9,88'; linkHover = '255,255,255'; }
		if (theme == "custom") {
			if (getCookie("lightColor") = "") {
				setCookie("lightColor", "255,255,255", 999); setCookie("darkColor", "0,0,0", 999); setCookie("linkHover", "0,159,255", 999);
			}
			lightColor = getCookie("lightColor"); darkColor = getCookie("darkColor"); darkColor = getCookie("linkHover"); 
		}
	}

	document.documentElement.style.setProperty('--link', lightColor );
	document.documentElement.style.setProperty('--bg', darkColor );
	document.documentElement.style.setProperty('--hover',  linkHover );
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
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

function setCookie(cname, val, exdays)
{
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(val) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie= cname + "=" + c_value;
}

function selectElement(id, valueToSelect) {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}