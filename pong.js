var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
const BALL_SPEED_X = 10;
const BALL_SPEED_Y = 5;
const BALL_THICKNESS = 20;
var ballSpeedX = BALL_SPEED_X;
var ballSpeedY = BALL_SPEED_Y;


var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle1X = 10;
var paddleXOn = false;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 30;
var paddle2Y = 250;
var paddle2X = 10;
var paddleYOn = true;

function calculateMousPos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX -rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop; 
	return {
		x: mouseX,
		y: mouseY
	};
}

function handleMouseClick(evt) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = function() {
	console.log("Hello World!");
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext('2d');
	var framesPerSecond = 120;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 8);

	setInterval(function() {
		computerMovement()
	},1);

	canvas.addEventListener("mousedown", handleMouseClick);

	canvas.addEventListener('mousemove', function(evt) {
		var mousePos = calculateMousPos(evt);
		paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
		paddle1X = mousePos.x;
	})
}

function ballReset() {

	if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
	}
	paddleXOn = true;
	paddleYOn = true;
	ballSpeedX = 10;
	ballSpeedY = 0;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}


function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	var cw = canvas.width;
	if(ballX > cw*0.5) {
		if (paddle2YCenter < ballY-35) {
			paddle2Y += 5;
		} else if (paddle2YCenter > ballY + 35){
			paddle2Y -= 5;
		}
	}
	
}

function moveEverything() {

	if(showingWinScreen) {
		return;
	}

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if (paddleXOn && 
		ballX < paddle1X + 20 && 
		ballX > paddle1X - 50 && 
		ballY > paddle1Y - 40 && 
		ballY < paddle1Y + PADDLE_HEIGHT) {
			paddleXOn = false;
			paddleYOn = true;
			ballSpeedX = -ballSpeedX * 1.01;
			var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.10;
		
	} else if(ballX < 0) {
		player2Score ++; // must be before ballReset()
		ballReset();
	}
	
	

	if (paddleYOn && ballX > canvas.width - 50 - PADDLE_THICKNESS && ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			// ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT &&
			paddleXOn = true;
			paddleYOn = false;
			ballSpeedX = -ballSpeedX * 1.01;
			// ballSpeedX = -10;
			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.10;
			// ballSpeedY = 5;
		
	} else if(ballX > canvas.width) {
		player1Score ++; // must be before ballReset()
		ballReset();
	}

	// if (ballX > canvas.width - PADDLE_THICKNESS) {
	// 	if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
	// 		paddleOn = true;
	// 		ballSpeedX = -ballSpeedX;
	// 		var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
	// 		ballSpeedY = deltaY * 0.10;
	// 	} else if(ballX > canvas.width){
	// 		player1Score++;	
	// 		ballReset();
	// 	}
	// }

	if (ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
	if (ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for(var i = 0; i < canvas.width; i += 40) {
		colorRect(canvas.width/2-1,i,2,20,'white');
	}
}

function drawEverything() {
	// next line blanks out the screen with black
	colorRect(0, 0, canvas.width, canvas.height, 'black');


	if(showingWinScreen) {
		canvasContext.fillStyle = 'white';

		if (player1Score >= WINNING_SCORE) {
			canvasContext.fillText("Left Player Won!", 350, 200);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText("Right Player Won!", 350, 200);
		}
		
		canvasContext.fillText("click to continue", 350, 500);
		return;
	}

	drawNet();

	// left player paddle
	colorRect(paddle1X, paddle1Y, PADDLE_THICKNESS, 100, 'white');
	
	// right computer paddle
	colorRect(canvas.width - PADDLE_THICKNESS - 50, paddle2Y, PADDLE_THICKNESS, 100, 'white');

	// draws the ball
	colorCircle(ballX, ballY, BALL_THICKNESS, 'white');

	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = 'white';
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}