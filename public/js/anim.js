// La variable frameLen en esta función determina la duración de cada cuadro (o frame) en la animación.
// Si estableces frameLen a 10, esto significa que cada cuadro (o frame) de tu animación se mostrará durante 10 unidades de “distancia”.
 export function createAnimation(frames, frameLen) {
    return function resolveFrame(distance) {
        const frameIndex = Math.floor(distance / frameLen % frames.length);
        const frameName = frames[frameIndex];
        return frameName;
    }
}