import Entity from "./Entity.js";
import Velocity from './traits/Velocity.js';
import Jump from './traits/Jump.js';
import { loadMarioSprites } from './sprites.js';


export function createMario() {
    return loadMarioSprites()
    .then(sprites => {
        const mario = new Entity();

        mario.addTrait(new Velocity());
        mario.addTrait(new Jump());

        mario.draw = function drawMario(context) {
            sprites.draw('idle', context, this.pos.x, this.pos.y);
        }

        return mario;

    });
}
