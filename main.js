let canvas;
let ctx;

canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = window.innerHeight - 100;

let backgroundImage, spaceShipImage, bulletImage, monsterImage, gameOverImage;

// 우주선 좌표
let spaceShipX = canvas.width / 2 - 32;
let spaceShipY = canvas.height - 64;

let bulletList = []; // 총알들을 저장하는 리스트
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    // 총알의 위치 초기화
    this.x = spaceShipX + 16;
    this.y = spaceShipY;

    bulletList.push(this);
  };

  this.update = function () {
    this.y -= 7;
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.trunc(Math.random() * (max - min + 1));

  return randomNum;
}

let monsterList = [];

function Monster() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 48);

    monsterList.push(this);
  };
}

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

function createBullet() {
  console.log("총알 생성");
  let b = new Bullet(); // 총알 하나 생성
  b.init();

  console.log("새로운 총알 리스트", bulletList);
}

function createMoster() {
  const interval = setInterval(function () {
    let e = new Monster();
    e.init();
  }, 1000);
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
  } else if (spaceShipX >= canvas.width - 64) {
    spaceShipX = canvas.width - 64;
  }

  if (spaceShipY <= 0) {
    spaceShipY = 0;
  } else if (spaceShipY >= canvas.height - 64) {
    spaceShipY = canvas.height - 64;
  }

  // 총알의 y좌표 업데이트
  for (let i = 0; i < bulletList.length; i++) {
    bulletList[i].update();
  }
}

function renderImage() {
  // drawImage(image, dx, dy, (dwidth, dheight))
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceShipImage, spaceShipX, spaceShipY);

  for (let i = 0; i < bulletList.length; i++) {
    ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
  }

  for (let i = 0; i < monsterList.length; i++) {
    ctx.drawImage(monsterImage, monsterList[i].x, monsterList[i].y);
  }
}

function main() {
  update(); // 좌표값 업데이트
  renderImage(); // 이미지 그려주기
  requestAnimationFrame(main);
}

loadImage();
setupKeyboardListener();
createMoster();
main();

// 총알만들기
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알이 발사 => 총알의 y값이 감소, 총알의 x값은 -> 스페이스를 누른 순간 우주선에서 출발
// 3. 발사된 총알들은 총알 배열에 저장
// 4. 총알들은 x,y 좌표값이 있어야 한다.
// 5. 총알 배열을 가지고 render

// 적군 특징
// x, y, init, update
// 1. 적군의 위치가 랜덤
// 2. 밑으로 움직임
// 3. 1초마다 하나씩 적군이 나온다. -> 레벨 시스템을 적용해서 시간초 줄어들기
// 4. 적군의 우주선이 바닥에 닿으면 게임오버
// 5. 적군과 총알이 만나면 적군이 사라지고 1점 획득
