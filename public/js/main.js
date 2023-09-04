import Compositor from './Compositor.js';
import Timer from './Timer.js';
import { loadLevel } from './loaders.js';
import { createMario } from './entities.js';
import {loadBackgroundSprites } from './sprites.js';
import { createBackgroundLayer, createSpriteLayer } from './layers.js';

import Keyboard from './KeyboardState.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

// Promise.all() es un método estático de la clase Promise en JavaScript que toma un iterable de promesas como entrada y devuelve
// una sola promesa. Esta promesa devuelta se cumple cuando todas las promesas de entrada se cumplen (incluyendo cuando se pasa un 
// iterable vacío), con un array de los valores de cumplimiento.
// Se rechaza cuando cualquiera de las promesas de entrada se rechaza, con el primer motivo de rechazo.

// Promise.all() puede ser útil para agregar los resultados de múltiples promesas. 
// Se utiliza típicamente cuando hay varias tareas asíncronas relacionadas en las que el código general depende para funcionar 
// correctamente, y todas las cuales queremos que se cumplan antes de que la ejecución del código continúe.

// Resumiendo, utilizamos Promise.all() para cargar en paralelo loadBackgroundSprites() y loadLevel().

Promise.all([
    createMario(),
    loadBackgroundSprites(),
    loadLevel('1-1')
])
.then(([mario, backgroundSprites, level]) => {
    const comp = new Compositor();

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
    comp.layers.push(backgroundLayer);

    const gravity = 2000;
    mario.pos.set(64, 180);

    const SPACE = 32;
    const input = new Keyboard();
    input.addMapping(SPACE, keyState => {
        if (keyState) {
            mario.jump.start();
        } else {
            mario.jump.cancel();
        }
        console.log(keyState);
    });
    input.listenTo(window);

    const spriteLayer = createSpriteLayer(mario);
    comp.layers.push(spriteLayer);

    const timer = new Timer(1/60);

    timer.update = function update(deltaTime) {
            mario.update(deltaTime);

            comp.draw(context);

            mario.vel.y += gravity * deltaTime;
    }

    timer.start();


});

            
   