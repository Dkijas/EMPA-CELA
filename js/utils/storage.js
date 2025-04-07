// Sistema de almacenamiento centralizado
const StorageManager = (function() {
    const PREFIX = 'EMPA_CELA_';
    
    // Función auxiliar para manejar errores de localStorage
    function handleStorageError(action, key, error) {
        console.error(`Error al ${action} datos para "${key}":`, error);
        EventBus.emit('storage:error', { action, key, error });
        return null;
    }
    
    return {
        // Guardar datos
        save(key, data) {
            try {
                const serializedData = JSON.stringify(data);
                localStorage.setItem(PREFIX + key, serializedData);
                EventBus.emit('storage:saved', { key, data });
                return true;
            } catch (error) {
                return handleStorageError('guardar', key, error);
            }
        },
        
        // Cargar datos
        load(key) {
            try {
                const serializedData = localStorage.getItem(PREFIX + key);
                if (serializedData === null) {
                    return null;
                }
                const data = JSON.parse(serializedData);
                EventBus.emit('storage:loaded', { key, data });
                return data;
            } catch (error) {
                return handleStorageError('cargar', key, error);
            }
        },
        
        // Eliminar datos
        remove(key) {
            try {
                localStorage.removeItem(PREFIX + key);
                EventBus.emit('storage:removed', { key });
                return true;
            } catch (error) {
                return handleStorageError('eliminar', key, error);
            }
        },
        
        // Limpiar todos los datos de la aplicación
        clear() {
            try {
                Object.keys(localStorage)
                    .filter(key => key.startsWith(PREFIX))
                    .forEach(key => localStorage.removeItem(key));
                EventBus.emit('storage:cleared');
                return true;
            } catch (error) {
                return handleStorageError('limpiar', 'all', error);
            }
        },
        
        // Obtener todas las claves almacenadas
        getKeys() {
            try {
                return Object.keys(localStorage)
                    .filter(key => key.startsWith(PREFIX))
                    .map(key => key.replace(PREFIX, ''));
            } catch (error) {
                return handleStorageError('obtener claves', 'all', error);
            }
        }
    };
})();

// Exportar el StorageManager
window.StorageManager = StorageManager; 