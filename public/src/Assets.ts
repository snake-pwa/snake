
export class Assets {

    static berry: HTMLImageElement;
    static head: HTMLImageElement;

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
            .then(image => this.head = image);
    }

}
