// tabs.js - Sistema de pestañas para la aplicación

const EMPA_TABS = {
    // Almacena las referencias a los elementos del DOM
    elements: {
        tabButtons: null,
        tabPanes: null
    },
    
    // Inicializa el módulo de pestañas
    init: function() {
        console.log('Inicializando módulo de pestañas...');
        
        // Obtener todos los botones de las pestañas
        this.elements.tabButtons = document.querySelectorAll('.tab-btn');
        this.elements.tabPanes = document.querySelectorAll('.tab-pane');
        
        // Configurar event listeners
        this.setupTabEventListeners();
        
        console.log('Módulo de pestañas inicializado correctamente');
    },
    
    // Configurar event listeners para las pestañas
    setupTabEventListeners: function() {
        const self = this;
        
        // Agregar event listeners a botones de pestañas
        this.elements.tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                self.changeTab(tabId);
            });
        });
    },
    
    // Cambiar la pestaña activa
    changeTab: function(tabId) {
        console.log(`Cambiando a la pestaña: ${tabId}`);
        
        // Desactivar todas las pestañas
        this.elements.tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        this.elements.tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Activar la pestaña seleccionada
        const selectedButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        const selectedPane = document.getElementById(tabId);
        
        console.log(`Encontrado botón: ${selectedButton ? 'Sí' : 'No'}, panel: ${selectedPane ? 'Sí' : 'No'}`);
        
        if (selectedButton && selectedPane) {
            selectedButton.classList.add('active');
            selectedPane.classList.add('active');
            
            console.log(`Activada pestaña: ${tabId}`);
            
            // Notificar el cambio de pestaña a otros módulos
            this.notifyTabChange(tabId);
        } else {
            console.error(`No se encontró la pestaña con ID: ${tabId}`);
        }
    },
    
    // Notificar a otros módulos que la pestaña ha cambiado
    notifyTabChange: function(tabId) {
        // Si se cambia a la pestaña de anatomía, inicializar/actualizar esa vista
        if (tabId === 'anatomia-tab' && typeof EMPA_ANATOMY !== 'undefined') {
            console.log('Notificando a EMPA_ANATOMY sobre cambio de pestaña a anatomía');
            EMPA_ANATOMY.onTabActivated();
        }
        
        // Otras notificaciones según sea necesario para diferentes pestañas
        // ...
    }
}; 