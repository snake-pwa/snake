import {Game} from './Game';
import {Assets} from '../Assets';

"use strict";

describe('Game', function () {

    let canvas: HTMLCanvasElement;

    beforeEach(function () {
        canvas = document.createElement('canvas');
    });

    it('Should create the game with valid properties', function () {
        let game = new Game(10, 20, canvas);

        expect(game.started).toBeFalsy();
        expect(game.sizeX).toEqual(10);
        expect(game.sizeY).toEqual(20);
    });

});
