import {Dom} from './ui/Dom';

const SOUND = 'sound';
const MUTED_CLASS = 'muted';

export class Sound {

    soundElement: HTMLElement;
    mute: boolean = false;

    constructor(body: Dom) {
        this.soundElement = body.names['soundButton'];
        this.loadMute();
    }

    loadMute() {
        this.mute = false;
        let value: string = window.localStorage.getItem(SOUND);
        if (value !== null) {
            this.mute = (value === 'true');
        }
    }

    toggleMute() {
        this.mute = !this.mute;
        window.localStorage.setItem(SOUND, this.mute ? 'true' : 'false');

        if (this.mute) {
            this.soundElement.classList.add(MUTED_CLASS);
        } else {
            this.soundElement.classList.remove(MUTED_CLASS);
        }
    }

}
