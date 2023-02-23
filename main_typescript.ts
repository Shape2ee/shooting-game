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

let game: Game | null = null;
let keysDown: Keys = {};
let bulletList: Array<Bullet> = []; // 총알 저장 리스트
let meteorList: Array<Meteor> = []; // 몬스터 리스트
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
  private start(): void {
    this.changeScreen("game");

    this.spaceShip = new SpaceShip(
      this,
      this.canvas.width / 2 - 32,
      this.canvas.height - 84, // 우주선 크기 & 바닥 공간 20
      1
    );
    console.log(this.spaceShip)
    this.loadImage();
    this.keyEvent();
    this.createMeteor();
    this.main();
  }
  private quit() {
    clearInterval(interval);
    game = null;
    this.spaceShip = null;
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    score = 0;
    bulletList = [];
    meteorList = [];
    gameOver = false;
    keysDown = {}
  }
  private changeScreen(screen: string): void {
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
  private main(): void {
    if (gameOver) {
      this.changeScreen("gameOver");
      this.quit();
      $replayBtn?.addEventListener("click", () => this.changeScreen("start"))
      return;
    }

    this.update();
    this.renderImage();
    requestAnimationFrame(() => this.main());
  }
  private loadImage(): void {
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
  private renderImage(): void {
    const { ctx, spaceShip, canvas, backgroundImage, bulletImage, spaceShipImage, meteorImage } = this;
    if (backgroundImage instanceof HTMLImageElement) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    for (let i = 0; i < bulletList.length; i++) {
      if (!bulletList[i].alive) {
        break;
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
  private keyEvent(): void {
    if (!gameOver) {
      document.addEventListener("keydown", this.onKeyDown);
      document.addEventListener("keyup", this.onKeyUp);
    }
  }
  private onKeyUp = (event: KeyboardEvent): void => {
    if (event.code === "Space") {
      this.createBullet(); // 총알 생성
    }

    delete keysDown[event.key];
  }
  private onKeyDown = (event: KeyboardEvent): void => {
    keysDown[event.key] = true;
  }
  private update(): void {
    const { spaceShip } = this;
    if (spaceShip instanceof SpaceShip) {
      if ("ArrowRight" in keysDown) {
        spaceShip.x += 4;
        // right
      };

      if ("ArrowLeft" in keysDown) {
        spaceShip.x -= 4;
        // left
      };

      if ("ArrowUp" in keysDown) {
        spaceShip.y -= 4;
        // right
      };

      if ("ArrowDown" in keysDown) {
        spaceShip.y += 4;
        // left
      };

      if (spaceShip.x <= 0) {
        spaceShip.x = 0;
      } else if (spaceShip.x >= this.canvas.width - 57) {
        spaceShip.x = this.canvas.width - 57;
      };

      if (spaceShip.y <= 0) {
        spaceShip.y = 0;
      } else if (spaceShip.y >= this.canvas.height - 65) {
        spaceShip.y = this.canvas.height - 65;
      };
    }

    for (let i = 0; i < bulletList.length; i++) {
      if (bulletList[i].alive) {
        bulletList[i].update();
        bulletList[i].checkHit();
      } else {
        bulletList.splice(i, 1);
      };
    };

    for (let i = 0; i < meteorList.length; i++) {
      if (spaceShip instanceof SpaceShip) {
        meteorList[i].update(spaceShip, this.canvas.height);
      }
    };

    if (spaceShip instanceof SpaceShip) {
      // 레벨 체크
      spaceShip.update();
    }
  }
  private createBullet(): void {
    const { spaceShip } = this;

    let b = new Bullet();
    if (spaceShip instanceof SpaceShip) {
      b.init(spaceShip);
    }
  }
  private createMeteor(): void {
    interval = setInterval(() => {
      let meteor = new Meteor();
      meteor.init(this.canvas.width);
    }, 1000);
  }
}

class SpaceShip {
  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public lev: number
  ) { }
  public update(): void {
    if (score >= this.lev * 15) {
      this.lev += 1;
    }
  }
}

class Bullet {
  public x: number;
  public y: number;
  public alive?: boolean;
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  init(spaceShip: SpaceShip) {
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
    for (let i = 0; i < meteorList.length; i++) {
      if (
        this.y <= meteorList[i].y &&
        this.x + 16 >= meteorList[i].x &&
        this.x + 16 <= meteorList[i].x + 48
      ) {
        score += 1;
        this.alive = false;
        meteorList.splice(i, 1);
      }
    }
  }
}

class Meteor {
  public x: number;
  public y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
  init(width: number) {
    this.y = 0;
    this.x = this.generateRandomPosX(0, width - 48);

    meteorList.push(this);
  }
  generateRandomPosX(min: number, max: number) {
    let randomNum = Math.floor(Math.random() * (max - min + 1));
    return randomNum;
  }
  update(spaceShip: SpaceShip, canvasHeight: number) {
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

$gameBtn?.addEventListener("click", () => {
  game = new Game();
});

$manualBtn?.addEventListener('click', () => {
  if ($manualScreen instanceof HTMLDivElement) {
    $manualScreen.classList.add('on');
  }
})

$okBtn?.addEventListener('click', () => {
  if ($manualScreen instanceof HTMLDivElement) {
    $manualScreen.classList.remove('on');
  }
})