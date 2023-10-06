import { loadMario } from './entities/Mario.js';
import { loadGoomba } from './entities/Goomba.js';
import { loadKoopa } from './entities/Koopa.js';

export function loadEntities() {
    const entityFactories = {};

    function addAs(name) {
        // Esta línea está devolviendo una nueva función que toma un argumento, factory. Esta función asigna factory a la propiedad name del objeto entityFactories.
        return factory => entityFactories[name] = factory;
    }

    return Promise.all([
        loadMario().then(addAs('mario')),
        loadGoomba().then(addAs('goomba')),
        loadKoopa().then(addAs('koopa')),
    ])
    .then(() => entityFactories);
}