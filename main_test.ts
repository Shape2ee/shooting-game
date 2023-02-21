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
let score: number = 0;
let interval;
let gameOver: boolean = false;
let clickable: boolean = true;

class Game {
  constructor() {

  }
}

class SpaceShip {
  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public lev: number
  ) { }
  update() {
    if (score >= this.lev * 15) {
      this.lev += 1;
    }
  }
}