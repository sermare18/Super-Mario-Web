const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
    constructor() {
        // Holds the current state of a given key
        this.keyStates = new Map();

        // Holds the callback functions for a key code
        this.keyMap = new Map();
    }

    addMapping(keyCode, callback) {
        this.keyMap.set(keyCode, callback);
    }

    handleEvent(event) {
        // La línea de código const {keyCode} = event; extrae el valor de la propiedad keyCode del objeto event y lo asigna a una nueva variable llamada keyCode
        const { keyCode } = event;

        if (!this.keyMap.has(keyCode)) {
            // Did not have key mapped. Return undefined
            return;
        }

        event.preventDefault();

        const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

        if (this.keyStates.get(keyCode) === keyState) {
            return;
        }

        this.keyStates.set(keyCode, keyState);
        console.log(this.keyStates);

        // Llamamos a una función almacenada en el mapa this.keyMap, utilizando la clave keyCode para buscar la función y pasándole keyState como argumento.
        this.keyMap.get(keyCode)(keyState);
    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            });
        });
    }
}