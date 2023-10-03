import Camera from './Camera.js';
import Timer from './Timer.js';
import { loadLevel } from './loaders.js';
import { createMario } from './entities.js';
import { createCollisionLayer, createCamaraLayer } from './layers.js';
import { setupKeyboard } from './input.js';
import { setupMouseControl } from './debug.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

// Comentario yt (Quitar más tardealu)
context.imageSmoothingEnabled = false;

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
    loadLevel('1-1')
])
.then(([mario, level]) => {
    const camera = new Camera();
    window.camera = camera;

    mario.pos.set(64, 64);

    // Comentar si queremos desactivar el collision layer
    // level.comp.layers.push(
    //     createCollisionLayer(level),
    //     createCamaraLayer(camera));

    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    setupMouseControl(canvas, mario, camera);

    const timer = new Timer(1/60);

    timer.update = function update(deltaTime) {
            level.update(deltaTime);

            if (mario.pos.x > 100) {
                camera.pos.x = mario.pos.x - 100;
            }

            level.comp.draw(context, camera);
    }

    timer.start();


});

            
   