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

export function loadLevel(name) {
    // la función fetch se utiliza para cargar un archivo JSON de forma asíncrona desde una URL específica. 
    return fetch(`/levels/${name}.json`)
    .then(r => r.json());
}