document.addEventListener('DOMContentLoaded', function() {
    // Variables para almacenar datos del formulario
    let formularioData = {};
    let resultadoFinal = 0;
    
    // Elementos DOM
    const formulario = document.getElementById('escala-form');
    const btnCalcular = document.getElementById('btn-calcular');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnImprimir = document.getElementById('btn-imprimir');
    const resultadoDiv = document.getElementById('resultado');
    
    // Configuración del sistema de pestañas
    setupTabs();
    
    // Establecer la fecha actual en el campo de fecha de evaluación al cargar
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    document.getElementById('fecha_evaluacion').value = formattedDate;
    
    // Agregar oyentes de eventos a todos los radio buttons para actualizar la barra de progreso
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', updateProgressBar);
    });
    
    updateProgressBar();
    
    // Configuración para la sección de Anatomía de Enfermedad
    setupAnatomySection();
    
    // Función para calcular la puntuación total
    function calcularPuntuacion() {
        resultadoFinal = 0;
        
        // Recopilar todos los valores seleccionados
        const radioSeleccionados = document.querySelectorAll('input[type="radio"]:checked');
        
        radioSeleccionados.forEach(radio => {
            const valor = parseInt(radio.value, 10);
            if (!isNaN(valor)) {
                resultadoFinal += valor;
                formularioData[radio.name] = valor;
            }
        });
        
        return resultadoFinal;
    }
    
    // Función para determinar la prioridad basada en la puntuación
    function determinarPrioridad(puntuacion) {
        if (puntuacion <= 5) return { nivel: 1, texto: "Prioridad 1 - Emergencia" };
        if (puntuacion <= 10) return { nivel: 2, texto: "Prioridad 2 - Muy Urgente" };
        if (puntuacion <= 15) return { nivel: 3, texto: "Prioridad 3 - Urgente" };
        if (puntuacion <= 20) return { nivel: 4, texto: "Prioridad 4 - Normal" };
        return { nivel: 5, texto: "Prioridad 5 - No Urgente" };
    }
    
    // Función para mostrar el resultado
    function mostrarResultado() {
        const puntuacion = calcularPuntuacion();
        const prioridad = determinarPrioridad(puntuacion);
        
        let resultadoHTML = `
            <div class="result fade-in">
                <div class="result-header">Resultado de la Evaluación</div>
                <p>Puntuación total: <strong>${puntuacion}</strong></p>
                <div class="priority priority-${prioridad.nivel}">${prioridad.texto}</div>
                <p>Fecha y hora: ${new Date().toLocaleString()}</p>
            </div>
        `;
        
        resultadoDiv.innerHTML = resultadoHTML;
        resultadoDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Función para reiniciar el formulario
    function reiniciarFormulario() {
        formulario.reset();
        resultadoDiv.innerHTML = '';
        formularioData = {};
        resultadoFinal = 0;
        window.scrollTo(0, 0);
    }
    
    // Función para imprimir los resultados
    function imprimirResultados() {
        window.print();
    }
    
    // Event listeners
    if (btnCalcular) {
        btnCalcular.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarResultado();
        });
    }
    
    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', function(e) {
            e.preventDefault();
            reiniciarFormulario();
        });
    }
    
    if (btnImprimir) {
        btnImprimir.addEventListener('click', function(e) {
            e.preventDefault();
            imprimirResultados();
        });
    }
    
    // Inicializar tooltips (si los hay)
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
});

// Función para calcular el puntaje
function calculateScore() {
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
    
    // Determinar prioridad en base al puntaje total
    let priority = "";
    let priorityClass = "";
    let recommendations = [];
    
    if (total >= 15 && total <= 37) {
        priority = "Prioridad 1: Cuidados paliativos intensivos";
        priorityClass = "priority-1";
        recommendations = [
            "Seguimiento médico frecuente (cada 1-2 semanas)",
            "Evaluación para ventilación mecánica o asistida si es apropiado",
            "Soporte nutricional especializado",
            "Apoyo psicológico intensivo para paciente y familia",
            "Coordinar con trabajo social para maximizar ayudas disponibles"
        ];
    } else if (total >= 11 && total <= 14) {
        priority = "Prioridad 2: Atención intensiva especializada";
        priorityClass = "priority-2";
        recommendations = [
            "Seguimiento médico cada 2-3 semanas",
            "Evaluación por equipo multidisciplinar completo",
            "Ajuste de terapias físicas y respiratorias",
            "Considerar opciones de comunicación aumentativa/alternativa",
            "Planificación anticipada de cuidados"
        ];
    } else if (total >= 7 && total <= 10) {
        priority = "Prioridad 3: Atención intermedia";
        priorityClass = "priority-3";
        recommendations = [
            "Seguimiento médico mensual",
            "Terapia física y ocupacional regular",
            "Revisión de adaptaciones para el hogar y ayudas técnicas",
            "Entrenamiento a cuidadores para prevenir complicaciones",
            "Evaluación de necesidades sociales y económicas"
        ];
    } else if (total >= 4 && total <= 6) {
        priority = "Prioridad 4: Atención preventiva";
        priorityClass = "priority-4";
        recommendations = [
            "Seguimiento médico cada 2-3 meses",
            "Educación preventiva al paciente y familia",
            "Inicio de adaptaciones tempranas en el hogar",
            "Asesoramiento sobre recursos comunitarios disponibles",
            "Evaluación nutricional y programa de ejercicios personalizado"
        ];
    } else if (total >= 0 && total <= 3) {
        priority = "Prioridad 5: Diagnóstico reciente y autonomía plena";
        priorityClass = "priority-5";
        recommendations = [
            "Seguimiento médico trimestral",
            "Valoración basal completa de funciones",
            "Información sobre asociaciones de pacientes y recursos",
            "Asesoramiento sobre planificación anticipada",
            "Inicio de programa de mantenimiento funcional"
        ];
    } else if (total > 37) {
        priority = "El puntaje excede el rango definido (0-37). Se considerará en la categoría de mayor prioridad.";
        priorityClass = "priority-1";
    }
    
    // Actualizar visualización de resultados
    const resultElement = document.getElementById('result');
    const scoreDisplay = document.getElementById('score-display');
    const priorityDisplay = document.getElementById('priority-display');
    const recommendationsElement = document.getElementById('recommendations');
    
    resultElement.style.display = 'block';
    scoreDisplay.textContent = `Puntaje Total: ${total} / 37`;
    priorityDisplay.textContent = priority;
    priorityDisplay.className = `priority ${priorityClass}`;
    
    // Mostrar recomendaciones
    let recommendationsHTML = '<div class="recommendations"><h3>Recomendaciones:</h3><ul>';
    recommendations.forEach(rec => {
        recommendationsHTML += `<li>${rec}</li>`;
    });
    recommendationsHTML += '</ul></div>';
    
    recommendationsElement.innerHTML = recommendationsHTML;
    
    // Desplazar a los resultados
    resultElement.scrollIntoView({ behavior: 'smooth' });
    
    // Retornar los datos para posible uso en otras funciones
    return {
        total: total,
        priority: priority,
        priorityClass: priorityClass,
        selections: selections,
        recommendations: recommendations
    };
}

// Función para actualizar la barra de progreso
function updateProgressBar() {
    const totalFields = 14; // Número total de grupos de radio buttons
    let completedFields = 0;
    
    const groups = [
        "movilidad_funcional", "movilidad_fina", "resistencia_fatiga",
        "habla_comunicacion", "dispositivo_comunicacion",
        "atencion_concentracion", "memoria", "lenguaje_fluidez",
        "apoyo_familiar", "situacion_economica", "ayudas_estatales",
        "comorbilidades", "supervision", "aceptacion_cuidados"
    ];
    
    groups.forEach(group => {
        const radios = document.getElementsByName(group);
        for (let radio of radios) {
            if (radio.checked && radio.value !== "default") {
                completedFields++;
                break;
            }
        }
    });
    
    const progressPercent = (completedFields / totalFields) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
}

// Función para restablecer el formulario
function resetForm() {
    document.getElementById('empa-cela-form').reset();
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('result').style.display = 'none';
    
    // Establecer la fecha actual
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    document.getElementById('fecha_evaluacion').value = formattedDate;
    
    // Marcar los valores predeterminados
    const groups = [
        "movilidad_funcional", "movilidad_fina", "resistencia_fatiga",
        "habla_comunicacion", "dispositivo_comunicacion",
        "atencion_concentracion", "memoria", "lenguaje_fluidez",
        "apoyo_familiar", "situacion_economica", "ayudas_estatales",
        "comorbilidades", "supervision", "aceptacion_cuidados"
    ];
    
    groups.forEach(group => {
        const radios = document.getElementsByName(group);
        radios[0].checked = true;
    });
    
    updateProgressBar();
}

// Función para generar PDF
function generatePDF() {
    try {
        // Primero, verificar si jsPDF está disponible
        if (typeof window.jspdf === 'undefined') {
            console.error('jsPDF no está cargado correctamente');
            alert('Error: No se pudo cargar la biblioteca para generar el PDF. Por favor, recargue la página e intente nuevamente.');
            return;
        }
        
        // Calcular el puntaje para asegurarnos de tener datos actualizados
        const scoreData = calculateScore();
        
        // Datos del paciente
        const nombre = document.getElementById('nombre_paciente').value || "No especificado";
        const id = document.getElementById('id_paciente').value || "No especificado";
        const fechaNacimiento = document.getElementById('fecha_nacimiento').value || "No especificada";
        const fechaEvaluacion = document.getElementById('fecha_evaluacion').value || "No especificada";
        const profesional = document.getElementById('profesional').value || "No especificado";
        const centro = document.getElementById('centro').value || "No especificado";
        const observaciones = document.getElementById('observaciones').value || "Sin observaciones";
        
        // Mensaje de estado para el usuario
        alert("Generando PDF, por favor espere...");
        
        // Crear el PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 15;
        
        // Formatear fechas
        let formattedFechaNacimiento = fechaNacimiento;
        let formattedFechaEvaluacion = fechaEvaluacion;
        
        if (fechaNacimiento) {
            const nacDate = new Date(fechaNacimiento);
            formattedFechaNacimiento = nacDate.toLocaleDateString('es-ES');
        }
        
        if (fechaEvaluacion) {
            const evalDate = new Date(fechaEvaluacion);
            formattedFechaEvaluacion = evalDate.toLocaleDateString('es-ES');
        }
        
        // Encabezado con fondo azul y título centrado
        doc.setFillColor(44, 122, 201);
        doc.rect(10, y - 5, pageWidth - 20, 15, 'F');
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("Resultados de la Escala EMPA-CELA", pageWidth / 2, y + 5, { align: "center" });
        y += 20;
        
        // Añadir aviso de exención de responsabilidad
        doc.setFillColor(248, 215, 218);
        doc.setDrawColor(245, 198, 203);
        doc.rect(10, y - 5, pageWidth - 20, 20, 'FD');
        doc.setFontSize(10);
        doc.setTextColor(114, 28, 36);
        doc.setFont("helvetica", "bold");
        doc.text("AVISO IMPORTANTE:", 15, y);
        doc.setFont("helvetica", "normal");
        const disclaimerText = "Esta escala no ha sido validada clínicamente. No se asume responsabilidad de ningún tipo por su uso. Los resultados son meramente orientativos y no deben utilizarse como única herramienta para tomar decisiones clínicas.";
        const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 30);
        doc.text(splitDisclaimer, 15, y + 5);
        y += 25;
        
        // Datos del paciente
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("DATOS DEL PACIENTE", 10, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        
        doc.setDrawColor(200, 200, 200);
        doc.line(10, y, pageWidth - 10, y);
        y += 5;
        
        const dataPaciente = [
            { label: "Nombre:", value: nombre },
            { label: "ID/NHC:", value: id },
            { label: "Fecha de nacimiento:", value: formattedFechaNacimiento },
            { label: "Fecha de evaluación:", value: formattedFechaEvaluacion },
            { label: "Profesional evaluador:", value: profesional },
            { label: "Centro sanitario:", value: centro }
        ];
        
        dataPaciente.forEach(item => {
            doc.setFont("helvetica", "bold");
            doc.text(item.label, 10, y);
            doc.setFont("helvetica", "normal");
            doc.text(item.value, 50, y);
            y += 5;
        });
        
        y += 5;
        
        // Caja resaltada para Puntaje Total y Prioridad
        doc.setFillColor(230, 230, 230);
        doc.rect(10, y, pageWidth - 20, 20, 'F');
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Puntaje Total: " + scoreData.total + " / 37", 15, y + 7);
        doc.text(scoreData.priority, 15, y + 15);
        y += 25;
        
        // Recomendaciones
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Recomendaciones:", 10, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        
        scoreData.recommendations.forEach(rec => {
            // Comprobar si necesitamos una nueva página
            if (y > doc.internal.pageSize.getHeight() - 20) {
                doc.addPage();
                y = 20;
            }
            doc.text("• " + rec, 15, y);
            y += 5;
        });
        
        y += 5;
        
        // Sección de Selecciones
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Detalle de la evaluación:", 10, y);
        y += 6;
        
        // Verificar si se necesita una nueva página
        if (y > doc.internal.pageSize.getHeight() - 100) {
            doc.addPage();
            y = 20;
        }
        
        // Mostrar selecciones por categorías
        const categoriasSelecciones = [
            { title: "1. Función motora", items: ["movilidad_funcional", "movilidad_fina", "resistencia_fatiga"] },
            { title: "2. Función bulbar", items: ["habla_comunicacion", "dispositivo_comunicacion"] },
            { title: "3. Función cognitiva y conductual", items: ["atencion_concentracion", "memoria", "lenguaje_fluidez"] },
            { title: "4. Apoyo y situación social", items: ["apoyo_familiar", "situacion_economica", "ayudas_estatales"] },
            { title: "5. Comorbilidades", items: ["comorbilidades"] },
            { title: "6. Supervisión de enfermería", items: ["supervision"] },
            { title: "7. Aceptación de cuidados", items: ["aceptacion_cuidados"] }
        ];
        
        // Mapeo de nombres técnicos a nombres legibles
        const nombresCampos = {
            "movilidad_funcional": "Movilidad funcional",
            "movilidad_fina": "Movilidad fina",
            "resistencia_fatiga": "Resistencia y fatiga",
            "habla_comunicacion": "Capacidad de habla y comunicación",
            "dispositivo_comunicacion": "Uso de dispositivos de comunicación",
            "atencion_concentracion": "Atención y concentración",
            "memoria": "Memoria",
            "lenguaje_fluidez": "Lenguaje y fluidez verbal",
            "apoyo_familiar": "Apoyo familiar y sobrecarga del cuidador",
            "situacion_economica": "Situación económica",
            "ayudas_estatales": "Acceso y tramitación de ayudas estatales",
            "comorbilidades": "Comorbilidades y estado general de salud",
            "supervision": "Supervisión de enfermería y cuidados",
            "aceptacion_cuidados": "Aceptación de cuidados y modalidad de atención"
        };
        
        doc.setFontSize(10);
        
        categoriasSelecciones.forEach(categoria => {
            // Verificar si se necesita una nueva página
            if (y > doc.internal.pageSize.getHeight() - 30) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFont("helvetica", "bold");
            doc.text(categoria.title, 10, y);
            y += 5;
            
            doc.setFont("helvetica", "normal");
            categoria.items.forEach(item => {
                if (scoreData.selections[item]) {
                    if (y > doc.internal.pageSize.getHeight() - 15) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(`${nombresCampos[item]}: ${scoreData.selections[item].text}`, 15, y);
                    y += 5;
                }
            });
            
            y += 2;
        });
        
        // Observaciones
        if (y > doc.internal.pageSize.getHeight() - 40) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Observaciones clínicas:", 10, y);
        y += 6;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        // Dividir observaciones en líneas si es muy largo
        const splitObservaciones = doc.splitTextToSize(observaciones, pageWidth - 30);
        doc.text(splitObservaciones, 15, y);
        
        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.text(`Página ${i} de ${pageCount} - Escala EMPA-CELA - Fecha: ${formattedFechaEvaluacion}`, pageWidth/2, pageHeight - 10, { align: "center" });
        }
        
        // Guardar el PDF
        const fileName = `EMPA-CELA_${nombre.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
        
        // Método alternativo de guardar en caso de problemas con el método original
        try {
            doc.save(fileName);
        } catch (e) {
            console.error("Error al guardar PDF con método save:", e);
            // Alternativa: abrir en nueva ventana
            window.open(URL.createObjectURL(doc.output('blob')));
        }
    } catch (error) {
        console.error("Error al generar PDF:", error);
        alert("Error al generar el PDF: " + error.message);
    }
}

// Método alternativo para generar PDF desde la visualización del resultado
function generateSimplePDF() {
    // Verificar si jsPDF y html2canvas están disponibles
    if (typeof window.jspdf === 'undefined' || typeof html2canvas === 'undefined') {
        alert('Error: No se pudieron cargar las bibliotecas necesarias para generar el PDF');
        return;
    }
    
    // Asegurarse de que el resultado esté visible
    const resultElement = document.getElementById('result');
    if (resultElement.style.display === 'none') {
        calculateScore(); // Esto hará visible el resultado
    }
    
    // Mostrar mensaje al usuario
    alert("Generando PDF simplificado, por favor espere...");
    
    // Capturar el contenido del resultado
    html2canvas(resultElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 40; // Aumentado para dejar espacio para el disclaimer
        
        // Título
        pdf.setFontSize(16);
        pdf.setTextColor(44, 122, 201);
        pdf.setFont("helvetica", "bold");
        pdf.text("Resultados Escala EMPA-CELA", pdfWidth/2, 20, {align: 'center'});
        
        // Añadir aviso de exención de responsabilidad
        pdf.setFillColor(248, 215, 218);
        pdf.setDrawColor(245, 198, 203);
        pdf.rect(10, 25, pdfWidth - 20, 10, 'FD');
        pdf.setFontSize(8);
        pdf.setTextColor(114, 28, 36);
        pdf.text("AVISO: Esta escala no ha sido validada clínicamente. No se asume responsabilidad de ningún tipo por su uso.", pdfWidth/2, 31, {align: 'center'});
        
        // Agregar la imagen del resultado
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        
        // Información del paciente
        const nombre = document.getElementById('nombre_paciente').value || "No especificado";
        
        // Pie de página
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Escala EMPA-CELA - Fecha: ${new Date().toLocaleDateString('es-ES')}`, pdfWidth/2, pdfHeight - 10, {align: 'center'});
        
        // Guardar el PDF
        try {
            pdf.save(`EMPA-CELA_Resultado_${new Date().toISOString().slice(0,10)}.pdf`);
        } catch (e) {
            console.error("Error al guardar PDF simplificado:", e);
            window.open(URL.createObjectURL(pdf.output('blob')));
        }
    });
}

// Funcionalidad para la sección de Anatomía de Enfermedad
function setupAnatomySection() {
    const anatomyImg = document.getElementById('anatomia-img');
    const anatomyOverlay = document.getElementById('anatomy-overlay');
    const selectedAreasList = document.getElementById('selected-areas-list');
    const severityLevel = document.getElementById('severity-level');
    const addAreaBtn = document.getElementById('add-area-btn');
    
    // Limpiar overlay para eliminar posibles marcadores previos
    if (anatomyOverlay) {
        anatomyOverlay.innerHTML = '';
    }
    
    // Áreas anatómicas predefinidas con sus coordenadas, refinadas según inervación, función y áreas específicas para ELA
    const anatomyAreas = [
        // Región bulbar - crítica en ELA
        { name: "Lengua", x: 50, y: 13, radius: 4, category: "bulbar" },
        { name: "Músculos faciales", x: 50, y: 10, radius: 8, category: "bulbar" },
        { name: "Músculos de la masticación", x: 46, y: 12, radius: 4, category: "bulbar" },
        { name: "Musculatura laríngea", x: 50, y: 20, radius: 3, category: "bulbar" },
        { name: "Musculatura faríngea (deglución)", x: 50, y: 22, radius: 3, category: "bulbar" },
        
        // Región cervical
        { name: "Flexores del cuello", x: 50, y: 25, radius: 5, category: "cervical" },
        { name: "Extensores del cuello", x: 50, y: 23, radius: 5, category: "cervical" },
        
        // Musculatura respiratoria - crítica en ELA
        { name: "Diafragma", x: 50, y: 37, radius: 8, category: "respiratoria" },
        { name: "Músculos intercostales", x: 50, y: 34, radius: 9, category: "respiratoria" },
        { name: "Músculos abdominales", x: 50, y: 45, radius: 8, category: "respiratoria" },
        
        // Miembros superiores - inervación C5-T1
        { name: "Deltoides (C5-C6)", x: 36, y: 28, radius: 5, category: "miembro_superior" },
        { name: "Deltoides (C5-C6)", x: 64, y: 28, radius: 5, category: "miembro_superior" },
        { name: "Bíceps braquial (C5-C6)", x: 30, y: 34, radius: 4, category: "miembro_superior" },
        { name: "Bíceps braquial (C5-C6)", x: 70, y: 34, radius: 4, category: "miembro_superior" },
        { name: "Tríceps (C6-C8)", x: 27, y: 36, radius: 4, category: "miembro_superior" },
        { name: "Tríceps (C6-C8)", x: 73, y: 36, radius: 4, category: "miembro_superior" },
        { name: "Flexores de muñeca (C6-C8)", x: 25, y: 45, radius: 3, category: "miembro_superior" },
        { name: "Flexores de muñeca (C6-C8)", x: 75, y: 45, radius: 3, category: "miembro_superior" },
        { name: "Extensores de muñeca (C6-C8)", x: 23, y: 43, radius: 3, category: "miembro_superior" },
        { name: "Extensores de muñeca (C6-C8)", x: 77, y: 43, radius: 3, category: "miembro_superior" },
        { name: "Intrínsecos de mano (C8-T1)", x: 20, y: 50, radius: 3, category: "miembro_superior" },
        { name: "Intrínsecos de mano (C8-T1)", x: 80, y: 50, radius: 3, category: "miembro_superior" },
        
        // Miembros inferiores - inervación L2-S1
        { name: "Iliopsoas (L1-L3)", x: 45, y: 55, radius: 5, category: "miembro_inferior" },
        { name: "Iliopsoas (L1-L3)", x: 55, y: 55, radius: 5, category: "miembro_inferior" },
        { name: "Cuádriceps (L2-L4)", x: 40, y: 65, radius: 6, category: "miembro_inferior" },
        { name: "Cuádriceps (L2-L4)", x: 60, y: 65, radius: 6, category: "miembro_inferior" },
        { name: "Isquiotibiales (L5-S1)", x: 42, y: 70, radius: 5, category: "miembro_inferior" },
        { name: "Isquiotibiales (L5-S1)", x: 58, y: 70, radius: 5, category: "miembro_inferior" },
        { name: "Tibial anterior (L4-L5)", x: 40, y: 85, radius: 4, category: "miembro_inferior" },
        { name: "Tibial anterior (L4-L5)", x: 60, y: 85, radius: 4, category: "miembro_inferior" },
        { name: "Peroneos (L5-S1)", x: 37, y: 85, radius: 3, category: "miembro_inferior" },
        { name: "Peroneos (L5-S1)", x: 63, y: 85, radius: 3, category: "miembro_inferior" },
        { name: "Gemelos (S1-S2)", x: 40, y: 88, radius: 4, category: "miembro_inferior" },
        { name: "Gemelos (S1-S2)", x: 60, y: 88, radius: 4, category: "miembro_inferior" },
        { name: "Intrínsecos del pie (S1-S2)", x: 40, y: 97, radius: 3, category: "miembro_inferior" },
        { name: "Intrínsecos del pie (S1-S2)", x: 60, y: 97, radius: 3, category: "miembro_inferior" }
    ];
    
    // Inicializar el array de áreas seleccionadas
    // Intenta cargar desde localStorage o inicializa como vacío si no hay datos
    let selectedAreas = loadSelectedAreas() || [];
    let currentHoveredArea = null;
    
    // Inicializar la lista de áreas seleccionadas
    updateSelectedAreasList();
    
    // Restaurar marcadores visuales para las áreas seleccionadas
    restoreMarkers();
    
    // Función para guardar áreas seleccionadas en localStorage
    function saveSelectedAreas() {
        try {
            localStorage.setItem('selectedAreas', JSON.stringify(selectedAreas));
            console.log("Áreas guardadas en localStorage:", selectedAreas.length);
        } catch (e) {
            console.error("Error al guardar en localStorage:", e);
        }
    }
    
    // Función para cargar áreas seleccionadas desde localStorage
    function loadSelectedAreas() {
        try {
            const saved = localStorage.getItem('selectedAreas');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Error al cargar desde localStorage:", e);
            return null;
        }
    }
    
    // Función para limpiar todas las áreas guardadas
    function clearAllAreas() {
        selectedAreas = [];
        saveSelectedAreas();
        
        // Limpiar la interfaz
        if (anatomyOverlay) {
            anatomyOverlay.innerHTML = '';
        }
        updateSelectedAreasList();
        
        // Actualizar la visualización de evolución y comparativa
        setupProgressionChart();
    }
    
    // Función para restaurar marcadores visuales
    function restoreMarkers() {
        if (!anatomyOverlay) return;
        
        // Limpiar overlay actual
        anatomyOverlay.innerHTML = '';
        
        // Recrear marcadores para todas las áreas guardadas
        selectedAreas.forEach(area => {
            // Buscar el área original en la lista de anatomyAreas para recuperar datos como el radio
            const areaData = {
                name: area.name,
                x: area.x, 
                y: area.y,
                radius: area.radius,
                category: area.category
            };
            
            createMarker(areaData, area.severity);
        });
    }
    
    // Añadir botón para reiniciar todas las áreas
    const resetAreasBtn = document.createElement('button');
    resetAreasBtn.className = 'btn-secondary';
    resetAreasBtn.textContent = 'Reiniciar áreas';
    resetAreasBtn.style.marginTop = '10px';
    resetAreasBtn.addEventListener('click', clearAllAreas);
    
    // Añadir el botón al DOM, justo después de la lista de áreas seleccionadas
    if (selectedAreasList && selectedAreasList.parentNode) {
        selectedAreasList.parentNode.appendChild(resetAreasBtn);
    }
    
    // Función para convertir coordenadas porcentuales a píxeles
    function getPixelCoordinates(area) {
        if (!anatomyImg) return null;
        
        const imgWidth = anatomyImg.clientWidth;
        const imgHeight = anatomyImg.clientHeight;
        
        return {
            x: (area.x / 100) * imgWidth,
            y: (area.y / 100) * imgHeight,
            radius: (area.radius / 100) * Math.min(imgWidth, imgHeight)
        };
    }
    
    // Función para crear marcadores en las áreas afectadas
    function createMarker(area, severity) {
        const coords = getPixelCoordinates(area);
        if (!coords) return;
        
        // Verificar que tenemos un área válida con coordenadas
        if (!area || !area.name || !area.x || !area.y) {
            console.error("Área inválida para crear marcador:", area);
            return;
        }
        
        // Crear el marcador con las coordenadas del área actual
        const marker = document.createElement('div');
        marker.className = `anatomy-marker marker-${severity}`;
        
        // Asignar posición usando las coordenadas específicas del área
        marker.style.left = `${coords.x - coords.radius}px`;
        marker.style.top = `${coords.y - coords.radius}px`;
        marker.style.width = `${coords.radius * 2}px`;
        marker.style.height = `${coords.radius * 2}px`;
        marker.style.pointerEvents = 'none'; // Evita que el marcador interfiera con los clicks
        
        // Añadir atributos para identificar el área
        marker.setAttribute('data-area', area.name);
        marker.setAttribute('data-category', area.category);
        
        console.log(`Creando marcador para: ${area.name} en (${coords.x}, ${coords.y}) con radio ${coords.radius}`);
        
        // Añadir al overlay
        anatomyOverlay.appendChild(marker);
    }
    
    // Función para agregar un área a la lista de seleccionadas
    function addSelectedArea() {
        console.log("Función addSelectedArea ejecutada");
        
        // Verificación adicional - comprobar si el área sigue siendo válida
        const areaName = document.getElementById('area-name').textContent;
        
        // Si el contenido del área está vacío, podría indicar un problema con currentHoveredArea
        if (!areaName || areaName.trim() === '') {
            console.log("Nombre de área no encontrado en el formulario");
            alert("No se ha seleccionado correctamente un área. Por favor, vuelva a hacer clic en el área anatómica deseada.");
            return;
        }
        
        // Si llegamos aquí, tenemos un nombre de área en el formulario
        // Buscar el área original en la lista de anatomyAreas si currentHoveredArea no es válido
        if (!currentHoveredArea) {
            console.log("currentHoveredArea no es válido, intentando recuperar desde anatomyAreas");
            for (const area of anatomyAreas) {
                if (area.name === areaName) {
                    currentHoveredArea = area;
                    console.log("Área recuperada de la lista de áreas:", area);
                    break;
                }
            }
            
            // Si aún no podemos recuperar el área, mostrar error
            if (!currentHoveredArea) {
                console.error("No se pudo recuperar el área desde la lista de áreas");
                alert("Error al recuperar información del área. Por favor, vuelva a seleccionar un área de la anatomía.");
                return;
            }
        }
        
        console.log("Añadiendo área seleccionada:", currentHoveredArea);
        
        const severity = document.getElementById('severity-level').value;
        const evolution = document.getElementById('evolution-level').value;
        const startDate = document.getElementById('symptom-start-date').value;
        const functionalImpact = document.getElementById('functional-impact').value;
        const intervention = document.getElementById('intervention').value;
        
        console.log("Datos recogidos:", {
            severity,
            evolution,
            startDate,
            functionalImpact,
            intervention
        });
        
        // Verificar si el área ya está seleccionada
        const existingIndex = selectedAreas.findIndex(area => area.name === areaName);
        
        if (existingIndex !== -1) {
            // Actualizar la información si ya existe
            selectedAreas[existingIndex] = {
                ...selectedAreas[existingIndex],
                severity: severity,
                evolution: evolution,
                startDate: startDate,
                functionalImpact: functionalImpact,
                intervention: intervention,
                category: currentHoveredArea.category,
                // Mantener coordenadas originales para el marcador
                x: currentHoveredArea.x,
                y: currentHoveredArea.y,
                radius: currentHoveredArea.radius
            };
            
            // Eliminar el marcador anterior
            const oldMarker = anatomyOverlay.querySelector(`[data-area="${areaName}"]`);
            if (oldMarker) {
                anatomyOverlay.removeChild(oldMarker);
            }
        } else {
            // Añadir nueva área con todas las propiedades necesarias
            selectedAreas.push({
                name: areaName,
                severity: severity,
                evolution: evolution,
                startDate: startDate,
                functionalImpact: functionalImpact,
                intervention: intervention,
                category: currentHoveredArea.category,
                // Incluir coordenadas para el marcador
                x: currentHoveredArea.x,
                y: currentHoveredArea.y,
                radius: currentHoveredArea.radius
            });
        }
        
        // Guardar en localStorage
        saveSelectedAreas();
        
        // Crear marcador usando el área actualmente seleccionada
        createMarker(currentHoveredArea, severity);
        
        // Actualizar la lista de áreas seleccionadas
        updateSelectedAreasList();
        
        // Actualizar la visualización de evolución y comparativa
        setupProgressionChart();
        
        // Limpiar todos los campos del formulario
        document.getElementById('symptom-start-date').value = '';
        document.getElementById('functional-impact').value = '';
        document.getElementById('intervention').value = '';
        
        // Resetear los selectores a sus valores por defecto
        const severitySelect = document.getElementById('severity-level');
        const evolutionSelect = document.getElementById('evolution-level');
        if (severitySelect) severitySelect.selectedIndex = 0;
        if (evolutionSelect) evolutionSelect.selectedIndex = 0;
        
        // Limpiar los campos de texto de área y categoría
        document.getElementById('area-name').textContent = '';
        document.getElementById('area-category').textContent = '';
        
        // Ocultar el formulario de detalles del área
        document.getElementById('area-details-form').style.display = 'none';
        
        // Importante: Reiniciar el área seleccionada actualmente para evitar errores
        // al intentar seleccionar una nueva área
        currentHoveredArea = null;
        
        // Limpiar cualquier resaltado temporal que pudiera quedar
        removeHighlight();
        
        // Mostrar un mensaje breve confirmando que se ha añadido el área
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'confirmation-message';
        confirmationMessage.textContent = `Área "${areaName}" añadida correctamente`;
        confirmationMessage.style.position = 'fixed';
        confirmationMessage.style.top = '50%';
        confirmationMessage.style.left = '50%';
        confirmationMessage.style.transform = 'translate(-50%, -50%)';
        confirmationMessage.style.padding = '10px 20px';
        confirmationMessage.style.background = 'rgba(46, 204, 113, 0.9)';
        confirmationMessage.style.color = 'white';
        confirmationMessage.style.borderRadius = '5px';
        confirmationMessage.style.zIndex = '1000';
        document.body.appendChild(confirmationMessage);
        
        // Eliminar el mensaje después de 2 segundos
        setTimeout(() => {
            if (confirmationMessage.parentNode) {
                confirmationMessage.parentNode.removeChild(confirmationMessage);
            }
        }, 2000);
    }
    
    // Función para actualizar la lista visual de áreas seleccionadas
    function updateSelectedAreasList() {
        selectedAreasList.innerHTML = '';
        
        if (selectedAreas.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = 'Ninguna área seleccionada';
            selectedAreasList.appendChild(emptyItem);
            return;
        }
        
        // Agrupar por categorías para mejor organización
        const groupedAreas = {
            bulbar: { title: "Región Bulbar", items: [] },
            cervical: { title: "Región Cervical", items: [] },
            respiratoria: { title: "Musculatura Respiratoria", items: [] },
            miembro_superior: { title: "Miembros Superiores", items: [] },
            miembro_inferior: { title: "Miembros Inferiores", items: [] }
        };
        
        // Clasificar áreas en grupos
        selectedAreas.forEach(area => {
            if (groupedAreas[area.category]) {
                groupedAreas[area.category].items.push(area);
            }
        });
        
        // Crear elementos de lista agrupados
        for (const category in groupedAreas) {
            if (groupedAreas[category].items.length > 0) {
                const categoryHeader = document.createElement('li');
                categoryHeader.className = 'category-header';
                categoryHeader.textContent = groupedAreas[category].title;
                selectedAreasList.appendChild(categoryHeader);
                
                groupedAreas[category].items.forEach(area => {
                    const listItem = document.createElement('li');
                    listItem.className = 'area-item';
                    
                    const dateInfo = area.startDate ? `<br>Inicio: ${area.startDate}` : '';
                    const evolutionInfo = `<br>Evolución: <span class="evolution-${area.evolution}">${area.evolution}</span>`;
                    const functionalInfo = area.functionalImpact ? `<br>Impacto funcional: ${area.functionalImpact}` : '';
                    const interventionInfo = area.intervention ? `<br>Intervención: ${area.intervention}` : '';
                    
                    listItem.innerHTML = `
                        <strong>${area.name}</strong> - Afectación: <span class="severity-${area.severity}">${area.severity}</span>
                        ${dateInfo}
                        ${evolutionInfo}
                        ${functionalInfo}
                        ${interventionInfo}
                        <button class="remove-area-btn" data-area="${area.name}">×</button>
                    `;
                    selectedAreasList.appendChild(listItem);
                    
                    // Añadir evento para eliminar áreas
                    const removeBtn = listItem.querySelector('.remove-area-btn');
                    removeBtn.addEventListener('click', function() {
                        removeArea(area.name);
                    });
                });
            }
        }
    }
    
    // Función para eliminar un área seleccionada
    function removeArea(areaName) {
        // Eliminar de la lista de áreas seleccionadas
        selectedAreas = selectedAreas.filter(area => area.name !== areaName);
        
        // Actualizar localStorage
        saveSelectedAreas();
        
        // Eliminar el marcado
        const marker = anatomyOverlay.querySelector(`[data-area="${areaName}"]`);
        if (marker) {
            anatomyOverlay.removeChild(marker);
        }
        
        // Actualizar la lista visual
        updateSelectedAreasList();
        
        // Actualizar la visualización de evolución y comparativa
        setupProgressionChart();
    }
    
    // Evento para añadir un área cuando se hace clic en el botón
    if (addAreaBtn) {
        console.log("Botón encontrado, agregando evento click:", addAreaBtn);
        addAreaBtn.addEventListener('click', function(e) {
            console.log("Botón de añadir área clickeado");
            addSelectedArea();
        });
    } else {
        console.error("No se encontró el botón de añadir área");
    }
    
    // Inicializar la lista de áreas seleccionadas
    updateSelectedAreasList();
    
    // Evento para detectar cuando el mouse se posiciona sobre la imagen
    if (anatomyImg) {
        anatomyImg.addEventListener('mousemove', function(e) {
            const rect = anatomyImg.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Encontrar si el cursor está sobre un área anatómica
            let foundArea = null;
            let minDistance = Infinity;
            
            // Primero buscar todas las áreas dentro del radio y seleccionar la más cercana
            for (const area of anatomyAreas) {
                const distance = Math.sqrt(Math.pow(x - area.x, 2) + Math.pow(y - area.y, 2));
                
                // Si el cursor está dentro del radio del área
                if (distance <= area.radius) {
                    // Solo actualizar si esta área está más cerca que otras áreas encontradas
                    if (distance < minDistance) {
                        minDistance = distance;
                        foundArea = area;
                    }
                }
            }
            
            // Verificar si el área ha cambiado para evitar parpadeos y actualizaciones innecesarias
            if (currentHoveredArea !== foundArea) {
                // Si hay un área actualmente mostrada en el formulario, no la cambiemos automáticamente
                const areaDetailsForm = document.getElementById('area-details-form');
                const formVisible = areaDetailsForm && areaDetailsForm.style.display === 'block';
                const areaNameElement = document.getElementById('area-name');
                const currentAreaNameInForm = areaNameElement ? areaNameElement.textContent : '';
                
                // Solo actualizar el área actual si no hay un formulario visible O si es la misma área
                if (!formVisible || (foundArea && foundArea.name === currentAreaNameInForm)) {
                    // Actualizar el área actual
                    currentHoveredArea = foundArea;
                    
                    // Cambiar el cursor si está sobre un área
                    anatomyImg.style.cursor = foundArea ? 'pointer' : 'default';
                    
                    // Actualizar el tooltip si existe
                    const tooltip = document.getElementById('anatomy-tooltip');
                    if (tooltip) {
                        if (foundArea) {
                            tooltip.textContent = foundArea.name;
                            // Posicionar el tooltip justo al lado del cursor
                            tooltip.style.left = `${e.pageX + 15}px`;
                            tooltip.style.top = `${e.pageY - 10}px`;
                            tooltip.style.display = 'block';
                            
                            // Solo resaltar si no hay un formulario visible o es la misma área
                            if (!formVisible || foundArea.name === currentAreaNameInForm) {
                                // Resaltar la zona al pasar el cursor
                                highlightArea(foundArea);
                            }
                        } else {
                            tooltip.style.display = 'none';
                            // Solo eliminar resaltado si no hay un formulario visible
                            if (!formVisible) {
                                removeHighlight();
                            }
                        }
                    }
                }
            }
        });
        
        // Eliminar el resaltado y ocultar tooltip al salir de la imagen
        anatomyImg.addEventListener('mouseleave', function() {
            const tooltip = document.getElementById('anatomy-tooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
            removeHighlight();
        });

        // Función para resaltar temporalmente un área
        function highlightArea(area) {
            // Eliminar resaltado previo si existe
            removeHighlight();
            
            // Crear elemento de resaltado
            const highlight = document.createElement('div');
            highlight.className = 'anatomy-highlight';
            highlight.id = 'temp-highlight';
            
            // Posicionar el resaltado
            const coords = getPixelCoordinates(area);
            if (coords) {
                highlight.style.left = `${coords.x - coords.radius}px`;
                highlight.style.top = `${coords.y - coords.radius}px`;
                highlight.style.width = `${coords.radius * 2}px`;
                highlight.style.height = `${coords.radius * 2}px`;
                
                anatomyOverlay.appendChild(highlight);
            }
        }
        
        // Función para eliminar el resaltado temporal
        function removeHighlight() {
            const highlight = document.getElementById('temp-highlight');
            if (highlight) {
                highlight.remove();
            }
        }
        
        // Evento para seleccionar un área al hacer clic en la imagen
        anatomyImg.addEventListener('click', function() {
            // Verificar si ya hay un formulario visible para un área
            const areaDetailsForm = document.getElementById('area-details-form');
            const formVisible = areaDetailsForm && areaDetailsForm.style.display === 'block';
            const areaNameElement = document.getElementById('area-name');
            const currentAreaNameInForm = areaNameElement ? areaNameElement.textContent : '';
            
            // Si hay un área siendo editada y el usuario hace clic en otra área, mostrar alerta
            if (formVisible && currentHoveredArea && currentHoveredArea.name !== currentAreaNameInForm) {
                console.log("Intento de seleccionar un área mientras se edita otra", {
                    areaEnFormulario: currentAreaNameInForm,
                    areaNueva: currentHoveredArea.name
                });
                
                // Mostrar un mensaje al usuario
                alert("Estás editando el área '" + currentAreaNameInForm + "'. Por favor, completa la edición actual o cierra el formulario antes de seleccionar otra área.");
                
                // Mantener el área original seleccionada
                for (const area of anatomyAreas) {
                    if (area.name === currentAreaNameInForm) {
                        currentHoveredArea = area;
                        break;
                    }
                }
                
                return;
            }
            
            if (currentHoveredArea) {
                // Al hacer clic, seleccionar automáticamente el área en el formulario
                document.getElementById('area-name').textContent = currentHoveredArea.name;
                document.getElementById('area-category').textContent = getCategoryName(currentHoveredArea.category);
                
                // Limpiar los campos del formulario antes de mostrarlo
                // Esto evita que se mantengan datos de selecciones anteriores
                document.getElementById('symptom-start-date').value = '';
                document.getElementById('functional-impact').value = '';
                document.getElementById('intervention').value = '';
                
                // Resetear selectores a sus valores por defecto
                const severitySelect = document.getElementById('severity-level');
                const evolutionSelect = document.getElementById('evolution-level');
                if (severitySelect) severitySelect.selectedIndex = 0;
                if (evolutionSelect) evolutionSelect.selectedIndex = 0;
                
                // Mostrar el formulario de edición
                areaDetailsForm.style.display = 'block';
                
                // Configurar el botón de añadir área dentro del formulario
                const formAddButton = document.getElementById('add-area-btn');
                if (formAddButton) {
                    // Eliminar eventos previos para evitar duplicación
                    formAddButton.replaceWith(formAddButton.cloneNode(true));
                    const newButton = document.getElementById('add-area-btn');
                    
                    // Añadir el nuevo evento
                    newButton.addEventListener('click', function() {
                        console.log("Botón dentro del formulario clickeado");
                        addSelectedArea();
                    });
                } else {
                    console.error("No se encontró el botón dentro del formulario");
                }
                
                // Configurar el botón de cancelar
                const cancelButton = document.getElementById('cancel-area-btn');
                if (cancelButton) {
                    // Eliminar eventos previos para evitar duplicación
                    cancelButton.replaceWith(cancelButton.cloneNode(true));
                    const newCancelButton = document.getElementById('cancel-area-btn');
                    
                    // Añadir el nuevo evento
                    newCancelButton.addEventListener('click', function() {
                        console.log("Botón de cancelar clickeado");
                        
                        // Ocultar el formulario
                        areaDetailsForm.style.display = 'none';
                        
                        // Limpiar el área seleccionada actual para permitir nueva selección
                        currentHoveredArea = null;
                        
                        // Limpiar los campos
                        document.getElementById('area-name').textContent = '';
                        document.getElementById('area-category').textContent = '';
                        document.getElementById('symptom-start-date').value = '';
                        document.getElementById('functional-impact').value = '';
                        document.getElementById('intervention').value = '';
                        
                        // Eliminar cualquier resaltado temporal
                        removeHighlight();
                    });
                } else {
                    console.error("No se encontró el botón de cancelar");
                }
            }
        });
    }
    
    // Función helper para obtener el nombre legible de la categoría
    function getCategoryName(category) {
        const categoryNames = {
            'bulbar': 'Región Bulbar',
            'cervical': 'Región Cervical',
            'respiratoria': 'Musculatura Respiratoria',
            'miembro_superior': 'Miembros Superiores',
            'miembro_inferior': 'Miembros Inferiores'
        };
        
        return categoryNames[category] || category;
    }
    
    // Configurar gráfico de progresión si existe el contenedor
    setupProgressionChart();
}

// Función para configurar el sistema de pestañas
function setupTabs() {
    console.log("Configurando sistema de pestañas...");
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length === 0 || tabPanes.length === 0) {
        console.error("No se encontraron elementos de pestañas en el DOM");
        return;
    }
    
    console.log(`Encontrados: ${tabButtons.length} botones y ${tabPanes.length} paneles`);
    
    // Establecer estado inicial
    tabPanes.forEach(pane => {
        // Ocultar todos los paneles primero
        pane.style.display = 'none';
        pane.classList.remove('active');
    });
    
    // Activar la primera pestaña por defecto
    if (tabButtons[0] && tabPanes[0]) {
        tabButtons[0].classList.add('active');
        tabPanes[0].classList.add('active');
        tabPanes[0].style.display = 'block';
    }
    
    // Añadir event listeners a los botones
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log(`Tab cliqueado: ${tabId}`);
            
            // Desactivar todas las pestañas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.style.display = 'none';
            });
            
            // Activar la pestaña seleccionada
            this.classList.add('active');
            const activePane = document.getElementById(tabId);
            if (activePane) {
                activePane.classList.add('active');
                activePane.style.display = 'block';
                console.log(`Activado panel: ${tabId}`);
            } else {
                console.error(`No se encontró el panel: ${tabId}`);
            }
        });
    });
    
    console.log("Sistema de pestañas configurado correctamente");
}

// Función para configurar el gráfico de progresión
function setupProgressionChart() {
    const progressionChart = document.getElementById('progression-chart');
    if (!progressionChart) return;
    
    // Obtener datos de áreas seleccionadas con fechas (simulados para demostración)
    const savedEvaluations = getSavedEvaluations();
    
    if (savedEvaluations.length === 0) {
        progressionChart.innerHTML = '<div class="no-data">No hay datos de evaluaciones previas para mostrar.</div>';
        return;
    }
    
    // Ordenar evaluaciones por fecha
    savedEvaluations.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Generar el gráfico
    createProgressionChart(progressionChart, savedEvaluations);
    
    // Actualizar las opciones de fechas en la comparativa
    updateComparisonDateOptions(savedEvaluations);
    
    // Configurar la funcionalidad de comparación
    setupComparisonFeature(savedEvaluations);
}

// Función para obtener evaluaciones guardadas (simulada para demostración)
function getSavedEvaluations() {
    // Intentar obtener las áreas seleccionadas de localStorage
    try {
        const saved = localStorage.getItem('selectedAreas');
        if (!saved) {
            console.log("No hay áreas guardadas en localStorage");
            return [];
        }
        
        const selectedAreas = JSON.parse(saved);
        if (!selectedAreas || !Array.isArray(selectedAreas) || selectedAreas.length === 0) {
            console.log("No hay áreas válidas o el array está vacío");
            return [];
        }
        
        console.log("Áreas cargadas de localStorage:", selectedAreas);
        
        // Agrupar áreas por fecha para crear las evaluaciones
        const areasByDate = {};
        
        selectedAreas.forEach(area => {
            const date = area.startDate || new Date().toISOString().split('T')[0];
            
            if (!areasByDate[date]) {
                areasByDate[date] = [];
            }
            
            areasByDate[date].push({
                name: area.name,
                severity: area.severity || 'leve',
                category: area.category,
                evolution: area.evolution || 'estable',
                functionalImpact: area.functionalImpact,
                intervention: area.intervention
            });
        });
        
        // Convertir a un array de evaluaciones
        const evaluations = Object.keys(areasByDate).map(date => ({
            date: date,
            areas: areasByDate[date]
        }));
        
        console.log("Evaluaciones generadas:", evaluations);
        return evaluations;
    } catch (e) {
        console.error("Error al cargar evaluaciones desde localStorage:", e);
        return [];
    }
}

// Función para crear el gráfico de progresión
function createProgressionChart(container, evaluations) {
    // Verificar si hay datos para mostrar
    if (!evaluations || evaluations.length === 0) {
        container.innerHTML = '<div class="no-data">No hay datos de evaluaciones previas para mostrar.</div>';
        return;
    }
    
    console.log("Creando gráfico de progresión con datos:", evaluations);
    
    // Preparar datos para el gráfico
    const dates = evaluations.map(eval => {
        const date = new Date(eval.date);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    });
    
    // Crear una estructura para almacenar los puntos de datos individuales
    const dataPoints = [];
    
    // Extraer cada área como un punto de datos individual con su severidad exacta
    evaluations.forEach((eval, dateIndex) => {
        eval.areas.forEach(area => {
            // Solo agregar áreas con severidad válida
            if (area.severity && area.severity !== 'ninguna') {
                dataPoints.push({
                    name: area.name,
                    category: area.category,
                    dateIndex: dateIndex,
                    severity: area.severity,
                    date: dates[dateIndex]
                });
            }
        });
    });
    
    console.log("Puntos de datos preparados:", dataPoints);
    
    if (dataPoints.length === 0) {
        container.innerHTML = '<div class="no-data">No hay suficientes datos para mostrar la evolución temporal.</div>';
        return;
    }
    
    // Crear gráfico (versión simple con HTML/CSS para demostración)
    let chartHTML = `
        <div class="chart-container">
            <div class="chart-y-axis">
                <div class="chart-y-label">Grave</div>
                <div class="chart-y-label">Moderada</div>
                <div class="chart-y-label">Leve</div>
                <div class="chart-y-label">Sin afectación</div>
            </div>
            <div class="chart-grid">
    `;
    
    // Procesar cada punto individualmente para asignar el color correcto según la severidad
    dataPoints.forEach(point => {
        // Calcular posición X (fecha) e Y (severidad)
        const xPos = dates.length > 1 ? 
            (point.dateIndex / (dates.length - 1)) * 100 :
            50; // Centrar si solo hay una fecha
        
        // Calcular posición Y basada en la severidad
        // Importante: En CSS, bottom: 0% es la parte inferior y bottom: 100% es la parte superior
        let yPos;
        switch(point.severity) {
            case 'leve': yPos = 25; break;         // 1/4 desde abajo
            case 'moderada': yPos = 50; break;     // 2/4 desde abajo (mitad)
            case 'grave': yPos = 75; break;        // 3/4 desde abajo
            default: yPos = 0;                     // Sin afectación, abajo del todo
        }
        
        // Determinar el color según la severidad
        let colorClass;
        switch(point.severity) {
            case 'leve': colorClass = 'dot-leve'; break;
            case 'moderada': colorClass = 'dot-moderada'; break;
            case 'grave': colorClass = 'dot-grave'; break;
            default: colorClass = '';
        }
        
        // Crear el punto con su tooltip informativo y color específico
        chartHTML += `
            <div class="chart-point ${colorClass}" style="left: ${xPos}%; bottom: ${yPos}%;" 
                 title="${point.name} (${getCategoryName(point.category)}): ${getSeverityDisplayName(point.severity)} (${point.date})"></div>
        `;
    });
    
    // Añadir etiquetas de fechas en el eje X
    chartHTML += `
            </div>
            <div class="chart-x-axis">
    `;
    
    dates.forEach(date => {
        chartHTML += `<div class="chart-x-label">${date}</div>`;
    });
    
    // Añadir leyenda para clarificar los colores
    chartHTML += `
            </div>
            <div class="chart-legend">
                <div class="legend-item"><span class="dot dot-leve"></span> Leve</div>
                <div class="legend-item"><span class="dot dot-moderada"></span> Moderada</div>
                <div class="legend-item"><span class="dot dot-grave"></span> Grave</div>
            </div>
        </div>
    `;
    
    container.innerHTML = chartHTML;
    console.log("Gráfico de progresión creado con éxito");
}

// Función para obtener color por categoría
function getCategoryColor(category) {
    const colors = {
        'bulbar': '#e74c3c',
        'respiratoria': '#3498db',
        'miembro_superior': '#2ecc71',
        'miembro_inferior': '#f39c12',
        'cervical': '#9b59b6'
    };
    
    return colors[category] || '#666';
}

// Función para obtener etiqueta de severidad según valor numérico
function getSeverityDisplayName(severity) {
    switch(severity) {
        case 'leve': return 'Leve';
        case 'moderada': return 'Moderada';
        case 'grave': return 'Grave';
        case 'ninguna': return 'Sin afectación';
        default: return severity;
    }
}

// Función para actualizar opciones de fechas en la comparativa
function updateComparisonDateOptions(evaluations) {
    const date1Select = document.getElementById('comparison-date1');
    const date2Select = document.getElementById('comparison-date2');
    
    if (!date1Select || !date2Select) return;
    
    // Limpiar opciones existentes
    date1Select.innerHTML = '<option value="">Seleccionar fecha...</option>';
    date2Select.innerHTML = '<option value="">Seleccionar fecha...</option>';
    
    // Añadir opciones de fechas
    evaluations.forEach((eval, index) => {
        const date = new Date(eval.date);
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        
        const option1 = document.createElement('option');
        option1.value = index;
        option1.textContent = dateStr;
        date1Select.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = index;
        option2.textContent = dateStr;
        date2Select.appendChild(option2);
    });
}

// Función para configurar la funcionalidad de comparación
function setupComparisonFeature(evaluations) {
    const compareBtn = document.getElementById('compare-btn');
    const date1Select = document.getElementById('comparison-date1');
    const date2Select = document.getElementById('comparison-date2');
    const resultsDiv = document.getElementById('comparison-results');
    
    if (!compareBtn || !date1Select || !date2Select || !resultsDiv) return;
    
    compareBtn.addEventListener('click', function() {
        const index1 = parseInt(date1Select.value);
        const index2 = parseInt(date2Select.value);
        
        if (isNaN(index1) || isNaN(index2) || index1 === index2) {
            resultsDiv.innerHTML = '<p class="error-message">Por favor, seleccione dos fechas diferentes para comparar.</p>';
            return;
        }
        
        const eval1 = evaluations[index1];
        const eval2 = evaluations[index2];
        
        // Determinar cuál es la evaluación anterior y cuál la más reciente
        const [oldEval, newEval] = eval1.date < eval2.date ? [eval1, eval2] : [eval2, eval1];
        
        // Generar la comparativa
        const comparisonHTML = generateComparisonHTML(oldEval, newEval);
        resultsDiv.innerHTML = comparisonHTML;
    });
}

// Función para generar el HTML de la comparativa
function generateComparisonHTML(oldEval, newEval) {
    const oldDate = new Date(oldEval.date);
    const newDate = new Date(newEval.date);
    
    const oldDateStr = `${oldDate.getDate()}/${oldDate.getMonth() + 1}/${oldDate.getFullYear()}`;
    const newDateStr = `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    
    let html = `
        <div class="comparison-header">
            <h5>Comparativa entre ${oldDateStr} y ${newDateStr}</h5>
        </div>
        <div class="comparison-content">
    `;
    
    // Lista de todas las áreas que aparecen en ambas evaluaciones
    const allAreas = new Set();
    oldEval.areas.forEach(area => allAreas.add(area.name));
    newEval.areas.forEach(area => allAreas.add(area.name));
    
    // Agrupar por categorías
    const categorizedAreas = {};
    
    allAreas.forEach(areaName => {
        const oldArea = oldEval.areas.find(a => a.name === areaName);
        const newArea = newEval.areas.find(a => a.name === areaName);
        
        if (!oldArea && !newArea) return;
        
        const category = (oldArea ? oldArea.category : newArea.category) || 'otra';
        
        if (!categorizedAreas[category]) {
            categorizedAreas[category] = [];
        }
        
        categorizedAreas[category].push({
            name: areaName,
            old: oldArea,
            new: newArea
        });
    });
    
    // Generar comparación por categorías
    for (const category in categorizedAreas) {
        html += `<div class="comparison-category">
            <h6>${getCategoryName(category)}</h6>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Área</th>
                        <th>${oldDateStr}</th>
                        <th>${newDateStr}</th>
                        <th>Cambio</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        categorizedAreas[category].forEach(item => {
            const oldSeverity = item.old ? item.old.severity : 'ninguna';
            const newSeverity = item.new ? item.new.severity : 'ninguna';
            
            const change = getChangeIndicator(oldSeverity, newSeverity);
            
            html += `
                <tr>
                    <td>${item.name}</td>
                    <td><span class="severity-${oldSeverity}">${getSeverityDisplayName(oldSeverity)}</span></td>
                    <td><span class="severity-${newSeverity}">${getSeverityDisplayName(newSeverity)}</span></td>
                    <td>${change}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        </div>`;
    }
    
    html += `
        </div>
    `;
    
    return html;
}

// Función para obtener el nombre de visualización de la severidad
function getSeverityDisplayName(severity) {
    switch(severity) {
        case 'leve': return 'Leve';
        case 'moderada': return 'Moderada';
        case 'grave': return 'Grave';
        case 'ninguna': return 'Sin afectación';
        default: return severity;
    }
}

// Función para obtener el indicador de cambio
function getChangeIndicator(oldSeverity, newSeverity) {
    const severityValues = {
        'ninguna': 0,
        'leve': 1,
        'moderada': 2,
        'grave': 3
    };
    
    const oldVal = severityValues[oldSeverity] || 0;
    const newVal = severityValues[newSeverity] || 0;
    
    if (oldVal === newVal) {
        return '<span class="change-none">Sin cambios</span>';
    } else if (newVal > oldVal) {
        const diff = newVal - oldVal;
        return `<span class="change-worse">Empeoramiento ${'+'.repeat(diff)}</span>`;
    } else {
        const diff = oldVal - newVal;
        return `<span class="change-better">Mejora ${'+'}</span>`;
    }
}

// Función para obtener el nombre legible de la categoría
function getCategoryName(category) {
    const categoryNames = {
        'bulbar': 'Región Bulbar',
        'cervical': 'Región Cervical',
        'respiratoria': 'Musculatura Respiratoria',
        'miembro_superior': 'Miembros Superiores',
        'miembro_inferior': 'Miembros Inferiores',
        'otra': 'Otras áreas'
    };
    
    return categoryNames[category] || category;
} 