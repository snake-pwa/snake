'use strict';

import {Dom} from './Dom';

interface PopupParams {
    header: string,
    html: string,
    button: string,
}

let template = `
<div class="c-modal">
    <div class="c-modal__popup c-modal__popup--sm" data-name="popup">
        <div class="c-modal__popup__header">
            <h2 data-name="header"></h2>
        </div>
        <div class="c-modal__popup__body" data-name="message"></div>
        <div class="c-modal__popup__footer">
            <span class="c-modal__button" data-name="button"></span>
        </div>
    </div>
</div>`;

export class Popup {
    result: Promise<any>;

    element: Dom;
    
    container: HTMLElement;

    private resolve: (value: any) => void;
    private reject: (reason: any) => void;

    constructor(element: Dom, container: HTMLElement = undefined) {
        this.result = new Promise<any>((resolve: any, reject: any) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        this.element = element;

        if (container === undefined) {
            container = window.document.getElementsByTagName('body')[0];
        }
        this.container = container;
        this.container.appendChild(this.element.element)
    }

    close(value: any) {
        this.resolve(value);
        this.element.off();
        this.container.removeChild(this.element.element);
    }

    dismiss(reason: any) {
        this.reject(reason);
        this.element.off();
        this.container.removeChild(this.element.element);
    }

    static open(params: PopupParams) {
        let element = new Dom(template);

        Dom.setText(element.names['header'], params.header);
        element.names['message'].innerHTML = params.html;
        Dom.setText(element.names['button'], params.button);

        let popup: Popup = new Popup(element);

        element.on('click', element.names['popup'], (event: Event) => {
            event.stopPropagation();
            event.preventDefault();
        });

        element.on('click', element.names['button'], (event: Event) => {
            popup.close('button');
        });

        element.on('click', element.element, (event: Event) => {
            popup.dismiss('overlay');
        });

        return popup.result;
    }
}
