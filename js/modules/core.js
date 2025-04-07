// core.js - Funciones principales y gestión del estado global

// Variables globales para el estado de la aplicación
const EMPA = (function() {
    // Estado privado
    let isInitialized = false;
    let formularioData = {};
    let resultadoFinal = 0;
    let selectedAreas = [];
    let anatomyAreas = [];
    let currentHoveredArea = null;
    
    // Referencias DOM principales
    const elements = {
        formulario: null,
        btnCalcular: null,
        btnReiniciar: null,
        btnPDF: null,
        resultadoDiv: null
    };

    // Función privada para verificar si el DOM está listo
    function isDOMReady() {
        return document.readyState === 'complete' || document.readyState === 'interactive';
    }

    // Función privada para inicializar elementos DOM
    function initializeElements() {
        elements.formulario = document.getElementById('empa-cela-form');
        elements.btnCalcular = document.getElementById('calculate-btn');
        elements.btnReiniciar = document.getElementById('reset-btn');
        elements.btnPDF = document.getElementById('pdf-btn');
        elements.resultadoDiv = document.getElementById('result');
        
        if (!elements.formulario) {
            console.warn('No se encontró el formulario principal');
        }
    }

    // API pública
    return {
        // Inicializa la aplicación
        init: function() {
            if (isInitialized) {
                console.warn('El módulo EMPA ya está inicializado');
                return;
            }

            console.log('Inicializando módulo principal EMPA...');
            
            try {
                // Inicializar elementos DOM
                initializeElements();
                
                // Configurar listeners
                this.setupEventListeners();
                
                isInitialized = true;
                console.log('Módulo principal EMPA inicializado correctamente');
            } catch (error) {
                console.error('Error al inicializar módulo EMPA:', error);
                throw error;
            }
        },

        setupEventListeners: function() {
            if (!isDOMReady()) {
                console.warn('El DOM no está listo para configurar los event listeners');
                return;
            }

            // Event listeners para botones principales
            if (elements.btnCalcular) {
                elements.btnCalcular.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.mostrarResultado();
                });
            }
            
            if (elements.btnReiniciar) {
                elements.btnReiniciar.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.reiniciarFormulario();
                });
            }
            
            if (elements.btnPDF) {
                elements.btnPDF.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (typeof EMPA_PDF !== 'undefined') {
                        EMPA_PDF.generateReport();
                    }
                });
            }
            
            // Agregar oyentes de eventos a todos los radio buttons
            const radioButtons = document.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(button => {
                button.addEventListener('change', () => this.updateProgressBar());
            });
        },

        // Inicializar módulos de la aplicación
        initModules: function() {
            // Actualizar barra de progreso inicial
            this.updateProgressBar();
            
            // Inicializar módulo de anatomía
            if (typeof EMPA_ANATOMY !== 'undefined') {
                EMPA_ANATOMY.init();
            }
            
            // Inicializar módulo respiratorio
            if (typeof EMPA_RESPIRATORY !== 'undefined') {
                EMPA_RESPIRATORY.initialize();
            }
        },
        
        // Función para actualizar la barra de progreso
        updateProgressBar: function() {
            const radioGroups = [
                'movilidad_funcional', 'movilidad_fina', 'resistencia_fatiga',
                'habla_comunicacion', 'dispositivo_comunicacion',
                'atencion_concentracion', 'memoria', 'lenguaje_fluidez',
                'apoyo_familiar', 'situacion_economica', 'ayudas_estatales',
                'comorbilidades', 'supervision', 'aceptacion_cuidados'
            ];
            
            let completedGroups = 0;
            
            radioGroups.forEach(group => {
                const groupElements = document.getElementsByName(group);
                for (let i = 0; i < groupElements.length; i++) {
                    if (groupElements[i].checked && groupElements[i].value !== '') {
                        completedGroups++;
                        break;
                    }
                }
            });
            
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                const progressPercentage = (completedGroups / radioGroups.length) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            }
        },
        
        // Función para calcular la puntuación total
        calcularPuntuacion: function() {
            this.resultadoFinal = 0;
            
            // Recopilar todos los valores seleccionados
            const radioSeleccionados = document.querySelectorAll('input[type="radio"]:checked');
            
            radioSeleccionados.forEach(radio => {
                const valor = parseInt(radio.value, 10);
                if (!isNaN(valor)) {
                    this.resultadoFinal += valor;
                    this.formularioData[radio.name] = valor;
                }
            });
            
            return this.resultadoFinal;
        },
        
        // Función para mostrar el resultado
        mostrarResultado: function() {
            const puntuacion = this.calcularPuntuacion();
            
            if (elements.resultadoDiv) {
                elements.resultadoDiv.style.display = 'block';
                elements.resultadoDiv.innerHTML = `
                    <div class="result-header">Resultado de la Evaluación</div>
                    <p>Puntuación total: <strong>${puntuacion}</strong></p>
                    <p>Fecha y hora: ${new Date().toLocaleString()}</p>
                `;
            }
        },
        
        // Función para reiniciar el formulario
        reiniciarFormulario: function() {
            if (elements.formulario) {
                elements.formulario.reset();
            }
            if (elements.resultadoDiv) {
                elements.resultadoDiv.style.display = 'none';
            }
            this.formularioData = {};
            this.resultadoFinal = 0;
            this.updateProgressBar();
            window.scrollTo(0, 0);
        }
    };
})();

// Inicializar cuando el DOM esté cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        EMPA.init();
    });
} else {
    EMPA.init();
} 