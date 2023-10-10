import Camera from './Camera.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import Timer from './Timer.js';
import { createLevelLoader } from './loaders/level.js';
import { loadEntities } from './entities.js';
import { createCollisionLayer, createCamaraLayer } from './layers.js';
import { setupKeyboard } from './input.js';
import { setupMouseControl } from './debug.js';

function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    
    return playerEnv;
}

async function main(canvas) {

    const context = canvas.getContext('2d');
    // Comentario yt (Quitar más tardealu)
    context.imageSmoothingEnabled = false;
    const entityFactory = await loadEntities();
    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera();

    // Comentar si queremos desactivar el collision layer
    level.comp.layers.push(
        createCollisionLayer(level),
        /* createCamaraLayer(camera) */);

    const mario = entityFactory.mario();

    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    setupMouseControl(canvas, mario, camera);

    const timer = new Timer(1/60);

    timer.update = function update(deltaTime) {
            level.update(deltaTime);

            camera.pos.x = Math.max(0, mario.pos.x - 100);

            level.comp.draw(context, camera);
    }

    timer.start();

}

const canvas = document.getElementById('screen');

main(canvas);

            
   