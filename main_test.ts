const $startScreen = document.querySelector<HTMLDivElement>("#start_screen")
const $canvasScreen = document.querySelector<HTMLDivElement>("#canvas_screen")
const $manualScreen = document.querySelector<HTMLDivElement>("#manual_screen")
const $gameOver = document.querySelector<HTMLDivElement>(".game_over")
const $gameBtn = document.querySelector<HTMLButtonElement>(".game_btn")
const $replayBtn = document.querySelector<HTMLButtonElement>(".replay_btn")
const $manualBtn = document.querySelector<HTMLButtonElement>(".manual_btn")
const $okBtn = document.querySelector<HTMLButtonElement>(".ok_btn")

// type UserKeys = "ArrowUp" | "ArrowLeft" | "ArrowDown" | "ArrowRight" | " "
// type Keys = {
//   [key in UserKeys]?: boolean;
// }
interface Keys {
  [key: string]: boolean
}

interface Meteor {
  x: number;
  y: number;
}

interface Bullet extends Meteor {
  alive: boolean;
}

let game: Game | null = null;
let keysDown: Keys = {};
let bulletList: Bullet[] = []; // 총알 저장 리스트
let meteorList: Meteor[] = []; // 몬스터 리스트
let score: number = 0;
let interval: number;
let gameOver: boolean = false;
let clickable: boolean = true;


class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private spaceShip?: SpaceShip | null;
  private backgroundImage?: HTMLImageElement
  private bulletImage?: HTMLImageElement
  private spaceShipImage?: HTMLImageElement
  private meteorImage?: HTMLImageElement
  private gameOverImage?: HTMLImageElement

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
  private start() {
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
  private changeScreen(screen: string) {
    if (screen === "start") {
      if ($startScreen instanceof HTMLDivElement) {
        $startScreen.style.display = "flex";
      }
      if ($canvasScreen instanceof HTMLDivElement) {
        $canvasScreen.style.display = "none";
      }
      if ($gameOver instanceof HTMLDivElement) {
        $gameOver.style.display = "none";
      }
    } else if (screen === "game") {
      if ($startScreen instanceof HTMLDivElement) {
        $startScreen.style.display = "none";
      }
      if ($canvasScreen instanceof HTMLDivElement) {
        $canvasScreen.style.display = "flex";
      }
      if ($gameOver instanceof HTMLDivElement) {
        $gameOver.style.display = "none";
      }
    } else if (screen === "gameOver") {
      if ($gameOver instanceof HTMLDivElement) {
        $gameOver.style.display = "block";
      }
    }
  }
  private main() {
    if (gameOver) {
      this.changeScreen("gameOver");
      // this.quit();
      $replayBtn?.addEventListener("click", () => this.changeScreen("start"))
      return;
    }

    // this.update();
    this.renderImage();
    requestAnimationFrame(() => this.main());
  }
  private loadImage() {
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
  private renderImage() {
    const { ctx, spaceShip, canvas, backgroundImage, bulletImage, spaceShipImage, meteorImage } = this;
    if (backgroundImage instanceof HTMLImageElement) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    for (let i = 0; i < bulletList.length; i++) {
      if (!bulletList[i].alive) {
        return;
      }
      if (bulletImage instanceof HTMLImageElement) {
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
      }
    }

    if (spaceShipImage instanceof HTMLImageElement
      && spaceShip instanceof SpaceShip) {
      ctx.drawImage(spaceShipImage, spaceShip.x, spaceShip.y);
    }

    for (let i = 0; i < meteorList.length; i++) {
      if (meteorImage instanceof HTMLImageElement) {
        ctx.drawImage(meteorImage, meteorList[i].x, meteorList[i].y);
      }
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