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
let meteorList = []; // 몬스터 리스트
let score = 0;
let interval;
let gameOver = false;
let clickable = true;
class Game {
    constructor() {
        this.onKeyUp = (event) => {
            if (event.code === "Space") {
                this.createBullet(); // 총알 생성
            }
            delete keysDown[event.key];
        };
        this.onKeyDown = (event) => {
            keysDown[event.key] = true;
        };
        this.canvas = document.querySelector("canvas");
        const ctxRes = this.canvas.getContext("2d");
        if (!ctxRes || !(ctxRes instanceof CanvasRenderingContext2D)) {
            throw new Error('Failed to get 2D context');
        }
        this.ctx = ctxRes;
        this.canvas.width = 500;
        this.canvas.height = window.innerHeight;
        this.start();
    }
    start() {
        this.changeScreen("game");
        this.spaceShip = new SpaceShip(this, this.canvas.width / 2 - 32, this.canvas.height - 84, // 우주선 크기 & 바닥 공간 20
        1);
        console.log(this.spaceShip);
        this.loadImage();
        this.keyEvent();
        this.createMeteor();
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
        meteorList = [];
        gameOver = false;
        keysDown = {};
    }
    changeScreen(screen) {
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
        }
        else if (screen === "game") {
            if ($startScreen instanceof HTMLDivElement) {
                $startScreen.style.display = "none";
            }
            if ($canvasScreen instanceof HTMLDivElement) {
                $canvasScreen.style.display = "flex";
            }
            if ($gameOver instanceof HTMLDivElement) {
                $gameOver.style.display = "none";
            }
        }
        else if (screen === "gameOver") {
            if ($gameOver instanceof HTMLDivElement) {
                $gameOver.style.display = "block";
            }
        }
    }
    main() {
        if (gameOver) {
            this.changeScreen("gameOver");
            this.quit();
            $replayBtn === null || $replayBtn === void 0 ? void 0 : $replayBtn.addEventListener("click", () => this.changeScreen("start"));
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
        this.meteorImage = new Image();
        this.meteorImage.src = `./images/meteor.png`;
        this.gameOverImage = new Image();
        this.gameOverImage.src = "./images/gameover.png";
    }
    renderImage() {
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
    keyEvent() {
        if (!gameOver) {
            document.addEventListener("keydown", this.onKeyDown);
            document.addEventListener("keyup", this.onKeyUp);
        }
    }
    update() {
        const { spaceShip } = this;
        if (spaceShip instanceof SpaceShip) {
            if ("ArrowRight" in keysDown) {
                spaceShip.x += 4;
                // right
            }
            ;
            if ("ArrowLeft" in keysDown) {
                spaceShip.x -= 4;
                // left
            }
            ;
            if ("ArrowUp" in keysDown) {
                spaceShip.y -= 4;
                // right
            }
            ;
            if ("ArrowDown" in keysDown) {
                spaceShip.y += 4;
                // left
            }
            ;
            if (spaceShip.x <= 0) {
                spaceShip.x = 0;
            }
            else if (spaceShip.x >= this.canvas.width - 57) {
                spaceShip.x = this.canvas.width - 57;
            }
            ;
            if (spaceShip.y <= 0) {
                spaceShip.y = 0;
            }
            else if (spaceShip.y >= this.canvas.height - 65) {
                spaceShip.y = this.canvas.height - 65;
            }
            ;
        }
        for (let i = 0; i < bulletList.length; i++) {
            if (bulletList[i].alive) {
                bulletList[i].update();
                bulletList[i].checkHit();
            }
            else {
                bulletList.splice(i, 1);
            }
            ;
        }
        ;
        for (let i = 0; i < meteorList.length; i++) {
            if (spaceShip instanceof SpaceShip) {
                meteorList[i].update(spaceShip, this.canvas.height);
            }
        }
        ;
        if (spaceShip instanceof SpaceShip) {
            // 레벨 체크
            spaceShip.update();
        }
    }
    createBullet() {
        const { spaceShip } = this;
        let b = new Bullet();
        if (spaceShip instanceof SpaceShip) {
            b.init(spaceShip);
        }
    }
    createMeteor() {
        interval = setInterval(() => {
            let meteor = new Meteor();
            meteor.init(this.canvas.width);
        }, 1000);
    }
}
class SpaceShip {
    constructor(game, x, y, lev) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.lev = lev;
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
        for (let i = 0; i < meteorList.length; i++) {
            if (this.y <= meteorList[i].y &&
                this.x + 16 >= meteorList[i].x &&
                this.x + 16 <= meteorList[i].x + 48) {
                score += 1;
                this.alive = false;
                meteorList.splice(i, 1);
            }
        }
    }
}
class Meteor {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    init(width) {
        this.y = 0;
        this.x = this.generateRandomPosX(0, width - 48);
        meteorList.push(this);
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
$gameBtn === null || $gameBtn === void 0 ? void 0 : $gameBtn.addEventListener("click", () => {
    game = new Game();
});
$manualBtn === null || $manualBtn === void 0 ? void 0 : $manualBtn.addEventListener('click', () => {
    if ($manualScreen instanceof HTMLDivElement) {
        $manualScreen.classList.add('on');
    }
});
$okBtn === null || $okBtn === void 0 ? void 0 : $okBtn.addEventListener('click', () => {
    if ($manualScreen instanceof HTMLDivElement) {
        $manualScreen.classList.remove('on');
    }
});
