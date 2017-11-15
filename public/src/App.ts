import 'es6-promise-shim';

import {Dom} from './ui/Dom';
import {Popup} from './ui/Popup';
import {Assets} from './Assets';
import {KeyboardControls} from './controls/KeyboardControls';
import {TouchControls} from './controls/TouchControls';
import {Game, GameEvents} from './game/Game';
import {Score} from './Score';
import {Sound} from './Sound';

class App {

    body: Dom;
    game: Game;
    keyboard: KeyboardControls;
    touch: TouchControls;
    score: Score;
    sound: Sound;

    constructor(body: HTMLElement) {
        this.body = new Dom(body);
        this.keyboard = new KeyboardControls();
        this.touch = new TouchControls();
        this.score = new Score(this.body);
        this.sound = new Sound(this.body);
    }

    reset() {
        this.score.resetPoints();
        this.game.reset();
    }

    pause() {
        this.keyboard.deattach(this.game);
        this.touch.deattach(this.game);
        this.game.pause();
    }

    resume() {
        this.keyboard.attach(this.game);
        this.touch.attach(this.game);
        this.game.resume()
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        }
    }

    init() {
        let gameCanvas = <HTMLCanvasElement>this.body.names['gameCanvas'];
        this.game = new Game(15, 15, gameCanvas);

        this.keyboard.attach(this.game);
        this.touch.attach(this.game);

        this.game.emitter.on(GameEvents.GAME_OVER, () => {
            Popup.open({
                header: 'Game over',
                html: `You did well - ${this.score.points} points.`,
                button: 'Try again'
            })
                .then(() => this.reset())
                .catch(() => this.reset());
        });

        this.game.emitter.on(GameEvents.ADD_POINT, () => {
            this.score.addPoint();
        });

        this.body.on('click', this.body.names['pauseButton'], (event: Event) => {
            if (!this.game.started) {
                return;
            }

            this.pause();

            Popup.open({
                header: 'Paused',
                html: 'Game is now paused.',
                button: 'Resume'
            })
                .then(() => this.resume())
                .catch(() => this.resume());

        });

        this.body.on('click', this.body.names['soundButton'], (event: Event) => {
            this.sound.toggleMute();
        });
    }
}


let body: HTMLElement = window.document.getElementsByTagName('body')[0];
let app: App = new App(body);

Assets.loadAll().then(() => {
    app.init();
    app.registerServiceWorker();
});
