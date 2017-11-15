'use strict';

import {Keys} from './Keys';
import {Controls} from './Controls';

interface Position {
    x: number,
    y: number,
    time: number
};

const MOUSE_BUFFER_TIME = 200;
const MIN_DIFFERENCE = Math.min(window.innerWidth, window.innerHeight) / 10;

export class TouchControls extends Controls {

    onStart: (event: Event) => void;
    onMove: (event: Event) => void;
    onStop: (event: Event) => void;
    onCancel: (event: Event) => void;

    queue: Position[] = [];
    pressTime: number = 0;
    moved: boolean = false;

    constructor() {
        super();

        this.onStart = (event: TouchEvent) => {
            this.pressTime = Date.now();
            this.moved = false;
        }

        this.onMove = (event: TouchEvent) => {
            if (!this.pressTime) {
                return;
            }
            this.appendPos(event.touches[0].clientX, event.touches[0].clientY);
            this.checkMove();

            // prevent bounce-scroll, refresh on scroll-top and others.
            event.preventDefault();
        }

        this.onStop = (event: TouchEvent) => {
            let now = Date.now();
            if (!this.moved && now - this.pressTime < MOUSE_BUFFER_TIME) {
                this.triggerKey(Keys.ACTION);
            }
            this.pressTime = 0;
        }

        this.onCancel = (event: TouchEvent) => {
            this.pressTime = 0;
        }

        window.addEventListener('touchstart', this.onStart);
        window.addEventListener('touchmove', this.onMove);
        window.addEventListener('touchend', this.onStop);
        window.addEventListener('touchcancel', this.onCancel);
    }

    appendPos(x: number, y: number) {
        let pos: Position = {x: x, y: y, time: Date.now()};
        let threshold = pos.time - MOUSE_BUFFER_TIME;
        this.queue.push(pos);

        for (let i = this.queue.length - 1; i >= 0; i--) {
            if (this.queue[i].time < threshold) {
                this.queue.splice(0, i + 1);
                break;
            }
        }
    }

    private checkMove() {
        let len = this.queue.length;

        if (len < 2) {
            return;
        }

        let first: Position = this.queue[0];
        let last: Position = this.queue[len - 1];

        let diffX = first.x - last.x;
        let diffY = first.y - last.y;

        if (Math.abs(diffX) >= Math.abs(diffY)) {
            if (diffX > MIN_DIFFERENCE) {
                this.triggerKey(Keys.LEFT);
                this.moved = true;
            } else if (diffX < -MIN_DIFFERENCE) {
                this.triggerKey(Keys.RIGHT);
                this.moved = true;
            }
        } else {
            if (diffY > MIN_DIFFERENCE) {
                this.triggerKey(Keys.UP);
                this.moved = true;
            } else if (diffY < -MIN_DIFFERENCE) {
                this.triggerKey(Keys.DOWN);
                this.moved = true;
            }
        }
    }

    remove() {
        window.removeEventListener('touchstart', this.onStart);
        window.removeEventListener('touchmove', this.onMove);
        window.removeEventListener('touchend', this.onStop);
        window.removeEventListener('touchcancel', this.onCancel);
    }
}
