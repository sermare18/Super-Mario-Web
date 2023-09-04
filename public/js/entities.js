import Entity from "./Entity.js";
import { loadMarioSprites } from './sprites.js';

export function createMario() {
    return loadMarioSprites()
    .then(sprites => {
        const mario = new Entity();

        mario.draw = function drawMario(context) {
            sprites.draw('idle', context, this.pos.x, this.pos.y);
        }

        // Cuanto más tiempo pase en cada frame que genera el navegador más avanza mario (MUY IMPORTANTE)
        mario.update = function updateMario(deltaTime) {
            this.pos.x += this.vel.x * deltaTime;
            this.pos.y += this.vel.y * deltaTime;
        }

        return mario;

    });
}
