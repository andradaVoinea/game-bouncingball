let canvas; // To actually be able to render graphics on the <canvas> element, first we have to grab a reference to it in JavaScript.
let drawingContext; // creating the drawingContext to store the 2D rendering context
let ballRadius; //holds the radius of the drawn circle; we use it for calculations
let x;
let y;
let dx;
let dy;
let brickRow;
let brickColumn;
let brickWidth;
let brickHeight;
let brickPadding; //padding between bricks so that they don't touch
let brickOffsetTop; //top and left offset, so they don't start being drawn right from the edge of canvas
let brickOffsetLeft;
let score;
let bricks; //creating a two-dimensional array, with brick columns (c), which contains brick rows (r)
let paddleHeight;
let paddleWidth;
let paddleX;
let rightKey;
let leftKey;
let lives;

function init() {
  canvas = document.getElementById("myCanvas");
  drawingContext = canvas.getContext("2d");
  ballRadius = 10;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  brickRow = 3;
  brickColumn = 5;
  brickWidth = 75;
  brickHeight = 20;
  brickPadding = 10;
  brickOffsetTop = 30;
  brickOffsetLeft = 30;
  score = 0;
  bricks = [];
  //creating a loop which will go through c and r and create the bricks
  for (let c = 0; c < brickColumn; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRow; r++) {
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 3, //status property to indicate wether it should paint each brick or not
        color: "#3D2B1F", //I set a new property (color) for the matrix of object, which creates a new color for every brick on each loop
      };
    }
  }
  paddleHeight = 10;
  paddleWidth = 75;
  //starting point of the paddle on the x axis - we use it for calculations further in the code
  paddleX = (canvas.width - paddleWidth) / 2;
  //variables to store info on which button is pressed;
  rightKey = false;
  leftKey = false;
  lives = 4;
  //run some code to handle the paddle movement when buttons are pressed;
  document.addEventListener("keydown", keyPress, false);
  //when keydown event is activated on a key/ button is pressed, keyDown() function is executed
  document.addEventListener("keyup", keyPress, false);
  //same for the second listener, keyup, which will fire the keyUp() function
}
init();

//key holds the information about which key was pressed;
function keyPress(event) {
  console.log(`Received event ${event.type} in the direction ${event.code}`);
  if (event.type === "keyup") {
    if (event.code === "Right" || event.code === "ArrowRight") {
      //A string, defaulting to "", that sets the value of KeyboardEvent.code
      rightKey = false;
    } else if (event.code === "Left" || event.code === "ArrowLeft") {
      leftKey = false;
    }
  } else if (event.type === "keydown") {
    if (event.code === "Right" || event.code === "ArrowRight") {
      rightKey = true;
      //when we press a key, the information is stored in a variable, which is set to true
    } else if (event.code === "Left" || event.code === "ArrowLeft") {
      leftKey = true;
    }
  }
}

//collision detection function - loops through all the bricks and compare bricks position with ball's
function collisionDetection() {
  for (let c = 0; c < brickColumn; c++) {
    for (let r = 0; r < brickRow; r++) {
      const b = bricks[c][r];
      //if the center of the ball is inside the coordinates of one of our bricks, we'll change the direction of the ball
      if (b.status > 0) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          console.log(`${b.x} -- ${b.y}`);
          dy = -dy; // change direction
          // b.status = 0; //if a collision happens, we substract the status of the brick;
          b.status--;
          console.log(`${c} - ${r} status: ${b.status}`);
          score++; //increment the value of the scoreValue
          if (score === brickRow * brickColumn * 3) {
            alert("You won! Congratulations! 🍾🍾🍾🍾🍾");
            document.location.reload(); //relaod the page and starts the game again
            //when the alert button is clicked
          }
        }
      }
    }
  }
}
function drawBall() {
  drawingContext.beginPath();
  drawingContext.arc(x, y, ballRadius, 0, Math.PI * 2);
  drawingContext.fillStyle = "#00ad43";
  drawingContext.fill();
  // fills the current or given path with the current fillStyle
  drawingContext.closePath();
}
//function that draws the paddle on the screen
function drawPaddle() {
  drawingContext.beginPath();
  drawingContext.rect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );
  drawingContext.fillStyle = "#1cac78";
  drawingContext.fill();
  drawingContext.closePath();
}
//function that loops through the bricks in the array and draws them on screen
function drawBricks() {
  for (let c = 0; c < brickColumn; c++) {
    for (let r = 0; r < brickRow; r++) {
      //check the value of each brick's status property in the drawBricks() function before
      // drawing it — if status is 1, then draw it, but if it's 0, delete it
      if (bricks[c][r].status > 0) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX; //looping through r and c to set the x position of each brick
        bricks[c][r].y = brickY;
        drawingContext.beginPath(); //painting a brick on canvas on each iteration
        drawingContext.rect(brickX, brickY, brickWidth, brickHeight); //painting them in one place (0, 0)
        if (bricks[c][r].status == 3) {
          drawingContext.fillStyle = "#53868b";
        } else if (bricks[c][r].status == 2) {
          drawingContext.fillStyle = "#7ac5cd";
        } else {
          drawingContext.fillStyle = "#8ee5ee";
        }
        drawingContext.fill();
        drawingContext.closePath();
      }
    }
  }
}
//function to create and update the score display;
function drawScore() {
  drawingContext.font = "20px Arial";
  drawingContext.fillStyle = "#5f9ea0";
  drawingContext.fillText(`Score: ${score}`, 8, 20);
}
//function to add lives to player
function drawLives() {
  drawingContext.font = "20px Arial";
  drawingContext.fillStyle = "#5f9ea0";
  drawingContext.fillText("Lives: " + lives, canvas.width - 75, 20);
}
//function for moving paddle left and right on the width of the canvas
function movePaddel() {
  if (rightKey && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftKey && paddleX > 0) {
    paddleX -= 7;
  }
}
//function to detect collision on walls and paddle, change direction
function ballColliding() {
  // To detect the collision we will check whether the ball is touching (colliding with) the wall,
  // and if so, we will change the direction of its movement
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  //colision detection between the ball and the paddle
  else if (y + dy > canvas.height - ballRadius) {
    //check if center of ball is between the left and right edges of the paddle
    if (x > paddleX && x < paddleX + paddleWidth) {
      //if ball hits bottom we check if it was the paddle
      dy = -dy; //if yes, it changes direction
    } else {
      gameOver();
    }
  }
  //check if the left or right cursor key is pressed when each frame is rendered
  //if the leftKey is pressed, move paddle by 7 pixels to the right
  //paddle used to dissapear at the edge of canvas, so I added extra code to keep the paddle
  //within the canvas width
  //the paddleX position will move between 0 on the left side of the canvas and canvas.width-paddleWidth
  //on the right side
}
//function for game over after consuming all lives, or returning to initial state of canvas
//after losing one life
function gameOver() {
  lives--;
  if (lives === 0) {
    //falsey vs truthy, also working with !lives
    alert("GAME OVER!");
    document.location.reload();
  } else {
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
  }
}
//main function that calls all other functions
function draw() {
  drawingContext.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  ballColliding();
  movePaddel();
  // update x and y with  dx and dy variable on every frame,
  // so the ball will be painted in the new position on every update.
  x += dx;
  y += dy;
  dx = Math.sign(dx) * getRandomSpeed(1, 5);
  dy = Math.sign(dy) * getRandomSpeed(1, 3);
  // console.log(dx,dy)
  requestAnimationFrame(draw);
}
//function to get random speeds for the ball
function getRandomSpeed(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
draw();
