export function createBackgroundLayer(level, sprites) {
    const tiles = level.tiles;
    const resolver = level.tileCollider.tiles; 

    const buffer = document.createElement('canvas');
    buffer.width = 256 + 16;
    buffer.height = 240;

    const context = buffer.getContext('2d');

    let startIndex, endIndex;
    // En tu función redraw(startIndex, endIndex), estás recorriendo las columnas de la matriz desde startIndex hasta endIndex. 
    // Sin embargo, cuando dibujas los tiles en el buffer, quieres que el primer tile que dibujas (en la columna startIndex) aparezca 
    // en la posición x=0 del buffer. Por eso restas startIndex de x al dibujar.

    // Por ejemplo, si tu matriz tiene 100 columnas y estás redibujando desde la columna 30 hasta la 39, entonces quieres que la columna 30 
    // se dibuje en la posición x=0 del buffer, la columna 31 en la posición x=1, y así sucesivamente. 
    // Al restar startIndex (en este caso, 30) de x, consigues este ajuste.
    function redraw(drawFrom, drawTo) {
        if (drawFrom === startIndex && drawTo === endIndex) {
            return;
        }

        startIndex = drawFrom;
        endIndex = drawTo;

        // console.log('Redrawing', -camera.pos.x % 16);
        // console.log('startIndex:', startIndex);

        // Vamos iterando sobre las columnas de la Matrix
        for (let x = startIndex; x <= endIndex; ++x) {
            const col = tiles.grid[x];
            if (col) {
                col.forEach((tile, y) => {
                    // console.log('x:', x);
                    sprites.drawTile(tile.name, context, x - startIndex, y);
                });
            }
        }
    }

    // minuto: 47
    return function drawBackgroundLayer(context, camera) {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera.pos.x);
        const drawTo = drawFrom + drawWidth;
        redraw(drawFrom, drawTo);
        // El signo menos - en -camera.pos.x y -camera.pos.y se utiliza para desplazar el origen del contexto de dibujo en la dirección 
        // opuesta a la posición de la cámara. Esto se hace para que cuando la cámara se mueva hacia la derecha (aumentando camera.pos.x), 
        // el fondo se dibuje hacia la izquierda (disminuyendo x), creando así la ilusión de que la cámara se está moviendo a través del
        // escenario. Lo mismo aplica para los movimientos verticales con camera.pos.y.

        // console.log(-camera.pos.x, -camera.pos.x % 16);

        // camera.pos.x % 16 calcula cuántos píxeles has avanzado dentro del tile actual.
        context.drawImage(
            buffer, 
            -camera.pos.x % 16, 
            -camera.pos.y);
    };

}

export function createSpriteLayer(entities, width = 64, height = 64) {

    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = width;
    spriteBuffer.height = height;
    const spriteBufferContext = spriteBuffer.getContext('2d');

    return function drawSpriteLayer(context, camera) {
        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height);

            entity.draw(spriteBufferContext);

            context.drawImage(
                spriteBuffer,
                entity.pos.x - camera.pos.x,
                entity.pos.y - camera.pos.y
            )
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
        resolvedTiles.push({ x, y });
        //  El método call permite llamar a una función y especificar el valor de this dentro de la función, así como los argumentos que se 
        // pasarán a la función. En este caso, se está llamando a la función getByIndexOriginal con tileResolver como el valor
        // de this y x e y como argumentos.
        return getByIndexOriginal.call(tileResolver, x, y);
    }

    return function drawCollision(context, camera) {
        // Dibujamos en azul el contorno de la ficha donde se situa el personaje.
        context.strokeStyle = 'blue';
        resolvedTiles.forEach(({ x, y }) => {
            // console.log('Would draw', x, y);

            // Este método comienza un nuevo camino en el lienzo. Un camino es una serie de puntos en el lienzo conectados por líneas y curvas.
            context.beginPath();
            // Este método crea un rectángulo en el lienzo. Los primeros dos parámetros son las coordenadas x e y del punto superior 
            // izquierdo del rectángulo. Los dos últimos parámetros son el ancho y la altura del rectángulo.
            context.rect(
                x * tileSize - camera.pos.x,
                y * tileSize - camera.pos.y,
                tileSize,
                tileSize);
            // context.stroke(): Este método dibuja el contorno del camino actual o dado con el estilo de trazo actual. 
            // En este caso, dibujará el contorno del rectángulo que definiste anteriormente con context.rect().
            // El color y el estilo del trazo se pueden definir con propiedades como context.strokeStyle y context.lineWidth.
            context.stroke();
        });

        // Dibujamos en rojo el contorno de los personajes.
        context.strokeStyle = 'red';
        level.entities.forEach(entity => {
            context.beginPath();
            context.rect(
                entity.pos.x - camera.pos.x,
                entity.pos.y - camera.pos.y,
                entity.size.x,
                entity.size.y);
            context.stroke();
        });

        resolvedTiles.length = 0;
    };
}

// camaraToDraw: the camara rectangle we draw
export function createCamaraLayer(cameraToDraw) {
    // fromCamera: the perspective we draw from
    return function drawCameraRect(context, fromCamera) {
        context.strokeStyle = 'purple';
        context.beginPath();
        context.rect(
            cameraToDraw.pos.x - fromCamera.pos.x,
            cameraToDraw.pos.y - fromCamera.pos.y,
            cameraToDraw.size.x,
            cameraToDraw.size.y);
        context.stroke();
    }
}

