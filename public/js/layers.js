export function createBackgroundLayer(level, sprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 240;

    const context = buffer.getContext('2d');

    level.tiles.forEach((tile, x, y) => {
        sprites.drawTile(tile.name, context, x, y);
    });


    return function drawBackgroundLayer(context) {
        context.drawImage(buffer, 0, 0);
    };

}

export function createSpriteLayer(entities) {
    return function drawSpriteLayer(context) {
        entities.forEach(entity => {
            entity.draw(context);
        });
    };
}

export function createCollisionLayer(level) {
    const resolvedTiles = [];

    const tileResolver = level.tileCollider.tiles;
    const tileSize = tileResolver.tileSize;

    const getByIndexOriginal = tileResolver.getByIndex;
    // We override de getByIndex method of the tileResolver object.
    tileResolver.getByIndex = function getByIndexFake(x, y) {
        // console.log(x, y);
        resolvedTiles.push({x, y});
        //  El método call permite llamar a una función y especificar el valor de this dentro de la función, así como los argumentos que se 
        // pasarán a la función. En este caso, se está llamando a la función getByIndexOriginal con tileResolver como el valor
        // de this y x e y como argumentos.
        return getByIndexOriginal.call(tileResolver, x, y);
    }

    return function drawCollision(context) {
        // Dibujamos en azul el contorno de la ficha donde se situa el personaje.
        context.strokeStyle = 'blue';
        resolvedTiles.forEach(({x, y}) => {
            // console.log('Would draw', x, y);

            // Este método comienza un nuevo camino en el lienzo. Un camino es una serie de puntos en el lienzo conectados por líneas y curvas.
            context.beginPath();
            // Este método crea un rectángulo en el lienzo. Los primeros dos parámetros son las coordenadas x e y del punto superior 
            // izquierdo del rectángulo. Los dos últimos parámetros son el ancho y la altura del rectángulo.
            context.rect(x * tileSize, y * tileSize, tileSize, tileSize);
            // context.stroke(): Este método dibuja el contorno del camino actual o dado con el estilo de trazo actual. 
            // En este caso, dibujará el contorno del rectángulo que definiste anteriormente con context.rect().
            // El color y el estilo del trazo se pueden definir con propiedades como context.strokeStyle y context.lineWidth.
            context.stroke();
        });

        // Dibujamos en rojo el contorno de los personajes.
        context.strokeStyle = 'red';
        level.entities.forEach(entity => {
            context.beginPath();
            context.rect(entity.pos.x, entity.pos.y, entity.size.x, entity.size.y);
            context.stroke();
        });

        resolvedTiles.length = 0;
    };
}

