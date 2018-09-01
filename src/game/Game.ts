import {Point} from './Point';
import {Berry} from './Berry';
import {Worm, WormSegment, WORM_COLOR_DEFAULT, WORM_COLOR_BIG} from './Worm';
import {Renderable, Renderer} from './Renderer';
import {Controllable} from '../controls/Controls';
import {Emitter} from '../ui/Emitter';
import {Keys} from '../controls/Keys';

export enum GameEvents {
    GAME_OVER,
    ADD_POINT,
    KEY
}

const MAX_SNAKE_LENGTH = 150;
const SNAKE_COLOR_CHANGE = 102;
const SNAKE_SPPEDUP = 0.04;

export class Game implements Renderable, Controllable {

    sizeX: number;
    sizeY: number;
    berries: Berry[];
    worm: Worm;
    board: Point[][];
    emitter: Emitter<GameEvents, void>;
    renderer: Renderer;
    gameLoop: (time: number) => void;

    paused: boolean = false;
    started: boolean = false;
    frameTime: number;

    constructor(sizeX: number, sizeY: number, canvas: HTMLCanvasElement) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.renderer = new Renderer(sizeX, sizeY, canvas);
        this.emitter = new Emitter<GameEvents, void>();

        this.gameLoop = (time: number) => {
            if (this.paused || !this.started || this.worm.dead) {
                return;
            }
            let deltaTime: number = 0;
            if (this.frameTime !== undefined) {
                deltaTime = time - this.frameTime;
            }
            this.frameTime = time;

            this.simulate(deltaTime);
            this.updateFrame(time);
            requestAnimationFrame(this.gameLoop);
        };

        this.gameLoop = this.gameLoop.bind(this);

        this.reset();
    }

    reset() {
        this.started = false;
        this.worm = new Worm(2, Math.floor(this.sizeY / 2), Keys.RIGHT);
        this.berries = [];
        this.frameTime = undefined;

        this.updateBoard();
        this.addBerry();

        this.updateFrame();
    }

    private updateBoard(): void {
        this.board = new Array(this.sizeX);
        for (let i = 0; i < this.sizeX; i++) {
            this.board[i] = new Array(this.sizeY);
        }
        this.worm.segments.forEach(p => this.board[p.x][p.y] = p);
    }

    private updateFrame(time: number = 0): void {
        this.renderer.clearFrame();
        this.render(this.renderer.ctx, time);
    }

    private addBerry(): void {
        let l = this.sizeX * this.sizeY;
        let offset = Math.round(Math.random() * (l - 1));
        let x, y;

        for (let i = 0; i < l ; i++) {
            x = (i + offset) % this.sizeX;
            y = Math.floor((i + offset) / this.sizeX) % this.sizeY;
            if (!this.board[x][y]) {
                break;
            }
        }

        let berry = new Berry(x, y);
        this.berries.push(berry);
        this.board[x][y] = berry;
    }

    growWorm(head: WormSegment) {
        let len = this.worm.segments.length;

        // Don't grow above 150
        if (len > MAX_SNAKE_LENGTH) {
            return;
        }

        // Change worm color, when reached 100 points
        if (len > SNAKE_COLOR_CHANGE) {
            this.worm.color = WORM_COLOR_BIG;
        }

        head.swallowing = true;
        this.worm.speed += SNAKE_SPPEDUP;
    }

    simulate(deltaTime: number) {
        let head: WormSegment;
        let tail: WormSegment;
        let index: number;
        let isKeyEvent: boolean = false;

        this.worm.offset += this.worm.speed * deltaTime / 1000;

        if (this.worm.offset >= 1.0) {
            head = this.worm.segments[this.worm.segments.length - 1];

            // check if worm have changed the direction
            if (head.direction !== this.worm.direction) {
                isKeyEvent = true;
            }

            head = this.worm.createNewSegment();
        }

        while (this.worm.offset >= 1.0) {
            if (this.board[head.x][head.y] instanceof Berry) {
                this.growWorm(head);
                index = this.berries.indexOf(<Berry>this.board[head.x][head.y]);
                this.berries.splice(index, 1);
                this.emitter.trigger(GameEvents.ADD_POINT);
                this.addBerry();
            }

            tail = this.worm.segments[0];
            if (!tail.swallowing) {
                this.worm.segments.shift();
                this.board[tail.x][tail.y] = undefined;
            }
            tail.swallowing = false;

            this.worm.segments.push(head);
            this.board[head.x][head.y] = head;
            this.worm.offset -= 1.0;

            head = this.worm.createNewSegment();            

            if (head.x < 0 || head.y < 0 ||
                head.x >= this.sizeX || head.y >= this.sizeY ||
                this.board[head.x][head.y] instanceof WormSegment
            ) {
                this.worm.dead = true;
                this.worm.offset = 0;
                this.emitter.trigger(GameEvents.GAME_OVER);
                return;
            }
        }

        if (isKeyEvent && !this.worm.dead) {
            this.emitter.trigger(GameEvents.KEY);
        }
    }

    public pause() {
        this.paused = true;
    }

    public resume() {
        this.paused = false;
        this.frameTime = undefined;
        requestAnimationFrame(this.gameLoop);
    }

    render(ctx: CanvasRenderingContext2D, time: number) {
        for (let i = 0; i < this.berries.length; i++) {
            this.berries[i].render(ctx, time);
        }
        this.worm.render(ctx, time);
    }

    onKey(key: Keys) {
        if (this.started === false) {
            this.started = true;
            requestAnimationFrame(this.gameLoop);
        }

        let head = this.worm.segments[this.worm.segments.length - 1];

        if (key === Keys.UP && head.direction !== Keys.DOWN) {
            this.worm.direction = key;
        } else if (key === Keys.DOWN && head.direction !== Keys.UP) {
            this.worm.direction = key;
        } else if (key === Keys.LEFT && head.direction !== Keys.RIGHT) {
            this.worm.direction = key;
        } else if (key === Keys.RIGHT && head.direction !== Keys.LEFT) {
            this.worm.direction = key;
        }
    }

}
