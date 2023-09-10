import Level from "./Level.js";
import { createBackgroundLayer, createSpriteLayer } from './layers.js';
import {loadBackgroundSprites } from './sprites.js';

// La función resolve no se llama hasta que se dispara el evento load. Esto sucede después de que se haya establecido la propiedad src y la imagen se haya cargado completamente.
// Por lo tanto, la promesa no se resuelve hasta que la imagen se haya cargado completamente.
export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

function createTiles(level, backgrounds) {
    backgrounds.forEach(background => {
        background.ranges.forEach(([x1, x2, y1, y2]) => {
            for (let x = x1; x < x2; ++x) {
                for (let y = y1; y < y2; ++y) {
                    level.tiles.set(x, y, {
                        name: background.tile,
                    });
                }
            }
        });
    });
}

export function loadLevel(name) {
    // la función fetch se utiliza para cargar un archivo JSON de forma asíncrona desde una URL específica. 
    return Promise.all([
        fetch(`/levels/${name}.json`).then(r => r.json()),
        loadBackgroundSprites(),
    ])
    .then(([levelSpec, backgroundSprites]) => {
        const level = new Level();

        createTiles(level, levelSpec.backgrounds);

        const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
        level.comp.layers.push(backgroundLayer);

        const spriteLayer = createSpriteLayer(level.entities);
        level.comp.layers.push(spriteLayer);

        return level;
    });
}