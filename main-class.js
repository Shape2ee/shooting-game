const $startScreen = document.querySelector("#start-screen");
const $canvasScreen = document.querySelector("#canvas-screen");
const $gameOver = document.querySelector("#game-over");
const $name = document.querySelector("#name");
const $replayBtn = document.querySelector("#replay-btn");
let keysDown = {};
let bulletList = []; // 총알 저장 리스트
let monsterList = [];
let gameOver = false;

class Game {
  constructor(name) {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 400;
    this.canvas.height = window.innerHeight - 150;

    this.start(name);
  }
  start(name) {
    $name.textContent = name;
    this.changeScreen("game");
    this.loadImage();

    this.spaceShip = new SpaceShip(
      name,
      this.canvas.width / 2 - 32,
      this.canvas.height - 64
    );

    this.keyEvent();
    this.createMonster();
    this.main();
  }
  quit() {
    this.changeScreen("start");
  }
  changeScreen(screen) {
    if (screen === "start") {
      $startScreen.style.display = "block";
      $canvasScreen.style.display = "none";
      $gameOver.style.display = "none";
    } else if (screen === "game") {
      $startScreen.style.display = "none";
      $canvasScreen.style.display = "block";
      $gameOver.style.display = "none";
    } else if (screen === "gameOver") {
      $gameOver.style.display = "block";
    }
  }
  main() {
    if (gameOver) {
      this.changeScreen("gameOver");
      return;
    }

    this.update();
    this.renderImage();
    requestAnimationFrame(() => this.main());
  }
  loadImage() {
    this.backgroundImage = new Image();
    this.backgroundImage.src = "images/background.gif";

    this.spaceShipImage = new Image();
    this.spaceShipImage.src = "images/spaceship.png";

    this.bulletImage = new Image();
    this.bulletImage.src = "images/bullet.png";

    this.monsterImage = new Image();
    this.monsterImage.src = "images/monster.png";

    this.gameOverImage = new Image();
    this.gameOverImage.src = "images/gameover.png";
  }
  renderImage() {
    const { ctx, spaceShip, canvas } = this;
    ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.spaceShipImage, spaceShip.x, spaceShip.y);
    ctx.fillText(`Score:${spaceShip.score}`, 20, 30);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    for (let i = 0; i < bulletList.length; i++) {
      if (bulletList[i].alive) {
        ctx.drawImage(this.bulletImage, bulletList[i].x, bulletList[i].y);
      }
    }

    for (let i = 0; i < monsterList.length; i++) {
      ctx.drawImage(this.monsterImage, monsterList[i].x, monsterList[i].y);
    }
  }
  keyEvent() {
    document.addEventListener("keydown", (evnet) => {
      keysDown[evnet.key] = true;
      // console.log(keysDown);
    });

    document.addEventListener("keyup", (event) => {
      delete keysDown[event.key];
      // console.log(keysDown);

      if (event.key == " ") {
        this.createBullet(); // 총알 생성
      }
    });
  }
  update() {
    const { spaceShip, bullet } = this;
    if ("ArrowRight" in keysDown) {
      spaceShip.x += 4;
      // right
    }

    if ("ArrowLeft" in keysDown) {
      spaceShip.x -= 4;
      // left
    }

    if (spaceShip.x <= 0) {
      spaceShip.x = 0;
    } else if (spaceShip.x >= this.canvas.width - 64) {
      spaceShip.x = this.canvas.width - 64;
    }

    for (let i = 0; i < bulletList.length; i++) {
      if (bulletList[i].alive) {
        bulletList[i].update();
        // bulletList[i].checkHit();
      } else {
        bulletList.splice(i, 1);
      }
    }

    for (let i = 0; i < monsterList.length; i++) {
      monsterList[i].update(this.canvas.width);
    }
  }
  createBullet() {
    const { spaceShip } = this;
    let b = new Bullet();
    b.init(spaceShip.x, spaceShip.y);

    console.log(b, bulletList);
  }
  createMonster() {
    const interval = setInterval(() => {
      let monster = new Monster();
      monster.init(this.canvas.width);
    }, 1000);
  }
}

class SpaceShip {
  constructor(name, x, y) {
    this.name = name;
    this.lev = 1;
    this.score = 0;
    this.x = x;
    this.y = y;
  }
  levelUp(score) {
    this.score = score;
    if (this.score >= this.lev * 10) {
      this.lev += 1;
    }
  }
}

class Bullet {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  init(spaceShipX, spaceShipY) {
    this.x = spaceShipX + 16;
    this.y = spaceShipY;
    this.alive = true;

    bulletList.push(this);
  }
  update() {
    this.y -= 7;
  }
}

class Monster {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  init(width) {
    this.y = 0;
    this.x = this.generateRandomPosX(0, width - 48);

    monsterList.push(this);
  }
  generateRandomPosX(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1));
    return randomNum;
  }
  update(canvasWidth) {
    this.y += 3;

    if (this.y >= canvasWidth) {
      gameOver = true;
    }
  }
}

let game = null;
$startScreen.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = event.target["name-input"].value;
  game = new Game(name);
});
