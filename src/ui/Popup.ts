'use strict';

import {Dom} from './Dom';

interface PopupParams {
    header: string,
    body: Dom | string,
    button?: string,
    buttonCallback?: Function,
    backdrop?: boolean,
    classes?: string[]
}

let template = `
<div class="c-modal">
    <div class="c-modal__popup c-modal__popup--sm" data-name="popup">
        <div class="c-modal__popup__header"><h2 data-name="header"></h2></div>
        <div class="c-modal__popup__body" data-name="message"></div>
        <div class="c-modal__popup__footer" data-name="footer"></div>
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

    static open(params: PopupParams): Popup {
        let element: Dom = new Dom(template);
        let dom: Dom;

        if (params.classes) {
            params.classes.forEach(className => element.element.classList.add(className));
        }

        if (params.body instanceof Dom) {
            dom = params.body;
        } else {
            dom = new Dom(`<p>${params.body}</p>`);
        }

        Dom.setText(element.names['header'], params.header);
        element.names['message'].appendChild(dom.element);

        let popup: Popup = new Popup(element);

        element.on('click', element.names['popup'], (event: Event) => {
            event.stopPropagation();
            event.preventDefault();
        });

        if (params.button) {
            dom = new Dom(`<span class="c-modal__button">${params.button}</span>`);
            element.names['footer'].appendChild(dom.element);

            element.on('click', dom.element, (event: Event) => {
                if (params.buttonCallback) {
                    params.buttonCallback();
                } else {
                    popup.close('button');
                }
            });
        }

        if (params.backdrop !== false) {
            element.on('click', element.element, (event: Event) => {
                popup.dismiss('overlay');
            });
        }

        return popup;
    }
}
