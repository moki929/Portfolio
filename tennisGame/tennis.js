let canvas;
let ctx;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 25;
let ballSpeedY = 10;

let player1Score = 0;
let player2Score = 1;
const WINNING_SCORE = 4;

let showingWinScreen = false;

let paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = evt.clientX - rect.left - root.scrollLeft;
  let mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "pink";
  ctx.textAlign = "center";

  let framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    let mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

// moves the computer right paddle
function computerMovement() {
  let paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y = paddle2Y + 12;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y = paddle2Y - 12;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  //ball on left wall
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.4;
    } else {
      player2Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }

  //ball on right wall
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.4;
    } else {
      player1Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }

  //bounce off top
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }

  //bounce off bottom
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

//net in the middle
function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 9, 20, "white");
  }
}

function drawEverything() {
  // the ground is green
  colorRect(0, 0, canvas.width, canvas.height, "green");

  if (showingWinScreen) {
    ctx.textAlign = "center";

    if (player1Score >= WINNING_SCORE) {
      ctx.font = "50px Comic Sans MS";
      ctx.fillStyle = "blue";
      ctx.fillText(
        //winning screen
        "Wow! You beat this!",
        canvas.width / 2,
        canvas.height / 3
      );
    } else if (player2Score >= WINNING_SCORE) {
      ctx.font = "40px Comic Sans MS";
      ctx.fillStyle = "red";
      ctx.fillText(
        //losing screen
        "Oh no! The computer beat you...",
        canvas.width / 2,
        canvas.height / 3
      );
    }
    ctx.fillStyle = "yellow";
    ctx.fillText("Click to play again", canvas.width / 2, canvas.height / 1.5);
    return;
  }

  drawNet();

  // this is left player paddle
  colorRect(10, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "blue");

  // this is right computer paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS - 10,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "red"
  );

  // next line draws the ball
  colorCircle(ballX, ballY, 10, "yellow");

  //scores on the field
  ctx.fillText(player1Score, 100, 100);
  ctx.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}
