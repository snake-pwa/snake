'use strict';

import {Keys} from './Keys';

export interface Controllable {
    onKey: (key: Keys) => void
};

export abstract class Controls {

    listeners: Controllable[] = [];

    attach(controllable: Controllable) {
        this.listeners.push(controllable);
    }
    
    deattach(controllable: Controllable) {
        let index: number = this.listeners.indexOf(controllable);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    triggerKey(key: Keys) {
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i].onKey(key);
        }
    }

}
