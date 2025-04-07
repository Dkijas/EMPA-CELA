// main.js - Archivo principal para la aplicación EMPA-CELA

// Variable para controlar si ya se ha inicializado
let isInitialized = false;

// Cargar los módulos JS cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (isInitialized) return;
    isInitialized = true;
    
    console.log('Iniciando aplicación EMPA-CELA...');
    
    try {
        // Asegurarse de que los módulos principales estén disponibles
        if (typeof EMPA === 'undefined') {
            throw new Error('El módulo principal (EMPA) no está disponible');
        }

        // Inicializar módulos en orden específico
        initializeModules();
        
        // Configurar manejo de tabs
        setupTabs();
        
        // Configurar botones de interacción global
        setupGlobalButtons();
        
        console.log('Aplicación EMPA-CELA iniciada correctamente');
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        showErrorMessage('Ha ocurrido un error al iniciar la aplicación: ' + error.message);
    }
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
                } else if (targetTab === 'respiratorio-tab') {
                    console.log('Tab de soporte respiratorio seleccionado - activando módulo');
                    if (typeof EMPA_RESPIRATORY !== 'undefined') {
                        // Asegurar que el botón de gráfico esté presente
                        if (!document.getElementById('generar-grafico-btn')) {
                            EMPA_RESPIRATORY.addChartButton();
                        }
                        // Forzar la evaluación de parámetros
                        EMPA_RESPIRATORY.forceEvaluation();
                    }
                }
            }
        });
    });
}

// Configurar botones de interacción global
function setupGlobalButtons() {
    // Botón para calcular puntuación
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculateScore();
        });
    }
    
    // Botón para resetear formulario
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetForm();
        });
    }
    
    // Botones para generar PDF
    const pdfBtn = document.getElementById('pdf-btn');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            generatePDF();
        });
    }
    
    const simplePdfBtn = document.getElementById('simple-pdf-btn');
    if (simplePdfBtn) {
        simplePdfBtn.addEventListener('click', function() {
            generateSimplePDF();
        });
    }
}

/**
 * Inicializa todos los módulos disponibles
 */
function initializeModules() {
    console.log('Inicializando módulos EMPA-CELA...');
    
    try {
        // 1. Inicializar módulo principal primero
        EMPA.init();
        console.log('Módulo principal EMPA inicializado');
        
        // 2. Inicializar módulos secundarios
        const modules = [
            { name: 'EMPA_ANATOMY', init: () => EMPA_ANATOMY.init() },
            { name: 'EMPA_CALCULATION', init: () => EMPA_CALCULATION.init() },
            { name: 'EMPA_PDF', init: () => EMPA_PDF.init() },
            { name: 'EMPA_RESPIRATORY', init: () => EMPA_RESPIRATORY.initialize() }
        ];
        
        modules.forEach(module => {
            try {
                if (typeof window[module.name] !== 'undefined') {
                    module.init();
                    console.log(`Módulo ${module.name} inicializado correctamente`);
                } else {
                    console.warn(`Módulo ${module.name} no disponible`);
                }
            } catch (moduleError) {
                console.error(`Error al inicializar ${module.name}:`, moduleError);
            }
        });
        
    } catch (error) {
        console.error('Error al inicializar módulos:', error);
        throw error; // Propagar el error para manejarlo en el nivel superior
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

// Función global para calcular la puntuación
function calculateScore() {
    console.log('Calculando puntuación EMPA-CELA...');
    
    if (typeof EMPA_CALCULATION === 'undefined') {
        console.error('El módulo de cálculo no está disponible');
        alert('No se puede calcular la puntuación porque el módulo de cálculo no está disponible');
        return;
    }
    
    try {
        // Obtener los resultados del cálculo
        const resultData = EMPA_CALCULATION.calculateScore();
        console.log('Resultado del cálculo:', resultData);
        
        // Mostrar el resultado
        const resultContainer = document.getElementById('result');
        if (resultContainer) {
            // Mostrar puntuación total
            const scoreDisplay = document.getElementById('score-display');
            if (scoreDisplay) {
                scoreDisplay.innerHTML = `<p>Puntuación total: <strong>${resultData.total}</strong></p>`;
            }
            
            // Mostrar nivel de prioridad
            const priorityDisplay = document.getElementById('priority-display');
            if (priorityDisplay) {
                priorityDisplay.textContent = resultData.priority.text;
                priorityDisplay.className = 'priority ' + resultData.priority.class;
            }
            
            // Mostrar recomendaciones
            const recommendationsDisplay = document.getElementById('recommendations');
            if (recommendationsDisplay && resultData.recommendations && resultData.recommendations.length > 0) {
                let recommendationsHTML = '<h3>Recomendaciones</h3><ul>';
                resultData.recommendations.forEach(rec => {
                    recommendationsHTML += `<li>${rec}</li>`;
                });
                recommendationsHTML += '</ul>';
                recommendationsDisplay.innerHTML = recommendationsHTML;
            }
            
            // Mostrar el contenedor de resultado
            resultContainer.style.display = 'block';
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('No se encontró el contenedor de resultados');
        }
    } catch (error) {
        console.error('Error al calcular puntuación:', error);
        alert('Ha ocurrido un error al calcular la puntuación: ' + error.message);
    }
}

// Función global para generar PDF
function generatePDF() {
    console.log('Generando PDF completo...');
    
    if (typeof EMPA_PDF === 'undefined') {
        console.error('El módulo de PDF no está disponible');
        alert('No se puede generar el PDF porque el módulo necesario no está disponible');
        return;
    }
    
    try {
        // Primero calcular la puntuación para asegurar que tenemos datos actualizados
        const resultData = EMPA_CALCULATION.calculateScore();
        
        // Generar el PDF completo con todos los datos
        const success = EMPA_PDF.generateReport();
        
        if (success) {
            console.log('PDF generado correctamente');
        } else {
            console.error('Error al generar el PDF');
        }
    } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Ha ocurrido un error al generar el PDF: ' + error.message);
    }
}

// Función global para generar PDF simplificado
function generateSimplePDF() {
    console.log('Generando PDF simplificado...');
    
    if (typeof EMPA_PDF === 'undefined') {
        console.error('El módulo de PDF no está disponible');
        alert('No se puede generar el PDF porque el módulo necesario no está disponible');
        return;
    }
    
    try {
        // Primero calcular la puntuación para asegurar que tenemos datos actualizados
        const resultData = EMPA_CALCULATION.calculateScore();
        
        // Generar el PDF simplificado (sólo con datos básicos y la puntuación)
        const success = EMPA_PDF.generateSimpleReport();
        
        if (success) {
            console.log('PDF simplificado generado correctamente');
        } else {
            console.error('Error al generar el PDF simplificado');
        }
    } catch (error) {
        console.error('Error al generar PDF simplificado:', error);
        alert('Ha ocurrido un error al generar el PDF simplificado: ' + error.message);
    }
}

// Función global para resetear formulario
function resetForm() {
    console.log('Reseteando formulario...');
    
    try {
        // Resetear radio buttons
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            // Seleccionar solo el primero de cada grupo (valor 0)
            if (radio.value === '0') {
                radio.checked = true;
            } else {
                radio.checked = false;
            }
        });
        
        // Ocultar el resultado
        const resultContainer = document.getElementById('result');
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }
        
        // Scroll al inicio del formulario
        window.scrollTo(0, 0);
        
        console.log('Formulario reseteado correctamente');
    } catch (error) {
        console.error('Error al resetear formulario:', error);
        alert('Ha ocurrido un error al resetear el formulario: ' + error.message);
    }
} 