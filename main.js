let canvas;
let ctx;

canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;

let backgroundImage, spaceShipImage, bulletImage, monsterImage, gameOverImage;

// 우주선 좌표
let spaceShipX = canvas.width / 2 - 32;
let spaceShipY = canvas.height - 64;

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

let keysDown = {};
function setupKeyboardListener() {
  document.addEventListener("keydown", (event) => {
    keysDown[event.key] = true;
    console.log(keysDown);
  });

  document.addEventListener("keyup", (event) => {
    delete keysDown[event.key];
    console.log("버튼클릭후" + keysDown);
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

  // 우주선의 좌표값이 경기장 안에서만 있게 하는 법
  if (spaceShipX <= 0) {
    spaceShipX = 0;
  } else if (spaceShipX >= canvas.width - 64) {
    spaceShipX = canvas.width - 64;
  }
}

function renderImage() {
  // drawImage(image, dx, dy, (dwidth, dheight))
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceShipImage, spaceShipX, spaceShipY);
}

function main() {
  update();
  renderImage();
  console.log("animation calls main function");
  requestAnimationFrame(main);
}

loadImage();
setupKeyboardListener();
main();
