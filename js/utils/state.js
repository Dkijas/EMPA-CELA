// Sistema de gestión de estado centralizado
const StateManager = (function() {
    // Estado inicial de la aplicación
    const initialState = {
        anatomy: {
            selectedAreas: [],
            currentArea: null,
            progression: []
        },
        respiratory: {
            measurements: [],
            devices: []
        },
        pdf: {
            template: null,
            data: null
        }
    };

    let state = JSON.parse(JSON.stringify(initialState));
    const subscribers = new Map();

    return {
        // Obtener el estado actual
        getState(module) {
            return module ? {...state[module]} : {...state};
        },

        // Actualizar el estado
        setState(module, newData) {
            if (!state[module]) {
                console.error(`Módulo "${module}" no encontrado en el estado`);
                return;
            }

            state[module] = {
                ...state[module],
                ...newData
            };

            // Notificar a los suscriptores
            this.notify(module);
        },

        // Suscribirse a cambios
        subscribe(module, callback) {
            if (!subscribers.has(module)) {
                subscribers.set(module, new Set());
            }
            subscribers.get(module).add(callback);

            // Retornar función para desuscribirse
            return () => {
                const moduleSubscribers = subscribers.get(module);
                if (moduleSubscribers) {
                    moduleSubscribers.delete(callback);
                }
            };
        },

        // Notificar a los suscriptores
        notify(module) {
            const moduleSubscribers = subscribers.get(module);
            if (moduleSubscribers) {
                moduleSubscribers.forEach(callback => {
                    callback(this.getState(module));
                });
            }
        },

        // Resetear el estado
        resetState(module) {
            if (module) {
                state[module] = JSON.parse(JSON.stringify(initialState[module]));
                this.notify(module);
            } else {
                state = JSON.parse(JSON.stringify(initialState));
                subscribers.forEach((_, module) => this.notify(module));
            }
        }
    };
})();

// Exportar el StateManager
window.StateManager = StateManager; 