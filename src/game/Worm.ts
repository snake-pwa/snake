import {Assets} from '../Assets';
import {Point} from './Point';
import {Renderable, CELL_SIZE} from './Renderer';
import {Keys} from '../controls/Keys';

export class WormSegment extends Point {
    direction: Keys;

    swallowing: boolean = false;

    constructor (x: number, y: number, direction: Keys) {
        super(x, y);
        this.direction = direction;
    }
}

export const WORM_COLOR_DEFAULT = '#4c9ed9';
export const WORM_COLOR_BIG = '#ff5d5d';

export class Worm implements Renderable {
    segments: WormSegment[];

    direction: Keys;

    speed: number = 4.0;    // one square per second

    offset: number = 0.0; // from 0 to 1

    dead: boolean = false;

    color: string = WORM_COLOR_DEFAULT;

    constructor (x: number, y: number, direction: Keys, length: number = 3) {
        this.direction = direction;
        this.segments = [];

        this.segments.push(new WormSegment(x, y, direction));
        while (this.segments.length < length) {
            this.segments.push(this.createNewSegment());
        }
    }

    private moveX(x: number, direction: Keys, value: number = 1) {
        switch (direction) {
            case Keys.LEFT:
                return x - value;
            case Keys.RIGHT:
                return x + value;
        }
        return x;
    }

    private moveY(y: number, direction: Keys, value: number = 1) {
        switch (direction) {
            case Keys.UP:
                return y - value;
            case Keys.DOWN:
                return y + value;
        }
        return y;
    }

    createNewSegment(): WormSegment {
        let head = this.segments[this.segments.length - 1];
        let newHead = new WormSegment(head.x, head.y, this.direction);
        newHead.x = this.moveX(newHead.x, head.direction);
        newHead.y = this.moveY(newHead.y, head.direction);
        return newHead;
    }

    drawFace(ctx: CanvasRenderingContext2D, head: WormSegment, x: number, y: number, time: number) {
        const SIZE = 20;
        let eyesType = 0;

        if (this.dead) {
            eyesType = 2;
        } else if (time % 2000 < 1000 && time % 1000 > 700) {
            // blink eyes every 2 seconds, for 300 ms
            eyesType = 1;
        }

        ctx.drawImage(
            Assets.head,
            head.direction * SIZE,
            eyesType * SIZE,
            SIZE, SIZE, x, y, SIZE, SIZE
        );
    }

    render(ctx: CanvasRenderingContext2D, time: number) {
        const R = 0.3125;
        const R2 = 0.4;
        const MARGIN = 0.5 - R;

        let tail: WormSegment = this.segments[0];
        let head: WormSegment = this.segments[this.segments.length - 1];
        let dx: number = tail.x, dy: number = tail.y;
        let x: number, y: number, r: number;

        r = R2 * CELL_SIZE;

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2 * R * CELL_SIZE;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        // tail
        if (!tail.swallowing) {
            dx = this.moveX(tail.x, tail.direction, this.offset);
            dy = this.moveY(tail.y, tail.direction, this.offset);
        }
        x = (dx + R + MARGIN) * CELL_SIZE;
        y = (dy + R + MARGIN) * CELL_SIZE;

        ctx.beginPath();
        ctx.moveTo(x, y);

        // body
        for (let i = 1; i < this.segments.length; i++) {
            if (this.segments[i - 1].direction !== this.segments[i].direction) {
                x = (this.segments[i].x + R + MARGIN) * CELL_SIZE;
                y = (this.segments[i].y + R + MARGIN) * CELL_SIZE;
                ctx.lineTo(x, y);
            }
        }

        // head
        dx = this.moveX(head.x, head.direction, this.offset);
        dy = this.moveY(head.y, head.direction, this.offset);
        x = (dx + R + MARGIN) * CELL_SIZE;
        y = (dy + R + MARGIN) * CELL_SIZE;
        ctx.lineTo(x, y);
        ctx.stroke();

        // Swallowing segments
        for (let i = 0; i < this.segments.length; i++) {
            if (this.segments[i].swallowing) {
                x = (this.segments[i].x + R + MARGIN) * CELL_SIZE;
                y = (this.segments[i].y + R + MARGIN) * CELL_SIZE;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        // Face
        x = (dx + MARGIN) * CELL_SIZE;
        y = (dy + MARGIN) * CELL_SIZE;
        this.drawFace(ctx, head, x, y, time);

    }

}
