import {Emitter} from './Emitter';

"use strict";

describe('Emitter', function () {

    it('Should be able to trigger an event', function () {
        // given
        let emitter = new Emitter();
        let callback1 = jasmine.createSpy('callback1');
        let callback2 = jasmine.createSpy('callback2');
        let callback3 = jasmine.createSpy('callback3');

        // when
        emitter.on('EVENT1', callback1);
        emitter.on('EVENT2', callback2);
        emitter.on('EVENT1', callback3);
        emitter.trigger('EVENT1');

        // then
        expect(emitter).toBeDefined();
        expect(callback1).toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
        expect(callback3).toHaveBeenCalled();
        expect(callback1.calls.count()).toEqual(1);
        expect(callback3.calls.count()).toEqual(1);
    });

    it('Should trigger events with the parameter', function () {
        // given
        let emitter = new Emitter();
        let callback = jasmine.createSpy('callback');

        // when
        emitter.on('EVENT', callback);
        emitter.trigger('EVENT', 'PARAM');

        // then
        expect(callback).toHaveBeenCalledWith('PARAM');
    });

    it('Should unregister all listeners', function () {
        // given
        let emitter = new Emitter();
        let callback = jasmine.createSpy('callback');

        // when
        emitter.on('EVENT1', callback);
        emitter.off();
        emitter.trigger('EVENT1');

        // then
        expect(callback).not.toHaveBeenCalled();
    });

    it('Should unregister listeners all listeners of given name', function () {
        // given
        let emitter = new Emitter();
        let callback1 = jasmine.createSpy('callback1');
        let callback2 = jasmine.createSpy('callback2');
        let callback3 = jasmine.createSpy('callback3');

        // when
        emitter.on('EVENT1', callback1);
        emitter.on('EVENT2', callback2);
        emitter.on('EVENT1', callback3);
        emitter.off('EVENT1');
        emitter.trigger('EVENT1');
        emitter.trigger('EVENT2');

        // then
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
        expect(callback3).not.toHaveBeenCalled();
    });

    it('Should unregister listener by reference', function () {
        // given
        let emitter = new Emitter();
        let callback1 = jasmine.createSpy('callback1');
        let callback2 = jasmine.createSpy('callback2');
        let callback3 = jasmine.createSpy('callback3');

        // when
        emitter.on('EVENT1', callback1);
        emitter.on('EVENT2', callback2);
        emitter.on('EVENT1', callback3);
        emitter.off('EVENT1', callback1);
        emitter.trigger('EVENT1');
        emitter.trigger('EVENT2');

        // then
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
        expect(callback3).toHaveBeenCalled();
    });

});
