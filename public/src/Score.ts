import {Dom} from './ui/Dom';

const HISCORE = 'hiscore';

export class Score {

    pointsElement: HTMLElement;
    hiscoreElement: HTMLElement;
    hiscore: number = 0;
    points: number = 0;

    constructor(body: Dom) {
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

    addPoint(points: number = 1) {
        this.points += points;
        Dom.setText(this.pointsElement, String(this.points));
        if (this.points > this.hiscore) {
            this.setHiscore(this.points);
        }
    }

    resetPoints() {
        this.points = 0;
        Dom.setText(this.pointsElement, String(this.points));
    }

}
