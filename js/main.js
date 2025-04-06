// main.js - Archivo principal para la aplicación EMPA-CELA

// Cargar los módulos JS cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando aplicación EMPA-CELA...');
    
    // Inicializar la aplicación
    initApp();
    
    // Configurar manejo de tabs
    setupTabs();
    
    // Inicializar módulos específicos
    initializeModules();
});

// Configurar el sistema de pestañas
function setupTabs() {
    // Seleccionar todos los botones de pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Agregar event listeners a cada botón
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Obtener el tab objetivo
            const targetTab = this.getAttribute('data-tab');
            
            // Desactivar todos los botones y pestañas
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Activar el botón y pestaña seleccionados
            this.classList.add('active');
            const tabPane = document.getElementById(targetTab);
            if (tabPane) {
                tabPane.classList.add('active');
                
                // Disparar evento específico según la pestaña activada
                if (targetTab === 'anatomia-tab') {
                    console.log('Tab de anatomía seleccionado - activando módulo');
                    if (typeof EMPA_ANATOMY !== 'undefined' && EMPA_ANATOMY.onTabActivated) {
                        EMPA_ANATOMY.onTabActivated();
                        
                        // También actualizar la progresión cuando se muestra la pestaña de anatomía
                        if (typeof EMPA_PROGRESSION !== 'undefined' && EMPA_PROGRESSION.getProgressionFromSelectedAreas) {
                            setTimeout(function() {
                                EMPA_PROGRESSION.getProgressionFromSelectedAreas();
                            }, 300);
                        }
                    }
                }
            }
        });
    });
}

// Inicializar módulos específicos
function initializeModules() {
    // Inicializar el módulo de anatomía
    if (typeof EMPA_ANATOMY !== 'undefined') {
        setTimeout(function() {
            console.log('Inicializando módulo de anatomía desde main.js...');
            EMPA_ANATOMY.init();
        }, 500);
    } else {
        console.error('El módulo de anatomía no está disponible');
    }
    
    // Inicializar el módulo de progresión
    if (typeof EMPA_PROGRESSION !== 'undefined') {
        setTimeout(function() {
            console.log('Inicializando módulo de progresión desde main.js...');
            EMPA_PROGRESSION.init();
        }, 600);
    } else {
        console.error('El módulo de progresión no está disponible');
    }
}

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