'use strict';

interface Listener<T, U> {
    event: T,
    callback: (param?: U) => void
}

export class Emitter<T, U> {

    private listeners: Listener<T, U>[] = [];

    on(event: T, callback: (param?: U) => void): void {
        this.listeners.push({
            event: event,
            callback: callback
        });
    }

    off(event?: T, callback?: (param?: U) => void): void {
        let item: Listener<T, U>;

        function isMatchingListener(listener: Listener<T, U>): boolean {
            if (event === undefined) {
                return true;
            }
            if (event !== listener.event) {
                return false;
            }
            if (callback === undefined) {
                return true;
            }
            if (callback !== listener.callback) {
                return false;
            }
        }

        for (let i = this.listeners.length - 1; i >= 0; i--) {
            item = this.listeners[i];
            if (isMatchingListener(item)) {
                this.listeners.splice(i, 1);
            }
        }
    }

    trigger(event: T, param?: U): void {
        let item: Listener<T, U>;

        for (let i = this.listeners.length - 1; i >= 0; i--) {
            item = this.listeners[i];
            if (item.event === event) {
                item.callback.call(null, param);
            }
        }
    }
}
