import {Dom} from './Dom';

const HISCORE = 'hiscore';

const POINTS_PER_COLOR = 10;

const BODY_COLORS = [
    '#71beb8', '#03A9F4', '#1fda5e', '#FFBB00', '#FB6542', '#fd81fb',
    '#067a00', '#0008a8', '#8d0000', '#ccc', '#000'
];

export class Score {

    body: Dom;
    pointsElement: HTMLElement;
    hiscoreElement: HTMLElement;
    hiscore: number = 0;
    points: number = 0;

    constructor(body: Dom) {
        this.body = body;
        this.pointsElement = body.names['points'];
        this.hiscoreElement = body.names['hiscore'];
        this.loadHiscore();
        Dom.setText(this.hiscoreElement, String(this.hiscore));
    }

    loadHiscore() {
        this.hiscore = 0;
        let value: string = window.localStorage.getItem(HISCORE);
        if (value !== null) {
            this.hiscore = parseInt(value, 10);
        }
    }

    setHiscore(score: number) {
        this.hiscore = score;
        window.localStorage.setItem(HISCORE, String(score));
        Dom.setText(this.hiscoreElement, String(this.hiscore));
    }

    private updateBodyColor(): void {
        let index = Math.floor(this.points / POINTS_PER_COLOR);
        index = index % BODY_COLORS.length;
        if (this.body.element.style.background !== BODY_COLORS[index]) {
            this.body.element.style.background = BODY_COLORS[index];
        }
    }

    addPoint(points: number = 1) {
        this.points += points;
        this.updateBodyColor();

        Dom.setText(this.pointsElement, String(this.points));
        if (this.points > this.hiscore) {
            this.setHiscore(this.points);
        }
    }

    resetPoints() {
        this.points = 0;
        this.updateBodyColor();
        Dom.setText(this.pointsElement, String(this.points));
    }

}
