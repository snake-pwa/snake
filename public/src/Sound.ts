import {Dom} from './ui/Dom';

export class Sound {

    static audioCtx: any;
    audio: HTMLAudioElement;
    buffer: Uint8Array;
    loaded: boolean = false;
    path: string;

    constructor(path: string) {
        let AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx && !Sound.audioCtx) {
            Sound.audioCtx = new AudioCtx();
        }

        this.path = path;
    }

    private loadAudioCtx(): Promise<Sound> {
        return new Promise((resolve: any, reject: any) => {
            let request: XMLHttpRequest = new XMLHttpRequest();

            request.open('GET', this.path, true);
            request.responseType = 'arraybuffer';

            request.onload = () => {
                let audioData = request.response;

                Sound.audioCtx.decodeAudioData(audioData, (buffer: Uint8Array) => {
                    this.buffer = buffer;
                    this.loaded = true;
                    resolve(this);

                }, (error: any) => {
                    reject(null);
                });
            }

            request.onerror = (error: ErrorEvent) => {
                reject(null);
            }

            request.send();
        });
    }

    load(): Promise<any> {
        if (Sound.audioCtx) {
            return this.loadAudioCtx();
        }

        return new Promise<Sound>((resolve: any, reject: any) => {
            this.audio = new Audio(this.path);
            this.audio.onloadeddata = () => {
                this.loaded = true;
                resolve(this);
            };
            this.audio.onerror = (error: ErrorEvent) => {
                console.error(error);
                reject(null);
            }
        });
    }

    play() {
        if (!this.loaded) {
            return;
        }

        if (Sound.audioCtx && this.buffer) {
            let source: any = Sound.audioCtx.createBufferSource();
            source.buffer = this.buffer;
            source.connect(Sound.audioCtx.destination);
            source.start(0);

        } else if (this.audio) {
            if (this.audio.paused) {
                this.audio.play();
            } else {
                this.audio.currentTime = 0;
                
            }
        }
    }

}
