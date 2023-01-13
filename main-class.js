const $startScreen = document.querySelector("#start_screen");
const $canvasScreen = document.querySelector("#canvas_screen");
const $manualScreen = document.querySelector("#manual_screen");
const $gameOver = document.querySelector(".game_over");
const $gameBtn = document.querySelector(".game_btn");
const $replayBtn = document.querySelector(".replay_btn");
const $manualBtn = document.querySelector(".manual_btn");
const $okBtn = document.querySelector(".ok_btn");
let game = null;
let keysDown = {};
let bulletList = []; // 총알 저장 리스트
let monsterList = []; // 몬스터 리스트
let score = 0; 
let interval;
let gameOver = false;
let clickable = true;

class Game {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 500;
    this.canvas.height = window.innerHeight;

    this.start();
  }
  start() {
    this.changeScreen("game");

    this.spaceShip = new SpaceShip(
      this,
      this.canvas.width / 2 - 32,
      this.canvas.height - 84 // 우주선 크기 & 바닥 공간 20
    );

    this.loadImage();
    this.keyEvent();
    this.createMonster();
    this.main();
  }
  quit() {
    clearInterval(interval);
    game = null;
    this.spaceShip = null;
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    score = 0;
    bulletList = [];
    monsterList = [];
    gameOver = false;
    keysDown = []
  }
  changeScreen(screen) {
    if (screen === "start") {
      $startScreen.style.display = "flex";
      $canvasScreen.style.display = "none";
      $gameOver.style.display = "none";
    } else if (screen === "game") {
      $startScreen.style.display = "none";
      $canvasScreen.style.display = "flex";
      $gameOver.style.display = "none";
    } else if (screen === "gameOver") {
      $gameOver.style.display = "block";
    }
  }
  main() {
    if (gameOver) {
      this.changeScreen("gameOver");
      this.quit();

      $replayBtn.addEventListener("click", () => this.changeScreen("start"))
      return;
    }

    this.update();
    this.renderImage();
    requestAnimationFrame(() => this.main());
  }
  loadImage() {
    this.backgroundImage = new Image();
    this.backgroundImage.src = "./images/background.gif";

    this.bulletImage = new Image();
    this.bulletImage.src = "./images/bullet.png";
    
    this.spaceShipImage = new Image();
    this.spaceShipImage.src = "./images/space-ship.png";

    this.monsterImage = new Image();
    this.monsterImage.src = `./images/meteor.png`;

    this.gameOverImage = new Image();
    this.gameOverImage.src = "./images/gameover.png";
  }
  renderImage() {
    const { ctx, spaceShip, canvas } = this;
    ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < bulletList.length; i++) {
      if (bulletList[i].alive) {
        ctx.drawImage(this.bulletImage, bulletList[i].x, bulletList[i].y);
      }
    }

    ctx.drawImage(this.spaceShipImage, spaceShip.x, spaceShip.y);

    for (let i = 0; i < monsterList.length; i++) {
      ctx.drawImage(this.monsterImage, monsterList[i].x, monsterList[i].y);
    }

    ctx.fillText(`Score : ${score}`, 20, 30);
    ctx.fillStyle = "white";
    ctx.font = "1rem 맑은 고딕";
  }
  keyEvent() {
    if(!gameOver) {
      document.addEventListener("keydown", this.onKeyDown);
      document.addEventListener("keyup", this.onKeyUp);
    }
  }
  onKeyUp = (event) => {
    if (event.code === "Space") {
      this.createBullet(); // 총알 생성
    }

    delete keysDown[event.key];
  }
  onKeyDown = (event) => {
    keysDown[event.key] = true;
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

    if ("ArrowUp" in keysDown) {
      spaceShip.y -= 4;
      // right
    }

    if ("ArrowDown" in keysDown) {
      spaceShip.y += 4;
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
        bulletList[i].checkHit();
      } else {
        bulletList.splice(i, 1);
      }
    }

    for (let i = 0; i < monsterList.length; i++) {
      monsterList[i].update(spaceShip, this.canvas.height);
    }

    // 레벨 체크
    spaceShip.update();
  }
  createBullet() {
    const { spaceShip } = this;

    let b = new Bullet();
    b.init(spaceShip);
  }
  createMonster() {
    interval = setInterval(() => {
      let monster = new Monster();
      monster.init(this.canvas.width);
    }, 1000);
  }
}

class SpaceShip {
  constructor(game, x, y) {
    this.game = game;
    this.lev = 1;
    this.x = x;
    this.y = y;
  }
  update() {
    if (score >= this.lev * 15) {
      this.lev += 1;
    }
  }
}

class Bullet {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  init(spaceShip) {
    this.x = spaceShip.x + 12.5;
    this.y = spaceShip.y;
    this.alive = true;

    bulletList.push(this);
  }
  update() {
    this.y -= 7;

    if (this.y < 0) {
      this.alive = false;
    }  
  }
  checkHit() {
    for (let i = 0; i < monsterList.length; i++) {
      if (
        this.y <= monsterList[i].y &&
        this.x + 16 >= monsterList[i].x &&
        this.x + 16 <= monsterList[i].x + 48
      ) {
        score += 1;
        this.alive = false;
        monsterList.splice(i, 1);
      }
    }
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
  update(spaceShip, canvasHeight) {
    this.y += spaceShip.lev / 2;
    // this.y += 3;

    if (this.y + 48 >= canvasHeight) {
      gameOver = true;
    }

    if (this.x >= spaceShip.x
        && this.x <= spaceShip.x + 57
        || this.x + 48 >= spaceShip.x
        && this.x + 48 <= spaceShip.x + 57) {
      if (this.y + 24 >= spaceShip.y) {
        gameOver = true;
      }
    }
  }
}

$gameBtn.addEventListener("click", () => {
  game = new Game();
});

$manualBtn.addEventListener('click', () => {
  $manualScreen.classList.add('on');
})

$okBtn.addEventListener('click', () => {
  $manualScreen.classList.remove('on');
})