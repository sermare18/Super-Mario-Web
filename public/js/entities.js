import Entity from "./Entity.js";
import Go from "./traits/Go.js";
import Velocity from './traits/Velocity.js';
import Jump from './traits/Jump.js';
import { loadMarioSprites } from './sprites.js';


export function createMario() {
    // Carga los sprites predefinidos de Mario
    return loadMarioSprites()
    .then(sprites => {
        const mario = new Entity();
        mario.size.set(14, 16);

        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        // mario.addTrait(new Velocity());

        mario.draw = function drawMario(context) {
            sprites.draw('idle', context, 0, 0);
        }

        return mario;

    });
}
