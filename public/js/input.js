import Keyboard from './KeyboardState.js';

export function setupKeyboard(mario) {
    const P = 'KeyP';
    const LEFT = 'KeyA';
    const RIGHT = 'KeyD';
    const RUN = 'KeyO';

    const input = new Keyboard();

    input.addMapping(P, keyState => {
        if (keyState) {
            mario.jump.start();
        } else {
            mario.jump.cancel();
        }
    });

    input.addMapping(RUN, keyState => {
        mario.turbo(keyState);
    });

    input.addMapping(RIGHT, keyState => {
        mario.go.dir += keyState ? 1 : -1;
    });

    input.addMapping(LEFT, keyState => {
        mario.go.dir += keyState ? -1 : 1;
    });

    return input;
}