// Реализованные функции: 1, 2, 3, 4, 5, 7
// Увеличение скорости после каждых 10 очков может работать неудобно
var blockSize = 30;
var rows = 20;
var cols = 20;
var board;
var context;

// Snake
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var velocityX = 0;
var velocityY = 0;

// Food
var edaX;
var edaY;

// Special square
var specialSquareVisible = false;
var specialSquareX;
var specialSquareY;
var specialSquareStartTime;
var specialSquareDuration = 5000; // 5 sec
var specialSquarePoints = 5;
var specialSquarePointsDecrease = 3;

// Game variables
var speed = 5;
var snakeBody = [];
var score = 0;
var maxScore = localStorage.getItem('maxScore') || 0;
var lives = 3;
var gameOver = false;
var paused = false;
var updateInterval = setInterval(update, 1000 / speed);


window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", handleKeyPress);
    setInterval(update, 1000 / speed);
};

function update() {
    if (gameOver || paused) {
        return;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(edaX, edaY, blockSize, blockSize);

    if (specialSquareVisible) {
        context.fillStyle = "orange";
        context.fillRect(specialSquareX, specialSquareY, blockSize, blockSize);
        if (snakeX == specialSquareX && snakeY == specialSquareY) {
            var elapsedTime = Date.now() - specialSquareStartTime;
            if (elapsedTime <= 2000) {
                score += specialSquarePoints;
            } else {
                score += specialSquarePointsDecrease;
            }
            specialSquareVisible = false;
            placeFood(); 
        } else if (Date.now() - specialSquareStartTime >= specialSquareDuration) {
            specialSquareVisible = false;
            placeFood(); 
        }
    }
    if (snakeX == edaX && snakeY == edaY) {
        var eatSound = document.getElementById('eatSound');
        eatSound.play();
        snakeBody.push([edaX, edaY]);
        placeFood();
        score++;

        if (score > maxScore) {
            maxScore = score;
            localStorage.setItem('maxScore', maxScore);
        }
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX = (snakeX + velocityX * blockSize + board.width) % board.width;
    snakeY = (snakeY + velocityY * blockSize + board.height) % board.height;

    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            handleCollision();
        }
    }

    document.getElementById('score').innerText = score;
    document.getElementById('max-score').innerText = maxScore;

    
    if (score % 5 === 0 && score !== 0 && speed < 30) {
        speed += 1;
        clearInterval(updateInterval);
        updateInterval = setInterval(update, 1000 / speed);
    }

}

function handleKeyPress(e) {
    if (e.code === "Space") {
        if (gameOver) {
            restartGame();
        } else {
            paused = !paused;
        }
    } else {
        changeDirection(e);
    }
}

function restartGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    lives = 3;
    gameOver = false;
    paused = false;
    placeFood();
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    } else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
}

function placeFood() {
    if (score % 5 === 0 && score !== 0) {
        specialSquareVisible = true;
        specialSquareX = Math.floor(Math.random() * cols) * blockSize;
        specialSquareY = Math.floor(Math.random() * rows) * blockSize;
        specialSquareStartTime = Date.now();
    } else {
        specialSquareVisible = false;
        edaX = Math.floor(Math.random() * cols) * blockSize;
        edaY = Math.floor(Math.random() * rows) * blockSize;
    }
}


function handleCollision() {
    if (snakeBody.length >= 3) {
        snakeBody.splice(-3, 3);
        lives--;
        if (lives === 0) {
            gameOver = true;
            alert("Game Over!!! Lives exhausted.");
        } else {
            paused = true;
            setTimeout(function () {
                paused = false;
            }, 1000); 
        }
    }
}
