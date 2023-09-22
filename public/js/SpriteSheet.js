export default class SpriteSheet {
    constructor(image, width, height) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.tiles = new Map();
        this.animations = new Map();
    }

    defineAnimation(name, animation) {
        this.animations.set(name, animation);
    }

    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    define(name, x, y, width, height) {
        // map hace lo mismo que forEach, con la excepción de que crea un nuevo array con los resultados de la función que se le pasa como argumento aplicada a cada elemento del array original.
        const buffers = [false, true].map(flip => {
            const buffer = document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;

            const context = buffer.getContext('2d');

            if (flip) {
                // Esta línea de código invierte el eje x del contexto de dibujo. 
                // Esto significa que cualquier cosa que se dibuje después de esta línea de código se reflejará horizontalmente.
                context.scale(-1, 1);
                // Esta línea de código desplaza el origen del contexto de dibujo a la izquierda por una distancia igual al ancho del canvas. 
                // Esto significa que cualquier cosa que se dibuje después de esta línea de código se moverá a la izquierda en el canvas por 
                // una distancia igual a su ancho.
                context.translate(-width, 0);
            }

            context.drawImage(
                this.image,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height);
            
            return buffer;
        });

        this.tiles.set(name, buffers);

    }

    defineTile(name, x, y) {
        this.define(name, x * this.width, y * this.height, this.width, this.height);
    }

    draw(name, context, x, y, flip = false) {
        const buffer = this.tiles.get(name)[flip ? 1 : 0];
        context.drawImage(buffer, x, y);
    }

    drawAnimation(name, context, x, y, distance) {
        const animation = this.animations.get(name);
        this.drawTile(animation(distance), context, x, y);
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}