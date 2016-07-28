/**
 * 
 */
var intViewportHeight = window.innerHeight;

;

var bullets = [];
var top = intViewportHeight - 101;
var lastTimeShot;
var points = 0;
var counter = 100;
var gameOn = true;
var flag = false;
var plane = {
	x : 0,
	width : 101,
	moveLeft : false,
	moveRight : false,
	shooting : false,
	speed : 5,
	dom : document.getElementById('plane')

};

var target = {
	y : 0,
	height : 101,
	x : 0,
	nextX : 0,
	width : 101,
	shooting : false,
	speed : 1,
	dom : document.getElementById('enemy')
};

function movePlane() {
	var windowWidth = window.innerWidth;
	if (plane.moveLeft && plane.x > plane.speed) {
		plane.x -= plane.speed;
	}

	if (plane.moveRight && plane.x < windowWidth - plane.width) {
		plane.x += plane.speed;
	}

	plane.dom.style.left = plane.x + 'px';
}

function randomMovement() {
	if (target.nextX < target.x + target.speed
			&& target.nextX > target.x - target.speed) {
		target.nextX = Math.floor(Math.random()
				* (window.innerWidth - target.width));
	}
	if (target.x > target.nextX) {
		target.x -= target.speed;
	}
	if (target.x < target.nextX) {
		target.x += target.speed;
	}
	target.dom.style.left = target.x + 'px';
}
function shoot() {
	if (!plane.shooting) {

		return;

	}

	var currentTime = Date.now();
	if (lastTimeShot && currentTime - lastTimeShot < 500) {
		play();
		return;

	}

	var bullet = getFirstFreeBullet();
	if (!bullet) {
		return;

	}

	var top = window.innerHeight - 101;

	bullet.dom.style.top = top + "px";
	bullet.y = top;
	bullet.dom.style.top = 101 + 'px';
	bullet.x = bullet.dom.style.left = (plane.x + (plane.width / 2 - 5 / 2));
	bullet.dom.style.left = (plane.x + (plane.width / 2 - 5 / 2)) + 'px';
	bullet.dom.style.display = 'block';
	bullet.isShot = true;

	lastTimeShot = currentTime;
	if (counter == 0) {
		plane.shooting = false;
		return;
	}
	--counter;
	document.getElementById("points").innerHTML = "" + counter;

}
function getFirstFreeBullet() {
	for (var i = 0; i < bullets.length; i++) {
		if (!bullets[i].isShot) {
			return bullets[i];
		}
	}
}

function attachKeyEvents() {
	document.addEventListener('keydown', function(event) {
		onKeyEvent(event.keyCode, true);

	}, false)
	document.addEventListener('keyup', function(event) {
		onKeyEvent(event.keyCode, false);

	}, false)

}

function createBullets() {
	for (var i = 0; i < 100; i++) {
		var dom = document.createElement('div');
		dom.className = 'bullet';
		dom.style.display = 'none';
		document.body.appendChild(dom);
		var b = {
			dom : dom,
			isShot : false,
			y : 0,
			x : 0,
		}
		bullets.push(b);
	}
}

function moveBullets() {
	for (var i = 0; i < bullets.length; i++) {
		var b = bullets[i];
		if (b.y <= 0 && b.isShot) {
			b.isShot = false;
			b.dom.style.display = 'none';
			continue;
		}

		if (!b.isShot) {
			continue;
		}
		if (b.y < target.y + target.height && b.y > target.y
				&& b.x + 5 > target.x && b.x < target.x + target.width) {
			points++;
			document.getElementById('shots').innerHTML = "" + points;
			b.isShot = false;
			b.dom.style.display = 'none';
		}
		if (points == 70) {
			var ans = confirm("You win\nDo you want to play again?");
			gameOn = false;
		}

		if (points < 70 && counter == 0) {
			var ans = confirm("You lose\n Do you want to play again?");
			gameOn = false;
		}
		if (ans == true) {
			location.reload();
		}

		b.y -= 4;
		b.dom.style.top = b.y + 'px';
	}
}

function onKeyEvent(keyCode, state) {

	if (keyCode == 37) {
		plane.moveLeft = state;

	}
	if (keyCode == 39) {
		plane.moveRight = state;
	}

	if (keyCode == 32) {
		plane.shooting = state;

	}
}

function play() {
	var audio = document.getElementById("audio");
	audio.volume = 0.12;
	audio.play();
}

function gameLoop() {
	movePlane();
	shoot();
	moveBullets();
	randomMovement();
	if (gameOn) {
		requestAnimationFrame(gameLoop);
	}
}
attachKeyEvents();
createBullets();
requestAnimationFrame(gameLoop);
