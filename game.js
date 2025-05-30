// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const spaceshipWidth = 50;
const spaceshipHeight = 40;
let spaceshipX = canvas.width / 2 - spaceshipWidth / 2;
let spaceshipY = canvas.height - spaceshipHeight - 10;
let spaceshipSpeed = 5;
let bullets = [];
let bulletSpeed = 7;
let enemies = [];
let enemySpeed = 2;
let score = 0;
let startTime = Date.now();
let gameOver = false;

const spaceshipImage = new Image();
spaceshipImage.src = 'assets/spaceship.png'; // Ensure you have the spaceship image in the correct folder

// Sound effects
const shootSound = new Audio('assets/shoot.mp3');

// Enemy image
const enemyWidth = 40;
const enemyHeight = 40;
const enemyImage = new Image();
enemyImage.src = 'assets/enemy.png'; // Ensure you have the enemy image in the correct folder

// Keyboard input
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === ' ') shootBullet(); // Spacebar to shoot
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
});

// Spaceship movement
function moveSpaceship() {
    if (leftPressed && spaceshipX > 0) {
        spaceshipX -= spaceshipSpeed;
    }
    if (rightPressed && spaceshipX < canvas.width - spaceshipWidth) {
        spaceshipX += spaceshipSpeed;
    }
}

// Bullet logic
function shootBullet() {
    if (gameOver) return; // Don't shoot if the game is over
    bullets.push({
        x: spaceshipX + spaceshipWidth / 2 - 5,
        y: spaceshipY,
    });
    shootSound.play(); // Play shoot sound
}

// Update bullets position
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Create enemies at random positions
function createEnemies() {
    if (Math.random() < 0.02 && !gameOver) {
        let x = Math.random() * (canvas.width - enemyWidth);
        enemies.push({ x, y: 0 });
    }
}

// Update enemies position
// Update enemies position
function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemySpeed; // Move enemies down

        // Check if an enemy has reached the bottom of the screen
        // Remove this check
        // if (enemies[i].y > canvas.height) {
        //     enemies.splice(i, 1); // Remove the enemy from the array
        //     i--; // Adjust index after removal
        // }

        // Check for collision with the spaceship
        if (
            spaceshipX < enemies[i].x + enemyWidth &&
            spaceshipX + spaceshipWidth > enemies[i].x &&
            spaceshipY < enemies[i].y + enemyHeight &&
            spaceshipY + spaceshipHeight > enemies[i].y
        ) {
            gameOver = true; // Game over when spaceship collides with an enemy
        }
    }
}


// Check collision between bullets and enemies
function checkCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i].x < enemies[j].x + enemyWidth &&
                bullets[i].x + 10 > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemyHeight &&
                bullets[i].y + 20 > enemies[j].y
            ) {
                // Remove enemy and bullet on collision
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                score++; // Increase score when an enemy is destroyed
                i--;
                break;
            }
        }
    }
}

// Draw spaceship, bullets, and enemies
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw spaceship
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY, spaceshipWidth, spaceshipHeight);

    // Draw bullets
    ctx.fillStyle = '#FFFFFF';
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, 10, 20);
    }

    // Draw enemies
    for (let enemy of enemies) {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemyWidth, enemyHeight);
    }

    // Draw score
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 10, 30);

    // Draw time
    let elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds
    ctx.fillText('Time: ' + elapsedTime + 's', canvas.width - 100, 30);

    // Display game over message
    if (gameOver) {
        ctx.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
        ctx.fillText('Final Score: ' + score, canvas.width / 2 - 70, canvas.height / 2 + 30);
    }
}

// Main game loop
function gameLoop() {
    if (!gameOver) {
        moveSpaceship();
        updateBullets();
        createEnemies();
        updateEnemies();
        checkCollisions();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Start the game when the images are loaded
spaceshipImage.onload = function () {
    enemyImage.onload = function () {
        gameLoop();
    };
};

