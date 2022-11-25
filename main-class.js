const $startScreen = document.querySelector("#start-screen");
const $canvasScreen = document.querySelector("#canvas-screen");
const $name = document.querySelector("#name");

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
  }

  main() {
    this.renderImage();
    requestAnimationFrame(() => this.main());
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
}

let game = null;
$startScreen.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = event.target["name-input"].value;
  game = new Game(name);
});
