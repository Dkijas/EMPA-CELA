// Sistema de eventos centralizado
const EventBus = (function() {
    const events = new Map();
    
    return {
        // Suscribirse a un evento
        on(eventName, callback) {
            if (!events.has(eventName)) {
                events.set(eventName, new Set());
            }
            events.get(eventName).add(callback);
            
            // Retornar función para desuscribirse
            return () => {
                const eventCallbacks = events.get(eventName);
                if (eventCallbacks) {
                    eventCallbacks.delete(callback);
                }
            };
        },
        
        // Emitir un evento
        emit(eventName, data) {
            const eventCallbacks = events.get(eventName);
            if (eventCallbacks) {
                eventCallbacks.forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(`Error en el manejador del evento "${eventName}":`, error);
                    }
                });
            }
        },
        
        // Eliminar todos los manejadores de un evento
        off(eventName) {
            if (eventName) {
                events.delete(eventName);
            } else {
                events.clear();
            }
        },
        
        // Obtener la lista de eventos registrados
        getRegisteredEvents() {
            return Array.from(events.keys());
        }
    };
})();

// Exportar el EventBus
window.EventBus = EventBus; 