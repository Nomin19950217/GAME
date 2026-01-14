const canvas = document.getElementById("jumpCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let score = 0;
let gravity = 0.5;
let isGameOver = false;

const player = {
    x: 200,
    y: 300,
    width: 30,
    height: 30,
    dy: 0,
    jumpForce: -12,
    speed: 6,
    onGround: false // Газар дээр байгаа эсэхийг шалгах
};

// Анхны тавцангууд
let platforms = [];
for (let i = 0; i < 6; i++) {
    platforms.push({
        x: Math.random() * (canvas.width - 80),
        y: i * 100,
        width: 80,
        height: 10
    });
}

const keys = {};
window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

function update() {
    if (isGameOver) return;

    // Зүүн, баруун хөдөлгөөн
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;

    // Гравитаци (Доошоо татах)
    player.dy += gravity;
    player.y += player.dy;

    // Дээшээ үсрэх товчлуур (Space эсвэл W)
    // Зөвхөн тавцан дээр буусан үед үсрэхийг зөвшөөрнө
    if ((keys["Space"] || keys["KeyW"] || keys["ArrowUp"]) && player.onGround) {
        player.dy = player.jumpForce;
        player.onGround = false;
    }

    player.onGround = false; // Шалгахаас өмнө reset хийнэ

    // Тавцан дээр буух болон Камер дээшлэх логик
    platforms.forEach(plat => {
        // Мөргөлдөөн шалгах
        if (player.dy > 0 && 
            player.y + player.height > plat.y && 
            player.y + player.height < plat.y + plat.height + player.dy &&
            player.x + player.width > plat.x && 
            player.x < plat.x + plat.width) {
            
            player.y = plat.y - player.height;
            player.dy = 0;
            player.onGround = true;
        }

        // Хэрвээ тоглогч дэлгэцийн гол хэсгээс дээш гарвал
        if (player.y < canvas.height / 2) {
            if (player.dy < 0) { // Зөвхөн дээшээ үсэрч байх үед
                plat.y += Math.abs(player.dy); // Тавцангуудыг доош нь шилжүүлнэ
            }
        }

        // Доошоо алга болсон тавцанг дээрээс гаргаж ирэх
        if (plat.y > canvas.height) {
            plat.y = 0;
            plat.x = Math.random() * (canvas.width - plat.width);
            score++;
            document.getElementById("score").innerText = score;
        }
    });

    // Хана нэвт гарах (Зүүнээс гарвал баруунаас гарч ирнэ)
    if (player.x > canvas.width) player.x = 0;
    if (player.x < -player.width) player.x = canvas.width;

    // Тоглоом дуусах
    if (player.y > canvas.height) {
        isGameOver = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Тоглогч зурах
    ctx.fillStyle = "#e67e22";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Тавцангууд зурах
    ctx.fillStyle = "#27ae60";
    platforms.forEach(plat => {
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
    });

    if (isGameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("ТОГЛООМ ДУУСЛАА!", canvas.width/2, canvas.height/2);
        ctx.fillText("F5 дарж дахин эхлүүлнэ үү", canvas.width/2, canvas.height/2 + 40);
    }

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

draw();