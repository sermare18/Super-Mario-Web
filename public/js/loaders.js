import SpriteSheet from "./SpriteSheet.js";
import { createAnimation } from "./anim.js";

/**
 * Carga una imagen desde una URL y devuelve una promesa que se resuleve con la imagen cargada
 * @param {string} url - La URL de la imagen que se va a cargar
 * @returns {Promise<HTMLImageElement>} Una promesa que se resuelve con el objeto de imagen cargado
 */
export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            // La función resolve no se llama hasta que se dispara el evento load. Esto sucede después de que se haya establecido la propiedad src y la imagen se haya cargado completamente.
            // Por lo tanto, la promesa no se resuelve hasta que la imagen se haya cargado completamente.
            resolve(image);
        });
        image.src = url;
    });
}

export function loadJSON(url) {
    return fetch(url)
        .then(r => r.json());
}

export function loadSpriteSheet(name) {
    return loadJSON(`/sprites/${name}.json`)
        .then(sheetSpec => Promise.all([
            sheetSpec,
            loadImage(sheetSpec.imageURL),
        ]))
        .then(([sheetSpec, image]) => {
            const sprite = new SpriteSheet(
                image,
                sheetSpec.tileW,
                sheetSpec.tileH);

            if (sheetSpec.tiles) {
                sheetSpec.tiles.forEach(tileSpec => {
                    sprite.defineTile(
                        tileSpec.name,
                        tileSpec.index[0],
                        tileSpec.index[1]);
                });
            }

            if (sheetSpec.frames) {
                sheetSpec.frames.forEach(frameSpec => {
                    sprite.define(frameSpec.name, ...frameSpec.rect);
                });
            }

            if (sheetSpec.animations) {
                sheetSpec.animations.forEach(animSpec => {
                    const animation = createAnimation(animSpec.frames, animSpec.frameLen);
                    sprite.defineAnimation(animSpec.name, animation);
                });
            }

            return sprite;
        });
}