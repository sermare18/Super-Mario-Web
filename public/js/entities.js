import Entity from "./Entity.js";
import Go from "./traits/Go.js";
import Jump from './traits/Jump.js';
import { loadSpriteSheet } from './loaders.js';
import { createAnimation } from "./anim.js";

export function createMario() {
    // Carga los sprites predefinidos de Mario
    return loadSpriteSheet('mario')
    .then(sprites => {
        const mario = new Entity();
        mario.size.set(14, 16);

        mario.addTrait(new Go());
        mario.addTrait(new Jump());

        const runAnim = createAnimation(['run-1', 'run-2', 'run-3'], 10);

        function routeFrame(mario) {
            if (mario.go.dir !== 0) {
                return runAnim(mario.go.distance);
            }
            return 'idle';
        }

        mario.draw = function drawMario(context) {
            sprites.draw(routeFrame(this), context, 0, 0, mario.go.heading < 0);
        }

        return mario;

    });
}
