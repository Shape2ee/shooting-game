const $startScreen = document.querySelector("#start-screen");
const $canvasScreen = document.querySelector("#canvas-screen");
const $name = document.querySelector("#name");
let $canvas;
let ctx;

$canvas = document.querySelector("canvas");
ctx = $canvas.getContext("2d");
$canvas.width = 400;
$canvas.height = window.innerHeight - 150;

let backgroundImage, spaceShipImage, bulletImage, monsterImage, gameOverImage;
let gameStart = false;
let gameOver = false; // true이면 게임이 끝남,
let score = 0;
// 우주선 좌표
let spaceShipX = $canvas.width / 2 - 32;
let spaceShipY = $canvas.height - 64;

let monsterList = [];
let bulletList = []; // 총알들을 저장하는 리스트

let level = 1;
let cuttline = 10;

// 이미지 로드
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.gif";

  spaceShipImage = new Image();
  spaceShipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  monsterImage = new Image();
  monsterImage.src = "images/monster.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.png";
}

function renderImage() {
  // drawImage(image, dx, dy, (dwidth, dheight))
  ctx.drawImage(backgroundImage, 0, 0, $canvas.width, $canvas.height);
  ctx.drawImage(spaceShipImage, spaceShipX, spaceShipY);
  ctx.fillText(`Score:${score}`, 20, 30);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < monsterList.length; i++) {
    ctx.drawImage(monsterImage, monsterList[i].x, monsterList[i].y);
  }
}

// 키 이벤트
let keysDown = {};
function setupKeyboardListener() {
  document.addEventListener("keydown", (event) => {
    keysDown[event.key] = true;
    // console.log(keysDown);
  });

  document.addEventListener("keyup", (event) => {
    delete keysDown[event.key];
    // console.log("버튼클릭후" + keysDown);

    if (event.key == " ") {
      createBullet(); // 총알 생성
    }
  });
}

function update() {
  if ("ArrowRight" in keysDown) {
    spaceShipX += 3;
    // right
  }

  if ("ArrowLeft" in keysDown) {
    spaceShipX -= 3;
    // left
  }

  if ("ArrowUp" in keysDown) {
    spaceShipY -= 3;
    // up
  }

  if ("ArrowDown" in keysDown) {
    spaceShipY += 3;
    // down
  }

  // 우주선의 좌표값이 경기장 안에서만 있게 하는 법
  if (spaceShipX <= 0) {
    spaceShipX = 0;
  } else if (spaceShipX >= $canvas.width - 64) {
    spaceShipX = $canvas.width - 64;
  }

  if (spaceShipY <= 0) {
    spaceShipY = 0;
  } else if (spaceShipY >= $canvas.height - 64) {
    spaceShipY = $canvas.height - 64;
  }
}

function main() {
  if (!gameOver) {
    // gameOver === false
    update(); // 좌표값 업데이트
    renderImage(); // 이미지 그려주기
    requestAnimationFrame(main);
  } else {
    gameStart = false;

    const IMG_SIZE = 380;
    const HARF_IMG_SIZE = IMG_SIZE / 2;
    const gameOverPosX = canvas.width / 2 - HARF_IMG_SIZE;
    const gameOverPosY = canvas.height / 2 - HARF_IMG_SIZE;

    ctx.drawImage(
      gameOverImage,
      gameOverPosX,
      gameOverPosY,
      IMG_SIZE,
      IMG_SIZE
    );
  }
}

function changeScreen(screen) {
  if (screen === "start") {
    $startScreen.style.display = "block";
    $canvasScreen.style.display = "none";
  } else if (screen === "game") {
    $startScreen.style.display = "none";
    $canvasScreen.style.display = "block";
  }
}

$startScreen.addEventListener("submit", (event) => {
  event.preventDefault();
  $name.textContent = event.target["name-input"].value;
  changeScreen("game");

  loadImage();
  setupKeyboardListener();
  main();
});
