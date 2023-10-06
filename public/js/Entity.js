import { Vec2 } from "./math.js";
import BoundingBox from "./BoundingBox.js";

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right'),
};

export class Trait {
    constructor(name) {
        this.NAME = name;
    }

    obstruct() {
        
    }

    update() {
        console.warn('Unhandled update call in Trait');
    }
}
 
export default class Entity {
    constructor() {
        this.pos = new Vec2(0, 0);
        this.vel = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        // Representates how much the coliision layer is offset from the position (Allow Koopa pass throght 1 tile heigh escenarios).
        this.offset = new Vec2(0, 0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        this.lifetime = 0;

        // A trait is a instance of a class that can operate on the Entity. COMPOSITION
        this.traits = [];
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    obstruct(side) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side);
        });
    }

    update(deltaTime) {
        this.traits.forEach(trait => {
            trait.update(this, deltaTime);
        });

        this.lifetime += deltaTime;
    }
}