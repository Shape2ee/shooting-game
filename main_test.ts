const $startScreen = document.querySelector("#start_screen") as HTMLDivElement
const $canvasScreen = document.querySelector("#canvas_screen") as HTMLDivElement
const $manualScreen = document.querySelector("#manual_screen") as HTMLDivElement;
const $gameOver = document.querySelector(".game_over") as HTMLDivElement;
const $gameBtn = document.querySelector(".game_btn") as HTMLButtonElement;
const $replayBtn = document.querySelector(".replay_btn") as HTMLButtonElement;
const $manualBtn = document.querySelector(".manual_btn") as HTMLButtonElement;
const $okBtn = document.querySelector(".ok_btn") as HTMLButtonElement;

type UserKeys = "ArrowUp" | "ArrowLeft" | "ArrowDown" | "ArrowRight" | " "
type Keys = {
  [key in UserKeys]?: boolean;
}

interface Meteor {
  x: number;
  y: number;
}

interface Bullet extends Meteor {
  alive: boolean;
}

let game = null;
let keysDown: Keys = {};
let bulletList: Bullet[] = []; // 총알 저장 리스트
let meteorList: Meteor[] = []; // 몬스터 리스트
let score: number = 0;
let interval;
let gameOver: boolean = false;
let clickable: boolean = true;


class Game {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public spaceShip?: SpaceShip | null;
  public backgroundImage?: HTMLImageElement
  public bulletImage?: HTMLImageElement
  public spaceShipImage?: HTMLImageElement
  public meteorImage?: HTMLImageElement
  public gameOverImage?: HTMLImageElement

  constructor() {
    this.canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const ctxRes = this.canvas.getContext("2d");
    if (!ctxRes || !(ctxRes instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctxRes;
    this.canvas.width = 500;
    this.canvas.height = window.innerHeight;
    this.start();
  }
  public start() {
    this.changeScreen("game");

    this.spaceShip = new SpaceShip(
      this,
      this.canvas.width / 2 - 32,
      this.canvas.height - 84, // 우주선 크기 & 바닥 공간 20
      1
    );
    console.log(this.spaceShip)
    this.loadImage();
    // this.keyEvent();
    // this.createMonster();
    this.main();
  }
  public changeScreen(screen: string) {
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
  public main() {
    if (gameOver) {
      this.changeScreen("gameOver");
      // this.quit();

      $replayBtn.addEventListener("click", () => this.changeScreen("start"))
      return;
    }

    // this.update();
    this.renderImage();
    requestAnimationFrame(() => this.main());
  }
  public loadImage() {
    this.backgroundImage = new Image();
    this.backgroundImage.src = "./images/background.gif";

    this.bulletImage = new Image();
    this.bulletImage.src = "./images/bullet.png";

    this.spaceShipImage = new Image();
    this.spaceShipImage.src = "./images/space-ship.png";

    this.meteorImage = new Image();
    this.meteorImage.src = `./images/meteor.png`;

    this.gameOverImage = new Image();
    this.gameOverImage.src = "./images/gameover.png";
  }
  public renderImage() {
    const { ctx, spaceShip, canvas } = this;
    ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bulletList.length; i++) {
      if (bulletList[i].alive) {
        ctx.drawImage(this.bulletImage, bulletList[i].x, bulletList[i].y);
      }
    }

    ctx.drawImage(this.spaceShipImage, spaceShip.x, spaceShip.y);

    for (let i = 0; i < meteorList.length; i++) {
      ctx.drawImage(this.meteorImage, meteorList[i].x, meteorList[i].y);
    }

    ctx.fillText(`Score : ${score}`, 20, 30);
    ctx.fillStyle = "white";
    ctx.font = "1rem 맑은 고딕";
  }
}

class SpaceShip {
  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public lev: number
  ) { }
  public update() {
    if (score >= this.lev * 15) {
      this.lev += 1;
    }
  }
}


game = new Game()