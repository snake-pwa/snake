'use strict';

const ELEMENT_NODE: number = 1;

type ListenerItem = {
    event: string,
    element: HTMLElement,
    callback: EventListenerOrEventListenerObject
}

export class Dom {

    element: HTMLElement;

    private listeners: ListenerItem[];

    public names: {[key:string]: HTMLElement} = {};

    constructor(template: string | HTMLElement) {
        let container : HTMLElement,
            element : HTMLElement;

        if ((<HTMLElement>template).nodeType === ELEMENT_NODE) {
            element = <HTMLElement>template;
        } else {
            container = window.document.createElement('div');
            container.innerHTML = <string>template;
            element = this.findFirstElement(container.childNodes);
        }

        if (!element) {
            throw new Error('Failed to compile template: ' + template);
        }

        this.generateNamedElements(element);
        this.element = element;
        this.listeners = [];
    }

    private findFirstElement(nodeList : NodeList) : HTMLElement {
        let node: Node = null;

        for (let i = 0; i < nodeList.length; i++) {

            node = nodeList.item(i);

            if (node.nodeType === ELEMENT_NODE) {
                return <HTMLElement>node;
            }
        }

        return null;
    }

    private generateNamedElements(element: HTMLElement) {
        let elements: NodeListOf<Element> = element.querySelectorAll('[data-name]');
        let name: string;

        for (let i = 0; i < elements.length; i++) {
            name = elements[i].getAttribute('data-name');
            this.names[name] = <HTMLElement>elements[i];
        }
    }

    append(element: Array<HTMLElement> | Array<Dom> | HTMLElement | Dom) {
        if (element instanceof Array) {
            for (let i = 0; i < element.length; i++) {
                this.append(element[i]);
            }
            return;
        }
        if (element instanceof Dom) {
            element = element.element;
        }
        this.element.appendChild(element);
    }

    remove(element : HTMLElement | Dom) {
        if (element instanceof Dom) {
            element = element.element;
        }
        this.element.removeChild(element);
    }

    static setText(element: HTMLElement, text: string) {
        let textNode: Text = document.createTextNode(text);
        element.innerText = textNode.textContent;
    }

    on(event: string, element: HTMLElement, callback: EventListenerOrEventListenerObject) {
        if (arguments.length === 2) {
            callback = <EventListenerOrEventListenerObject>arguments[1];
            element = this.element;
        }

        this.listeners.push({
            event, element, callback
        });

        element.addEventListener(event, callback);
    }

    off(
        element: HTMLElement = undefined,
        event: string = undefined,
        callback: EventListenerOrEventListenerObject = undefined
    ) {
        let item: ListenerItem;

        function isMatchingListener(listener: ListenerItem): boolean {
            if (element === undefined) {
                return true;
            }
            if (element !== listener.element) {
                return false;
            }
            if (event === undefined) {
                return true;
            }
            if (event !== listener.event) {
                return false;
            }
            if (callback === undefined) {
                return true;
            }
            return callback === listener.callback;
        }

        for (let i = this.listeners.length - 1; i >= 0; i--) {
            item = this.listeners[i];
            if (isMatchingListener(item)) {
                item.element.removeEventListener(item.event, item.callback);
                this.listeners.splice(i, 1);
            }
        }
    }
}
