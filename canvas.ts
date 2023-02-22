class canvas {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const res = this.canvas.getContext("2d");
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = res;
    this.canvas.width = 500;
    this.canvas.height = window.innerHeight;
  }
}

new canvas()