const $startScreen = document.querySelector("#start-screen");
const $canvasScreen = document.querySelector("#canvas-screen");
const $name = document.querySelector("#name");
let keysDown = {};
let bulletList = []; // 총알 저장 리스트

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
    this.main();
  }
  changeScreen(screen) {
    if (screen === "start") {
      $startScreen.style.display = "block";
      $canvasScreen.style.display = "none";
    } else if (screen === "game") {
      $startScreen.style.display = "none";
      $canvasScreen.style.display = "block";
    }
  }
  main() {
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
    ctx.font = "30px Arial";

    for (let i = 0; i < bulletList.length; i++) {
      if (bulletList[i].alive) {
        ctx.drawImage(this.bulletImage, bulletList[i].x, bulletList[i].y);
      }
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
      spaceShip.x += 3;
      // right
    }

    if ("ArrowLeft" in keysDown) {
      spaceShip.x -= 3;
      // left
    }

    for (let i = 0; i < bulletList.length; i++) {
      if (bulletList[i].alive) {
        bulletList[i].update();
        // bulletList[i].checkHit();
      } else {
        bulletList.splice(i, 1);
      }
    }
  }
  createBullet() {
    const { spaceShip } = this;
    let b = new Bullet();
    b.init(spaceShip.x, spaceShip.y);

    console.log(b, bulletList);
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
  getScore(score) {
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

let game = null;
$startScreen.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = event.target["name-input"].value;
  game = new Game(name);
});
