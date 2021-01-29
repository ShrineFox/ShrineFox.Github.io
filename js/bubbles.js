var canvas = document.getElementById('bgCanvas');
window.onload = function() {

  var c = document.getElementById('bgCanvas'),
    $ = c.getContext('2d'),
    w = c.width = window.innerWidth,
    h = c.height = window.innerHeight;

  var i, bubblesNumber = w * h > 75000 ? 50 : 10,
    objects = [],
    maxRadius = w * h > 500000 ? 20 : 15,
    maxYVelocity = 3;

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
    $.fillStyle = 'rgba(255,255,255,' + this.opacity + ')';
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
    $.fillStyle = 'rgba(255,255,255,' + this.opacity + ')';
    $.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    $.fill();
  };

  Bubble.prototype.pop = function(world) {
    world.objects.splice(world.objects.indexOf(this), 1);
    for (var i = 0; i < this.fragments; i++) {
      world.objects.push(new Fragment(new Vector(this.x, this.y), new Vector(randomInRange(-2, 2), randomInRange(-2, 2)), randomInRange(2, this.radius / 4), this.hue));
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