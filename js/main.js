$(document).ready(function(){
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
	};
	})();

	var canvas = $("#canvas");
	var ctx = canvas[0].getContext("2d");
	var background = document.getElementById("background");
	var bkCtx = background.getContext("2d");
	var score = 0;

	//Draws the random star pattern
	var backImage = new Image();

	var exp = new Image();
	exp.src = "exp.png";

	backImage.src = "bg.png";

	//Player Character
	var handset = new Image();
	handset.src = "handset.png";

	//enemy characters
	var hsImg = new Image();
	hsImg.src = "headset.png";

	//michael bay
	var expImg = new Image();
	expImg.src = "exp.png";

	var handsetX = 0; //sets initial position of player
	var handsetX_old = handsetX; //stores old position, used on move
	var handset_speed = 10; //

	var laserColor = "#00ffff";

	

	var laser = [];	//holds the lasers
	var headset = []; //holds the enemies
	var exp = [];

	var gameOver = true;

	function animate() {
		requestAnimationFrame(animate);

		if(gameOver){
			gameloop();
		} else {
			drawFinal();
		}
	}
	$(document).keydown(function(e) {
		if(gameOver){
			switch(e.which) {
				case 37: {// left
					if(handsetX>0) {
						handsetX_old = handsetX;
						handsetX-=handset_speed;
					}
					break;
				}

				case 38: // up
					break;

				case 39: {// right
					if(handsetX < canvas[0].width-32){
						handsetX_old = handsetX;
						handsetX+=handset_speed;
					}
					break;
				}

				case 40: // down
					break;

				case 32: { // space
					if(laser.length < 3 ) {
						laser.push({
							xPos: handsetX+16,
							yPos: 550,
							color: '#8cc63f',
							speed: -5,
						});
						var lzrAudio = document.getElementById('laser');
						lzrAudio.currentTime = 0;
						lzrAudio.play();
					}
					break;
				}

			default: return; // exit this handler for other keys
			}
		} else {
			return;
		}
	e.preventDefault(); // prevent the default action (scroll / move caret)
	});
	tick = 0;
	function gameloop(){

		tick++;
		ctx.clearRect(0,0,960,600);
		bkCtx.clearRect(0,0,960,600);
		ctx.drawImage(handset,handsetX,560);
		bkCtx.drawImage(backImage,0,0);
		updateLaser();
		killLaser();
		drawLaser();
		if(tick % 50 == 0)
			createHeadset();
		updateHeadset();
		killHeadset();
		drawHeadset();
	 	drawExplosion();
	 	if(tick%1000 == 0)
	 		tick = 0;
	 	drawScore();
	}

	//Updates the position of a laser blast
	function updateLaser(){
		for (var i in laser) {
			var lzr = laser[i];
			lzr.yPos += lzr.speed;
		}
	}

	//Destroys a laser blast when offscreen
	function killLaser() {
		for(var i in laser) {
			var lzr = laser[i];
			if (lzr.yPos < 0)
				laser.splice(i,1);
		}
	}

	//Draws the laser to the screen
	function drawLaser() {
		for(var i in laser) {
			var lzr = laser[i];
			ctx.fillStyle = lzr.color;
			ctx.fillRect(lzr.xPos, lzr.yPos, 3, 8);
		}
	}
	//Spawns enemies
	function createHeadset() {
		if (headset.length < 10) {
			headset.push({
				xPos: 25,
				yPos: 25,
				color: '#8cc63f',
				speed: 1,
				val: 1,
			});
		}
	}

	function updateHeadset() {
		for(var i in headset) {
			var hs = headset[i];
			if(hs.xPos > canvas[0].width-(25+32) ) {
				hs.speed = hs.speed*(-1);
				hs.yPos += 35;
				hs.speed = hs.speed * 1.25;
				hs.val++;
			}
			if(hs.xPos < 25 ) {
				hs.speed = hs.speed*(-1);
				hs.yPos += 35;
				hs.speed = hs.speed * 1.25;
				hs.val++;
			}
			hs.xPos += hs.speed;
			if(hs.yPos > canvas[0].height-32) {
				$('#gameOver').trigger('play');
				gameOver=false;
				headset.splice(i,1);
			}
		}
	}

	function killHeadset() {
		for(var i in headset){
			var hs = headset[i];
			for(var j in laser){
				var lzr = laser[j];
				if(lzr.xPos > hs.xPos && lzr.xPos < hs.xPos+32 && lzr.yPos > hs.yPos && lzr.yPos < hs.yPos+32) {
					laser.splice(j,1);
					headset.splice(i,1);
					score += 1*hs.val;
					exp.push({
						xPos: hs.xPos,
						yPos: hs.yPos,
						tc: 0,
					});
					$('#explosion').trigger('play');
				}
			}
		}
	}

	function drawHeadset() {
		for(var i in headset){
			var hs = headset[i];
			ctx.drawImage(hsImg,hs.xPos,hs.yPos);
		}
	}

	function drawExplosion() {
		
		for(var i in exp){
			var xp = exp[i];
			ctx.drawImage(expImg, xp.tc ,0,32,32,xp.xPos,xp.yPos,32,32);
			if(tick % 8 == 0){
				xp.tc += 32;
			}
		}
	}

	function drawScore() {
		ctx.font = "italic 24px Arial";
		ctx.fillStyle = "#8cc63f";
		ctx.shadowBlur = 2;
		ctx.shadowColor = "white";
		ctx.fillText("Score:", 5, 25 )
		ctx.fillText(score, 80,25);

		ctx.shadowBlur = 0;
		ctx.shadowColor = "none";
	}

	function drawFinal() {

		ctx.clearRect(0,0,960,600);
		
		ctx.fillStyle = "#8cc63f";
		ctx.shadowBlur = 2;
		ctx.shadowColor = "white";
		ctx.font = "italic 48px Arial";
		ctx.fillText("Game Over:", (canvas[0].width)/2-200, (canvas[0].height)/2-32);

		ctx.font = "italic 24px Arial";
		ctx.fillText("Final Score:", (canvas[0].width)/2-100, (canvas[0].height)/2);
		ctx.fillText(score, (canvas[0].width/2)-100, (canvas[0].height/2+24));

		restart();
	}

	function restart() {
		ctx.fillStyle="00853f";
		//ctx.fillRect(x,y,w,h);
	}
	animate();

});


