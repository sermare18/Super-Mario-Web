import { Matrix } from "../math.js";
import Level from "../Level.js";
import { createBackgroundLayer, createSpriteLayer } from '../layers.js';
import { loadJSON, loadSpriteSheet } from "../loaders.js";

export function loadLevel(name) {
    // la función fetch se utiliza para cargar un archivo JSON de forma asíncrona desde una URL específica. 
    return loadJSON(`/levels/${name}.json`)
        .then(levelSpec => Promise.all([
            levelSpec,
            loadSpriteSheet(levelSpec.spriteSheet)
        ]))
        .then(([levelSpec, backgroundSprites]) => {
            const level = new Level();

            // Junta todas las layers del juego en una.
            const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
                return mergedTiles.concat(layerSpec.tiles);
            }, []);

            const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
            level.setCollisionGrid(collisionGrid);

            levelSpec.layers.forEach(layer => {
                const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
                const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
                level.comp.layers.push(backgroundLayer);
            });

            const spriteLayer = createSpriteLayer(level.entities);
            level.comp.layers.push(spriteLayer);

            return level;
        });
}

function createCollisionGrid(tiles, patterns) {
    const grid = new Matrix();

    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.set(x, y, {type: tile.type});
    }

    return grid;
}

function createBackgroundGrid(tiles, patterns) {
    const grid = new Matrix();

    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.set(x, y, {name: tile.name});
    }

    return grid;
}

// Generated function
function* expandSpan(xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
        for (let y = yStart; y < yEnd; ++y) {
            yield { x, y };
        }
    }
}

function expandRange(range) {
    if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpan(xStart, xLen, yStart, yLen);
    } else if (range.length === 3) { // Solo vamos a colocar 1 tile en el eje y
        const [xStart, xLen, yStart] = range;
        return expandSpan(xStart, xLen, yStart, 1);
    } else if (range.length === 2) { // Solo vamos a colocar 1 tile en ambos ejes (x e y)
        const [xStart, yStart] = range;
        return expandSpan(xStart, 1, yStart, 1);
    }
}

// Generated function
function* expandRanges(ranges) {
    for (const range of ranges) {
        for (const item of expandRange(range)) {
            yield item;
        }
    }
}

function expandTiles(tiles, patterns) {
    const expandedTiles = [];

    function walkTiles(tiles, offsetX, offsetY) {
        for (const tile of tiles) {
            for (const { x, y } of expandRanges(tile.ranges)) {
                const derivedX = x + offsetX;
                const derivedY = y + offsetY;
                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles;
                    walkTiles(tiles, derivedX, derivedY);
                } else { // Si no es un pattern
                    expandedTiles.push({
                        tile,
                        x: derivedX,
                        y: derivedY
                    })
                }
            }
        }
    }
    
    walkTiles(tiles, 0, 0);

    return expandedTiles;
}