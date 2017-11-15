
export interface Renderable {
    render(ctx: CanvasRenderingContext2D, time: number): void;
}

export const CELL_SIZE: number = 32;

export class Renderer {
    sizeX: number;
    sizeY: number;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(sizeX: number, sizeY: number, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.canvas.width = CELL_SIZE * sizeX;
        this.canvas.height = CELL_SIZE * sizeY;

        this.ctx =  canvas.getContext("2d");
    }

    clearFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
