// calculation.js - Funciones para el cálculo de puntuaciones y resultados

const EMPA_CALCULATION = {
    // Inicializa el módulo de cálculo
    init: function() {
        console.log('Inicializando módulo de cálculo...');
        
        // Cualquier inicialización específica para el módulo de cálculo
        console.log('Módulo de cálculo inicializado correctamente');
    },

    // Función para calcular el puntaje de la escala EMPA-CELA
    calculateScore: function() {
        const groups = [
            "movilidad_funcional", "movilidad_fina", "resistencia_fatiga",
            "habla_comunicacion", "dispositivo_comunicacion",
            "atencion_concentracion", "memoria", "lenguaje_fluidez",
            "apoyo_familiar", "situacion_economica", "ayudas_estatales",
            "comorbilidades", "supervision", "aceptacion_cuidados"
        ];
        
        let total = 0;
        let selections = {};
        
        groups.forEach(group => {
            const radios = document.getElementsByName(group);
            for (let radio of radios) {
                if (radio.checked) {
                    const value = parseInt(radio.value);
                    total += value;
                    selections[group] = {
                        value: value,
                        text: radio.parentNode.textContent.trim()
                    };
                    break;
                }
            }
        });
        
        return {
            total: total,
            selections: selections,
            priority: this.determinePriority(total),
            recommendations: this.getRecommendations(total)
        };
    },
    
    // Determinar prioridad en base al puntaje total
    determinePriority: function(total) {
        if (total >= 15 && total <= 37) {
            return {
                level: 1,
                text: "Prioridad 1: Cuidados paliativos intensivos",
                class: "priority-1"
            };
        } else if (total >= 11 && total <= 14) {
            return {
                level: 2,
                text: "Prioridad 2: Atención intensiva especializada",
                class: "priority-2"
            };
        } else if (total >= 7 && total <= 10) {
            return {
                level: 3,
                text: "Prioridad 3: Atención intermedia",
                class: "priority-3"
            };
        } else if (total >= 4 && total <= 6) {
            return {
                level: 4,
                text: "Prioridad 4: Atención preventiva",
                class: "priority-4"
            };
        } else {
            return {
                level: 5,
                text: "Prioridad 5: Seguimiento general",
                class: "priority-5"
            };
        }
    },
    
    // Obtener recomendaciones basadas en el puntaje total
    getRecommendations: function(total) {
        if (total >= 15 && total <= 37) {
            return [
                "Seguimiento médico frecuente (cada 1-2 semanas)",
                "Evaluación para ventilación mecánica o asistida si es apropiado",
                "Soporte nutricional especializado",
                "Apoyo psicológico intensivo para paciente y familia",
                "Coordinar con trabajo social para maximizar ayudas disponibles"
            ];
        } else if (total >= 11 && total <= 14) {
            return [
                "Seguimiento médico cada 2-3 semanas",
                "Evaluación por equipo multidisciplinar completo",
                "Ajuste de terapias físicas y respiratorias",
                "Considerar opciones de comunicación aumentativa/alternativa",
                "Planificación anticipada de cuidados"
            ];
        } else if (total >= 7 && total <= 10) {
            return [
                "Seguimiento médico mensual",
                "Terapia física y ocupacional regular",
                "Revisión de adaptaciones para el hogar y ayudas técnicas",
                "Entrenamiento a cuidadores para prevenir complicaciones",
                "Evaluación de necesidades sociales y económicas"
            ];
        } else if (total >= 4 && total <= 6) {
            return [
                "Seguimiento médico cada 2-3 meses",
                "Educación preventiva al paciente y familia",
                "Inicio de adaptaciones tempranas en el hogar",
                "Asesoramiento sobre recursos comunitarios disponibles",
                "Evaluación nutricional y programa de ejercicios personalizado"
            ];
        } else {
            return [
                "Seguimiento médico semestral",
                "Monitorización de síntomas iniciales",
                "Educación sobre la enfermedad y posible progresión",
                "Exploración de opciones de soporte comunitario",
                "Evaluación del entorno de vida para futuras adaptaciones"
            ];
        }
    },
    
    // Generar HTML del resultado para mostrar
    generateResultHTML: function(resultData) {
        const { total, priority, recommendations } = resultData;
        
        // HTML para las recomendaciones
        let recommendationsHTML = '';
        if (recommendations && recommendations.length > 0) {
            recommendationsHTML = `
                <div class="recommendations-section">
                    <h3>Recomendaciones</h3>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // HTML para el resultado completo
        return `
            <div class="result fade-in">
                <div class="result-header">Resultado de la Evaluación</div>
                <p>Puntuación total: <strong>${total}</strong></p>
                <div class="priority ${priority.class}">${priority.text}</div>
                <p>Fecha y hora: ${new Date().toLocaleString()}</p>
                ${recommendationsHTML}
            </div>
        `;
    },
    
    // Generar PDF del resultado (funcionalidad básica)
    generatePDF: function(resultData) {
        // Aquí se implementaría la generación de PDF
        // Usando alguna biblioteca como jsPDF o similar
        alert('Funcionalidad de PDF en desarrollo');
    }
}; 