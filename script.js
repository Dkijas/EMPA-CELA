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