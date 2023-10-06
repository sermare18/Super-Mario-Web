import Entity, {Sides} from "../Entity.js";
import PendulumWalk from "../traits/PendulumWalk.js"; 
import { loadSpriteSheet } from '../loaders.js';

// Load functions are asynchronous and create functions are synchronous.
export function loadKoopa() {
    return loadSpriteSheet('koopa')
        .then(createKoopaFactory);
}

function createKoopaFactory(sprite) {
    // Scope de createKoopaFactory

    const walkAnim = sprite.animations.get('walk');

    function drawKoopa(context) {
        sprite.draw(walkAnim(this.lifetime), context, 0, 0, this.vel.x < 0);
    }

    return function createKoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.y = 8;

        koopa.addTrait(new PendulumWalk());

        koopa.draw = drawKoopa;

        return koopa;
    }
}
