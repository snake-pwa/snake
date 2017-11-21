'use strict';

import {Keys} from './Keys';
import {Controls} from './Controls';

const KEY_TO_DIRECTION: {[keyCode:number]: Keys} = {
    38: Keys.UP, // ArrowUp,
    37: Keys.LEFT, // ArrowLeft,
    40: Keys.DOWN, // ArrowDown,
    39: Keys.RIGHT, // ArrowRight,
    87: Keys.UP, // KeyW,
    65: Keys.LEFT, // 'KeyA,
    83: Keys.DOWN, // 'KeyS,
    68: Keys.RIGHT // 'KeyD
};

export class KeyboardControls extends Controls {

    keyDownCallback: (event: Event) => void;

    constructor() {
        super();

        this.keyDownCallback = (event: KeyboardEvent) => {
            let keyCode: number = event.keyCode || event.which;
            let key: Keys = KEY_TO_DIRECTION[keyCode];

            if (key !== undefined) {
                this.triggerKey(key);
            }
        }

        this.keyDownCallback = this.keyDownCallback.bind(this);
        window.addEventListener('keydown', this.keyDownCallback);
    }

    remove() {
        window.removeEventListener('keydown', this.keyDownCallback);
    }
}
