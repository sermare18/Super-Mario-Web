export function setupMouseControl(canvas, entity, camera) {
    let lastEvent;

    ['mousedown', 'mousemove'].forEach(eventName => {
        canvas.addEventListener(eventName, event => {
            // Esto significa que solo se ejecutará el código dentro del bloque if si el botón primario del mouse (generalmente el botón izquierdo) está presionado cuando se activa el evento.
            if (event.buttons === 1) {
                entity.vel.set(0, 0);
                entity.pos.set(
                    event.offsetX + camera.pos.x, 
                    event.offsetY + camera.pos.y);
            } else if(event.buttons === 2 
                && lastEvent && lastEvent.buttons === 2
                && lastEvent.type === 'mousemove') {
                    camera.pos.x -= event.offsetX - lastEvent.offsetX;
            }
            lastEvent = event;
        });
    });

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault();
    })
}
