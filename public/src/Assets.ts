
export class Assets {

    static pop: HTMLAudioElement;
    static point: HTMLAudioElement;
    static dead: HTMLAudioElement;
    static berry: HTMLImageElement;
    static head: HTMLImageElement;

    static loadAudio(path: string): Promise<HTMLAudioElement> {
        return new Promise<HTMLAudioElement>((resolve: any, reject: any) => {
            let audio: HTMLAudioElement = new Audio(path);
            audio.onloadeddata = () => {
                resolve(audio);
            };
            audio.onerror = () => {
                reject(null);
            };
        });
    }

    static loadImage(path: string): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve: any, reject: any) => {
            let image: HTMLImageElement = new Image();
            image.src = path;
            image.onload = () => {
                resolve(image);
            };
            image.onerror = () => {
                reject(null);
            }
        });
    }

    static loadAll(): Promise<any> {
        return this.loadImage('images/berry-small.png')
            .then(image => this.berry = image)
            .then(() => this.loadImage('images/snake-head.png'))
            .then(image => this.head = image)
            .then(() => this.loadAudio('images/dead.mp3'))
            .then(audio => this.dead = audio)
            .then(() => this.loadAudio('images/point.mp3'))
            .then(audio => this.point = audio)
            .then(() => this.loadAudio('images/pop.mp3'))
            .then(audio => this.pop = audio);
    }

}
