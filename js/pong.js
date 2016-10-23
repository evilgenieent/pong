let canvas,
	canvasContext,
	ballX,
	ballY,
	ballSpeedX,
	ballSpeedY,
	player1Score,
	player2Score,
	showingWinScreen,

	// paddles coords
	paddle1Y,
	paddle1X,
	paddle2Y,
	paddle2X,

	// paddles state
	paddleXOn, // if paddleXOn === true, paddleX can hit the ball, else ball ignores the paddle
	paddleYOn; // same

const BALL_SPEED_X = 10,
	  BALL_SPEED_Y = 5,
	  BALL_THICKNESS = 20,
	  WINNING_SCORE = 3,
	  PADDLE_HEIGHT = 100,
	  PADDLE_THICKNESS = 30,
	  SCREEN_INTERVAL = 8, // Screen refresh
	  COMPUTER_INTERVAL = 1; // Computer movement refresh

window.onload = function() {
	
	initCanvas();
	initValues();
	
	// click event within winning screen
	canvas.addEventListener("mousedown", handleMouseClick);

	// mouse position and paddle moving accordingly
	canvas.addEventListener('mousemove', function(evt) {
		const mousePos = calculateMousPos(evt);
		paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
		paddle1X = mousePos.x;
	});

	// start screen loop and computer loop
	startGameLoop();
}

function initCanvas() {
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext('2d');
}

function initValues() {
	ballSpeedX = BALL_SPEED_X,
	ballSpeedY = BALL_SPEED_Y;
	ballX = ballY = 50;
	player1Score = player2Score = 0;
	showingWinScreen = false;
	paddle1Y = paddle2Y = 250;
	paddle1X = paddle2X = 10;
	paddleXOn = false;
	paddleYOn = !paddleXOn;
}

function startGameLoop() {
	setInterval(function() {

		moveEverything();
		drawEverything();

	}, SCREEN_INTERVAL);

	setInterval(function() {

		computerMovement();

	}, COMPUTER_INTERVAL);
}

function calculateMousPos(evt) {
	const rect = canvas.getBoundingClientRect(),
		  roots = document.documentElement;
	
	return {
		x: evt.clientX - rect.left - roots.scrollLeft,
		y: evt.clientY - rect.top - roots.scrollTop
	};
}

function handleMouseClick(evt) {
	if (showingWinScreen) {
		player1Score = player2Score = 0;
		showingWinScreen = false;
	}
}


function ballReset() {

	if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
	}

	paddleXOn = paddleYOn = true;
	ballSpeedX = 10;
	ballSpeedY = 0;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
}


function computerMovement() {
	const paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);

	if (ballX > canvas.width * 0.5) {
		if (paddle2YCenter < ballY - 35) {
			paddle2Y += 5;
		} else if (paddle2YCenter > ballY + 35){
			paddle2Y -= 5;
		}
	}
	
}

function moveEverything() {

	let deltaY;

	// do not move anything if winning screen
	if (showingWinScreen) return;

	// else, move ball position
	ballX += ballSpeedX;
	ballY += ballSpeedY;


	if (paddleXOn && ballX < paddle1X + 20 && ballX > paddle1X - 50 && ballY > paddle1Y - 40 && ballY < paddle1Y + PADDLE_HEIGHT) {

			paddleXOn = false;
			paddleYOn = !paddleXOn;

			ballSpeedX = -ballSpeedX * 1.01;
			deltaY = ballY - (paddle1Y + (PADDLE_HEIGHT / 2));
			ballSpeedY = deltaY * 0.10;
		
	} else if (ballX < 0) {
		player2Score++; // important: must be before ballReset()
		ballReset();
	}

	
	if (paddleYOn && ballX > canvas.width - 50 - PADDLE_THICKNESS && ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			
			paddleXOn = true;
			paddleYOn = !paddleXOn;

			ballSpeedX = -ballSpeedX * 1.01;
			deltaY = ballY - (paddle2Y + (PADDLE_HEIGHT/2));
			ballSpeedY = deltaY * 0.10;
		
	} else if (ballX > canvas.width) {
		player1Score++; // must be before ballReset()
		ballReset();
	}

	// change vertical direction if reaching screen edge (bounce the ball)
	if (ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
	if (ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for (let i = 0; i < canvas.width; i += 40) {
		colorRect({
			x: (canvas.width/2) -1, 
			y: i, 
			width: 2, 
			height: 20, 
			color: 'white'
		});
	}
}

function drawEverything() {
	
	// display background
	colorRect({
		x: 0,
		y: 0, 
		width: canvas.width, 
		height: canvas.height,
		color: 'black'
	});

	
	if (showingWinScreen) {
		// make screen white
		canvasContext.fillStyle = 'white';

		// display winning message
		const winningMessage = player1Score >= WINNING_SCORE ? "Left Player Won!" : "Right Player Won!";
		canvasContext.fillText(winningMessage , canvas.width * 0.45, canvas.height * 0.4);
		
		// display "continue" message
		canvasContext.fillText("click to continue", canvas.width * 0.45, canvas.height/2);

	} else {

		// display the net
		drawNet();

		// then, display left player paddle
		colorRect({
			x: paddle1X, 
			y: paddle1Y, 
			width: PADDLE_THICKNESS, 
			height: 100, 
			color: 'white'
		});
		
		// then, display right player paddle
		colorRect({
			x: canvas.width - PADDLE_THICKNESS - 50, 
			y: paddle2Y, 
			width: PADDLE_THICKNESS, 
			height: 100, 
			color: 'white'
		});

		// then, display the ball
		colorCircle({
			x: ballX, 
			y: ballY, 
			radius: BALL_THICKNESS, 
			color: 'white'
		});

		// then, display the player1 and player2 scores
		canvasContext.fillText(player1Score, 100, 100);
		canvasContext.fillText(player2Score, canvas.width - 100, 100);
	}

}

function colorCircle( {x, y, radius, color} ) {
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function colorRect( {x, y, width, height, color} ) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x, y, width, height);
}