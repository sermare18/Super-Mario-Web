const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
    constructor() {
        // Holds the current state of a given key
        this.keyStates = new Map();

        // Holds the callback functions for a key code
        this.keyMap = new Map();
    }

    addMapping(code, callback) {
        this.keyMap.set(code, callback);
    }

    handleEvent(event) {
        // La línea de código const {code} = event; extrae el valor de la propiedad code del objeto event y lo asigna a una nueva variable llamada code
        const { code } = event;

        if (!this.keyMap.has(code)) {
            // Did not have key mapped. Return undefined
            return;
        }

        event.preventDefault();

        const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

        if (this.keyStates.get(code) === keyState) {
            return;
        }

        this.keyStates.set(code, keyState);
        // console.log(this.keyStates);

        // Llamamos a una función almacenada en el mapa this.keyMap, utilizando la clave code para buscar la función y pasándole keyState como argumento.
        this.keyMap.get(code)(keyState);
    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            });
        });
    }
}