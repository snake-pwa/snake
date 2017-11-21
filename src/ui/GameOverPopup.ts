'use strict';

import {Dom} from './Dom';
import {Popup} from './Popup';

export class GameOverPopup {

    static open(points: number): Popup {

        let template =
            '<div class="u-text-center">' +
                '<h3>Your final score is:</h3>' +
                `<div class="c-score c-score--huge c-score--points">${points}</div>` +
            '</div>';

        return Popup.open({
            header: 'Well done!',
            body: new Dom(template),
            button: 'Try again',
            animation: true
        });
    }
}
