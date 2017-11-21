import {Assets} from '../Assets';
import {Point} from './Point';
import {Renderable, CELL_SIZE} from './Renderer';

const MAX_MARGIN = 4;
const CYCLE = 800;

export class Berry extends Point implements Renderable {

    render(ctx: CanvasRenderingContext2D, time: number) {
        let x, y, pulse;
        let margin, size;

        x = this.x * CELL_SIZE;
        y = this.y * CELL_SIZE;

        pulse = (time % CYCLE) / CYCLE;
        if (pulse > 0.5) {
            pulse = 1 - pulse;
        }

        margin = pulse * MAX_MARGIN;
        size = CELL_SIZE - 2 * margin;

        ctx.drawImage(Assets.berry, 0, 0, 32, 32, x + margin, y + margin, size, size);
    }
}
