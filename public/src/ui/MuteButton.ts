import {Dom} from './Dom';

const SOUND = 'sound';
const MUTED_CLASS = 'muted';

export class MuteButton {

    soundElement: HTMLElement;
    mute: boolean = false;

    constructor(body: Dom) {
        this.soundElement = body.names['soundButton'];
        this.loadMute();
    }

    loadMute() {
        let value: string = window.localStorage.getItem(SOUND);
        if (value !== null) {
            this.mute = (value === 'true');
        }

        if (this.mute) {
            this.soundElement.classList.add(MUTED_CLASS);
        } else {
            this.soundElement.classList.remove(MUTED_CLASS);
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

    play(sound: HTMLAudioElement) {
        if (this.mute) {
            return;
        }

        if (sound.paused) {
            sound.play();
        } else {
            sound.currentTime = 0;
        }
    }

}
