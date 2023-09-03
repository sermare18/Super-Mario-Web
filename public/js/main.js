import Compositor from './Compositor.js';
import {loadLevel} from './loaders.js';
import { loadMarioSprites, loadBackgroundSprites } from './sprites.js';
import { createBackgroundLayer } from './layers.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

function createSpriteLayer(sprite, pos) {
    return function drawSpriteLayer(context) {
        for (let i = 0; i < 20; ++i){
            sprite.draw('idle', context, pos.x + i * 16, pos.y);
        }
    };
}

// Promise.all() es un método estático de la clase Promise en JavaScript que toma un iterable de promesas como entrada y devuelve
// una sola promesa. Esta promesa devuelta se cumple cuando todas las promesas de entrada se cumplen (incluyendo cuando se pasa un 
// iterable vacío), con un array de los valores de cumplimiento.
// Se rechaza cuando cualquiera de las promesas de entrada se rechaza, con el primer motivo de rechazo.

// Promise.all() puede ser útil para agregar los resultados de múltiples promesas. 
// Se utiliza típicamente cuando hay varias tareas asíncronas relacionadas en las que el código general depende para funcionar 
// correctamente, y todas las cuales queremos que se cumplan antes de que la ejecución del código continúe.

// Resumiendo, utilizamos Promise.all() para cargar en paralelo loadBackgroundSprites() y loadLevel().

Promise.all([
    loadMarioSprites(),
    loadBackgroundSprites(),
    loadLevel('1-1')
])
.then(([marioSprite, backgroundSprites, level]) => {
    const comp = new Compositor();

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
    comp.layers.push(backgroundLayer)

    const pos = {
        x: 0,
        y: 0,
    };

    const spriteLayer = createSpriteLayer(marioSprite, pos);
    comp.layers.push(spriteLayer);

    function update() {
        comp.draw(context);
        // marioSprite.draw('idle', context, pos.x, pos.y);
        pos.x += 2;
        pos.y += 2;
        requestAnimationFrame(update)
    }

    update();

});

            
   