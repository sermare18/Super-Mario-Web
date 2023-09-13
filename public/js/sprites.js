import SpriteSheet from './SpriteSheet.js';
import { loadImage } from './loaders.js';

/**
 * Carga una imagen de sprites de personajes del mundo de Super Mario desde una URL y devuelve una 
 * promesa que se resuelve con la hoja de sprites cargada.
 * 
 * @returns {Promise<SpriteSheet>} Una promesa que se resuelve con un objeto SpriteSheet que contiene los sprites de Mario.
 */
export function loadMarioSprites() {
    // Carga una imagen desde una URL y devuelve una promesa que se resuleve con la imagen cargada
    return loadImage('/img/characters.gif')
    .then(image => {
        // Se crea una SpriteSheet para almacenar fichas de personajes de 16 pixeles de ancho x 16 pixeles de alto.
        const sprites = new SpriteSheet(image, 16, 16);
        // Se define el personaje de mario
        sprites.define('idle', 276, 44, 16, 16);
        // Se devuelve un objeto tipo SpriteSheet con los personajes definidos previamente.
        return sprites;
    });
}