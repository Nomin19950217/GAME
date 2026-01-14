const canvas = document.getElementById("jumpCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Game Variables
let score = 0;
let gravity = 0.5;
let isGameOver = false;

const player = {
    x: 200,
    y: 500,
    width: 30,
    height: 30,
    dy: 0,        // Vertical Velocity
    jumpForce: -12,
    speed: 5
};

// Simple Platform Object
const platforms = [
    { x: 150, y: 550, width: 100, height: 10 },
    { x: 50, y: 400, width: 100, height: 10 },
    { x: 250, y: 250, width: 100, height: 10 },
    { x: 100, y: 100, width: 100, height: 10 }
];

const keys = {};
window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

function update() {
    if (isGameOver) return;

    // Left/Right Movement
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;

    // Apply Gravity
    player.dy += gravity;
    player.y += player.dy;

    // Platform Collision
    platforms.forEach(plat => {
        if (player.y + player.height > plat.y && 
            player.y + player.height < plat.y + plat.height + player.dy &&
            player.x + player.width > plat.x && 
            player.x < plat.x + plat.width &&
            player.dy > 0) { // Only collide while falling
            
            player.dy = player.jumpForce; // Automatic Jump
            score++;
            document.getElementById("score").innerText = score;
        }
    });

    // Game Over if falls off bottom
    if (player.y > canvas.height) isGameOver = true;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.fillStyle = "#e67e22"; // Orange Square
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw Platforms
    ctx.fillStyle = "#27ae60"; // Green Platforms
    platforms.forEach(plat => {
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
    });

    if (isGameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText("GAME OVER - Refresh to Restart", 100, 300);
    }

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

draw();