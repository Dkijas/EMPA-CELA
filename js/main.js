// main.js - Archivo principal para la aplicación EMPA-CELA

// Cargar los módulos JS cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando aplicación EMPA-CELA...');
    
    // Inicializar la aplicación
    initApp();
});

// Función para inicializar la aplicación
function initApp() {
    // Verificar que todos los módulos estén cargados
    if (typeof EMPA === 'undefined') {
        console.error('Módulo principal (core.js) no encontrado');
        showErrorMessage('No se ha podido cargar el módulo principal');
        return;
    }
    
    // Inicializar módulos
    try {
        // Iniciar el módulo principal
        EMPA.init();
        
        console.log('Aplicación EMPA-CELA iniciada correctamente');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showErrorMessage('Ha ocurrido un error al iniciar la aplicación');
    }
}

// Función para mostrar mensajes de error
function showErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.innerHTML = `
        <div class="error-content">
            <h3>Error en la aplicación</h3>
            <p>${message}</p>
            <p>Por favor, recargue la página o contacte con soporte técnico.</p>
        </div>
    `;
    
    document.body.appendChild(errorContainer);
}

// Establecer handlers globales de errores
window.addEventListener('error', function(event) {
    console.error('Error en la aplicación:', event.error);
    // Evitar mostrar múltiples mensajes de error
    if (!document.querySelector('.error-message')) {
        showErrorMessage('Ha ocurrido un error inesperado');
    }
}); 