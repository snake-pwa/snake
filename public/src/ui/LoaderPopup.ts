'use strict';

import {Dom} from './Dom';
import {Popup} from './Popup';

let template = `<div class="c-loader">
    <span class="c-loader__ball"></span>
    <span class="c-loader__ball"></span>
    <span class="c-loader__ball"></span>
    <span class="c-loader__ball"></span>
    <span class="c-loader__ball"></span>
</div>`;

export class LoaderPopup {

    static open(): Popup {
        return Popup.open({
            header: 'Loading...',
            body: new Dom(template)
        });
    }
}
