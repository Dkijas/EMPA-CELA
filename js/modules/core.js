// core.js - Funciones principales y gestión del estado global

// Variables globales para el estado de la aplicación
const EMPA = {
    // Datos del formulario
    formularioData: {},
    resultadoFinal: 0,
    
    // Estado de la anatomía
    selectedAreas: [],
    anatomyAreas: [],
    currentHoveredArea: null,
    
    // Referencias DOM principales
    elements: {
        formulario: null,
        btnCalcular: null,
        btnReiniciar: null,
        btnImprimir: null,
        resultadoDiv: null
    },

    // Inicializa la aplicación
    init: function() {
        console.log('Inicializando aplicación EMPA-CELA...');
        
        // Obtener referencias a elementos DOM
        this.elements.formulario = document.getElementById('escala-form');
        this.elements.btnCalcular = document.getElementById('btn-calcular');
        this.elements.btnReiniciar = document.getElementById('btn-reiniciar');
        this.elements.btnImprimir = document.getElementById('btn-imprimir');
        this.elements.resultadoDiv = document.getElementById('resultado');
        
        // Configuración de fecha actual
        this.setupCurrentDate();
        
        // Configurar listeners
        this.setupEventListeners();
        
        // Inicializar módulos
        this.initModules();
        
        console.log('Aplicación EMPA-CELA inicializada correctamente');
    },
    
    // Configurar fecha actual en el campo de evaluación
    setupCurrentDate: function() {
        const today = new Date();
        const formattedDate = today.toISOString().substr(0, 10);
        document.getElementById('fecha_evaluacion').value = formattedDate;
    },
    
    // Configurar todos los event listeners
    setupEventListeners: function() {
        // Event listeners para botones principales
        if (this.elements.btnCalcular) {
            this.elements.btnCalcular.addEventListener('click', function(e) {
                e.preventDefault();
                EMPA.mostrarResultado();
            });
        }
        
        if (this.elements.btnReiniciar) {
            this.elements.btnReiniciar.addEventListener('click', function(e) {
                e.preventDefault();
                EMPA.reiniciarFormulario();
            });
        }
        
        if (this.elements.btnImprimir) {
            this.elements.btnImprimir.addEventListener('click', function(e) {
                e.preventDefault();
                EMPA.imprimirResultados();
            });
        }
        
        // Agregar oyentes de eventos a todos los radio buttons para actualizar la barra de progreso
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(button => {
            button.addEventListener('change', EMPA.updateProgressBar);
        });
        
        // Inicializar tooltips
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('mouseenter', function() {
                this.querySelector('.tooltip-text').style.visibility = 'visible';
                this.querySelector('.tooltip-text').style.opacity = '1';
            });
            
            tooltip.addEventListener('mouseleave', function() {
                this.querySelector('.tooltip-text').style.visibility = 'hidden';
                this.querySelector('.tooltip-text').style.opacity = '0';
            });
        });
    },
    
    // Inicializar módulos de la aplicación
    initModules: function() {
        // Actualizar barra de progreso inicial
        this.updateProgressBar();
        
        // Inicializar pestañas
        if (typeof EMPA_TABS !== 'undefined') {
            EMPA_TABS.init();
        }
        
        // Inicializar módulo de anatomía
        if (typeof EMPA_ANATOMY !== 'undefined') {
            EMPA_ANATOMY.init();
        }
        
        // Inicializar módulo de progresión
        if (typeof EMPA_PROGRESSION !== 'undefined') {
            EMPA_PROGRESSION.init();
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
        
        const progressPercentage = (completedGroups / radioGroups.length) * 100;
        document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
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
    
    // Función para determinar la prioridad basada en la puntuación
    determinarPrioridad: function(puntuacion) {
        if (puntuacion <= 5) return { nivel: 1, texto: "Prioridad 1 - Emergencia" };
        if (puntuacion <= 10) return { nivel: 2, texto: "Prioridad 2 - Muy Urgente" };
        if (puntuacion <= 15) return { nivel: 3, texto: "Prioridad 3 - Urgente" };
        if (puntuacion <= 20) return { nivel: 4, texto: "Prioridad 4 - Normal" };
        return { nivel: 5, texto: "Prioridad 5 - No Urgente" };
    },
    
    // Función para mostrar el resultado
    mostrarResultado: function() {
        const puntuacion = this.calcularPuntuacion();
        const prioridad = this.determinarPrioridad(puntuacion);
        
        let resultadoHTML = `
            <div class="result fade-in">
                <div class="result-header">Resultado de la Evaluación</div>
                <p>Puntuación total: <strong>${puntuacion}</strong></p>
                <div class="priority priority-${prioridad.nivel}">${prioridad.texto}</div>
                <p>Fecha y hora: ${new Date().toLocaleString()}</p>
            </div>
        `;
        
        this.elements.resultadoDiv.innerHTML = resultadoHTML;
        this.elements.resultadoDiv.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Función para reiniciar el formulario
    reiniciarFormulario: function() {
        this.elements.formulario.reset();
        this.elements.resultadoDiv.innerHTML = '';
        this.formularioData = {};
        this.resultadoFinal = 0;
        window.scrollTo(0, 0);
    },
    
    // Función para imprimir los resultados
    imprimirResultados: function() {
        window.print();
    }
};

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    EMPA.init();
}); 