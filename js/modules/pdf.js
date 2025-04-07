// pdf.js - Módulo para generación de informes en PDF

const EMPA_PDF = {
    // Inicializa el módulo de PDF
    init: function() {
        console.log('Inicializando módulo de PDF...');
        
        // Verificar si existe la biblioteca jsPDF (se cargaría externamente)
        if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
            console.warn('La biblioteca jsPDF no está disponible o no es compatible. La generación de PDF estará limitada.');
        } else {
            console.log('Biblioteca jsPDF detectada correctamente.');
        }
        
        // Verificar si está disponible html2canvas
        if (typeof html2canvas === 'undefined') {
            console.warn('La biblioteca html2canvas no está disponible. Algunas funcionalidades de PDF estarán limitadas.');
        } else {
            console.log('Biblioteca html2canvas detectada correctamente.');
        }
        
        console.log('Módulo de PDF inicializado correctamente');
    },
    
    // Generar informe en PDF con los datos de la evaluación
    generateReport: function() {
        console.log('Generando informe PDF completo...');
        
        try {
            // Comprobar que la librería jsPDF esté disponible
            if (typeof jspdf === 'undefined') {
                console.error('La librería jsPDF no está disponible.');
                alert('No se puede generar el PDF. La librería jsPDF no está disponible.');
                return;
            }
            
            // Crear documento PDF
            const { jsPDF } = jspdf;
            const doc = new jsPDF();
            let y = 20; // Posición Y inicial
            
            // Añadir título del informe
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 51, 102);
            doc.text('INFORME DE EVALUACIÓN EMPA-CELA', 105, y, { align: 'center' });
            y += 10;
            
            // Añadir fecha del informe
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            const fechaActual = new Date();
            const fechaFormateada = this.formatDate(fechaActual.toISOString().split('T')[0]);
            doc.text(`Fecha del informe: ${fechaFormateada}`, 105, y, { align: 'center' });
            y += 15;
            
            // Añadir datos del paciente
            y = this.addPatientData(doc, y);
            y += 10;
            
            // Añadir resultados de la evaluación
            y = this.addResults(doc, EMPA_CALCULATION.calculateScore(), y);
            y += 10;
            
            // Añadir áreas anatómicas afectadas
            y = this.addAnatomyAreas(doc, y);
            y += 10;
            
            // Añadir información de soporte respiratorio
            y = this.addRespiratoryInfo(doc, y);
            y += 10;
            
            // Añadir disclaimer
            y = this.addDisclaimer(doc, y);
            
            // Guardar PDF
            doc.save('empa-cela-informe.pdf');
            console.log('Informe PDF generado correctamente');
            return true;
        } catch (error) {
            console.error('Error al generar el informe PDF:', error);
            alert('Ha ocurrido un error al generar el PDF: ' + error.message);
            return false;
        }
    },
    
    // Generar informe simplificado en PDF (solo con datos esenciales)
    generateSimpleReport: function() {
        console.log('Generando informe PDF simplificado...');
        
        try {
            // Comprobar que la librería jsPDF esté disponible
            if (typeof jspdf === 'undefined') {
                console.error('La librería jsPDF no está disponible.');
                alert('No se puede generar el PDF simplificado. La librería jsPDF no está disponible.');
                return;
            }
            
            // Crear documento PDF
            const { jsPDF } = jspdf;
            const doc = new jsPDF();
            let y = 20; // Posición Y inicial
            
            // Añadir título del informe
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 51, 102);
            doc.text('Evaluación Simplificada EMPA-CELA', 105, y, { align: 'center' });
            y += 10;
            
            // Añadir fecha del informe
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            const fechaActual = new Date();
            const fechaFormateada = this.formatDate(fechaActual.toISOString().split('T')[0]);
            doc.text(`Fecha: ${fechaFormateada}`, 105, y, { align: 'center' });
            y += 15;
            
            // Añadir datos básicos del paciente
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Datos del Paciente', 15, y);
            y += 7;
            
            doc.setFont(undefined, 'normal');
            doc.setFontSize(11);
            
            // Obtener nombre y DNI del paciente
            const nombreInput = document.getElementById('nombre-paciente');
            const dniInput = document.getElementById('dni-paciente');
            
            const nombrePaciente = nombreInput ? nombreInput.value : 'No especificado';
            const dniPaciente = dniInput ? dniInput.value : 'No especificado';
            
            doc.text(`Nombre: ${nombrePaciente}`, 20, y);
            y += 6;
            doc.text(`Identificación: ${dniPaciente}`, 20, y);
            y += 15;
            
            // Calcular puntuación
            let resultado = null;
            if (typeof EMPA_CALCULATION !== 'undefined') {
                resultado = EMPA_CALCULATION.calculateScore();
            } else {
                console.error('No se puede calcular la puntuación. El módulo de cálculo no está disponible.');
            }
            
            if (resultado) {
                // Añadir rectángulo para resultado
                doc.setFillColor(240, 240, 240);
                doc.rect(15, y, 180, 30, 'F');
                
                // Añadir título del resultado
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text('Resultado de la Evaluación', 105, y + 10, { align: 'center' });
                
                // Añadir puntuación
                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
                doc.text(`Puntuación total: ${resultado.total} puntos`, 105, y + 18, { align: 'center' });
                
                // Añadir nivel de prioridad con color
                let colorPrioridad;
                switch (resultado.priority.level) {
                    case 1: colorPrioridad = [204, 0, 0]; // Rojo
                        break;
                    case 2: colorPrioridad = [255, 102, 0]; // Naranja
                        break;
                    case 3: colorPrioridad = [0, 153, 0]; // Verde
                        break;
                    case 4: colorPrioridad = [0, 0, 0]; // Negro
                        break;
                    case 5: colorPrioridad = [255, 193, 7]; // Amarillo
                        break;
                    default: colorPrioridad = [33, 37, 41]; // Gris oscuro
                }
                
                doc.setTextColor(colorPrioridad[0], colorPrioridad[1], colorPrioridad[2]);
                doc.setFont(undefined, 'bold');
                doc.text(`Nivel de prioridad: ${resultado.priority.text}`, 105, y + 26, { align: 'center' });
                
                y += 40;
            } else {
                doc.setFontSize(12);
                doc.setTextColor(204, 0, 0);
                doc.text('No se pudo calcular el resultado de la evaluación.', 15, y);
                y += 10;
            }
            
            // Añadir disclaimer simplificado
            y = this.addSimpleDisclaimer(doc, y);
            
            // Guardar PDF
            doc.save('empa-cela-simplificado.pdf');
            console.log('Informe PDF simplificado generado correctamente');
            return true;
        } catch (error) {
            console.error('Error al generar el informe PDF simplificado:', error);
            alert('Ha ocurrido un error al generar el PDF simplificado: ' + error.message);
            return false;
        }
    },
    
    // Añadir datos del paciente al documento
    addPatientData: function(doc, startY) {
        doc.setFontSize(14);
        doc.text('Datos del Paciente', 20, startY);
        
        doc.setFontSize(10);
        const nombrePaciente = document.getElementById('nombre_paciente').value || 'No especificado';
        const idPaciente = document.getElementById('id_paciente').value || 'No especificado';
        const fechaNacimiento = document.getElementById('fecha_nacimiento').value || 'No especificada';
        const fechaEvaluacion = document.getElementById('fecha_evaluacion').value || 'No especificada';
        const profesional = document.getElementById('profesional').value || 'No especificado';
        const centro = document.getElementById('centro').value || 'No especificado';
        
        let yPos = startY + 10;
        doc.text(`Nombre: ${nombrePaciente}`, 20, yPos);
        yPos += 8;
        doc.text(`ID/NHC: ${idPaciente}`, 20, yPos);
        yPos += 8;
        doc.text(`Fecha de nacimiento: ${this.formatDate(fechaNacimiento)}`, 20, yPos);
        yPos += 8;
        doc.text(`Fecha de evaluación: ${this.formatDate(fechaEvaluacion)}`, 20, yPos);
        yPos += 8;
        doc.text(`Profesional evaluador: ${profesional}`, 20, yPos);
        yPos += 8;
        doc.text(`Centro sanitario: ${centro}`, 20, yPos);
        
        // Retornar la nueva posición Y tras añadir los datos
        return yPos + 10;
    },
    
    // Añadir resultados al documento
    addResults: function(doc, resultData, startY) {
        doc.setFontSize(14);
        doc.text('Resultados de la Evaluación', 20, startY);
        
        doc.setFontSize(10);
        let yPos = startY + 10;
        
        doc.text(`Puntuación total: ${resultData.total}`, 20, yPos);
        yPos += 8; // Aumentar espaciado
        
        // Añadir nivel de prioridad
        doc.text(`Nivel de prioridad: ${resultData.priority.text}`, 20, yPos);
        yPos += 12; // Más espaciado antes de recomendaciones
        
        // Añadir recomendaciones
        doc.text('Recomendaciones:', 20, yPos);
        yPos += 8;
        
        if (resultData.recommendations && resultData.recommendations.length > 0) {
            resultData.recommendations.forEach(recommendation => {
                // Verificar si es necesario añadir una nueva página
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                
                // Usar splitTextToSize para manejar recomendaciones largas
                const textWidth = 165; // Ancho disponible para el texto en mm
                const lines = doc.splitTextToSize(recommendation, textWidth);
                
                // Primero añadimos el bullet point
                doc.text('•', 25, yPos);
                
                // Luego añadimos cada línea del texto indentado
                for (let i = 0; i < lines.length; i++) {
                    if (i === 0) {
                        // Primera línea al lado del bullet
                        doc.text(lines[i], 30, yPos);
                    } else {
                        // Líneas siguientes con indentación
                        yPos += 6;
                        // Verificar si necesitamos nueva página
                        if (yPos > 270) {
                            doc.addPage();
                            yPos = 20;
                        }
                        doc.text(lines[i], 30, yPos);
                    }
                }
                
                yPos += 8; // Espaciado después de cada recomendación
            });
        } else {
            doc.text('• No hay recomendaciones disponibles', 25, yPos);
            yPos += 8;
        }
        
        // Retornar la nueva posición Y tras añadir los resultados
        return yPos + 5;
    },
    
    // Añadir información de áreas anatómicas
    addAnatomyAreas: function(doc, startY) {
        // Verificar si hay áreas seleccionadas
        let selectedAreas = [];
        
        // Intentar obtener las áreas del módulo EMPA_ANATOMY
        if (typeof EMPA_ANATOMY !== 'undefined' && EMPA_ANATOMY.selectedAreas) {
            selectedAreas = EMPA_ANATOMY.selectedAreas;
        } 
        // Si no está disponible, intentar con el objeto EMPA global
        else if (typeof EMPA !== 'undefined' && EMPA.selectedAreas) {
            selectedAreas = EMPA.selectedAreas;
        }
        
        if (!selectedAreas || selectedAreas.length === 0) {
            return startY; // No hay áreas seleccionadas
        }
        
        // Verificar si necesitamos una nueva página
        if (startY > 230) {
            doc.addPage();
            startY = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Áreas Anatómicas Afectadas', 20, startY);
        
        doc.setFontSize(10);
        let yPos = startY + 10;
        
        // Agrupar áreas por categoría
        const groupedAreas = {};
        
        selectedAreas.forEach(area => {
            const category = area.category || 'otra';
            if (!groupedAreas[category]) {
                groupedAreas[category] = [];
            }
            groupedAreas[category].push(area);
        });
        
        // Mostrar áreas por categoría
        for (const category in groupedAreas) {
            // Verificar si necesitamos una nueva página
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            const categoryName = this.getCategoryName(category);
            doc.setFont(undefined, 'bold');
            doc.text(categoryName, 20, yPos);
            doc.setFont(undefined, 'normal');
            yPos += 8;
            
            groupedAreas[category].forEach(area => {
                // Verificar si necesitamos una nueva página
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                
                // Obtener textos de severidad y evolución
                const severityText = this.getSeverityText(area.severity);
                const evolutionText = this.getEvolutionText(area.evolution);
                
                doc.text(`• ${area.name}: ${severityText} (${evolutionText})`, 25, yPos);
                yPos += 8;
                
                // Fecha de inicio si existe
                if (area.startDate) {
                    doc.text(`  Inicio: ${this.formatDate(area.startDate)}`, 25, yPos);
                    yPos += 8;
                }
            });
            
            yPos += 5;
        }
        
        return yPos;
    },
    
    // Obtener texto de severidad
    getSeverityText: function(severity) {
        if (!severity) return 'No especificada';
        
        switch (severity.toLowerCase()) {
            case 'leve': return 'Leve';
            case 'moderada': 
            case 'moderado': return 'Moderada';
            case 'grave': 
            case 'severo': 
            case 'severa': return 'Grave';
            default: return 'No especificada';
        }
    },
    
    // Obtener texto de evolución
    getEvolutionText: function(evolution) {
        if (!evolution) return 'No especificada';
        
        switch (evolution.toLowerCase()) {
            case 'estable': return 'Estable';
            case 'mejoria': return 'Mejoría';
            case 'empeoramiento': return 'Empeoramiento';
            default: return 'No especificada';
        }
    },
    
    // Formatear fecha para mostrar
    formatDate: function(dateString) {
        if (!dateString) return 'No especificada';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString();
    },
    
    // Obtener nombre legible de categoría
    getCategoryName: function(category) {
        const categoryNames = {
            'bulbar': 'Región Bulbar',
            'cervical': 'Región Cervical',
            'respiratoria': 'Musculatura Respiratoria',
            'miembro_superior': 'Miembros Superiores',
            'miembro_inferior': 'Miembros Inferiores',
            'otra': 'Otras áreas'
        };
        
        return categoryNames[category] || category;
    },
    
    // Añadir descargo de responsabilidad completo al PDF
    addDisclaimer: function(doc, y) {
        // Verificar si hay suficiente espacio o añadir nueva página
        if (y > 240) {
            doc.addPage();
            y = 20;
        }
        
        // Agregar línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(15, y, 195, y);
        y += 10;
        
        // Texto del disclaimer
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont(undefined, 'italic');
        
        const disclaimerText = 'Este informe ha sido generado utilizando la escala EMPA-CELA, una herramienta de evaluación ' +
            'desarrollada para pacientes con Esclerosis Lateral Amiotrófica. Los resultados deben ser interpretados por un ' +
            'profesional sanitario cualificado y utilizados como complemento a la evaluación clínica. ' +
            'La información de soporte respiratorio se proporciona con fines informativos y no sustituye ' +
            'una evaluación respiratoria completa realizada por especialistas. ' +
            'Este documento no constituye por sí solo una prescripción médica.';
        
        const disclaimerLines = doc.splitTextToSize(disclaimerText, 180);
        doc.text(disclaimerLines, 15, y);
        
        return y + (disclaimerLines.length * 5);
    },
    
    // Añadir descargo de responsabilidad simple al PDF
    addSimpleDisclaimer: function(doc, y) {
        // Agregar línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(15, y, 195, y);
        y += 10;
        
        // Texto del disclaimer simplificado
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont(undefined, 'italic');
        
        const disclaimerText = 'Este informe simplificado ha sido generado utilizando la escala EMPA-CELA. ' +
            'Los resultados deben ser interpretados por un profesional sanitario cualificado. ' +
            'Este documento no constituye por sí solo una prescripción médica.';
        
        const disclaimerLines = doc.splitTextToSize(disclaimerText, 180);
        doc.text(disclaimerLines, 15, y);
        
        return y + (disclaimerLines.length * 5);
    },
    
    /**
     * Añade información de soporte respiratorio al documento PDF
     * @param {jsPDF} doc Documento PDF
     * @param {number} y Posición Y inicial
     * @returns {number} Nueva posición Y después de añadir la información
     */
    addRespiratoryInfo: function(doc, y) {
        // Verificar si existe el módulo respiratorio
        if (typeof EMPA_RESPIRATORY === 'undefined') {
            console.warn('Módulo respiratorio no disponible para el informe');
            return y;
        }
        
        // Obtener datos respiratorios
        const respiratoryData = EMPA_RESPIRATORY.getRespiratoryData();
        if (!respiratoryData) {
            console.warn('No hay datos respiratorios para incluir en el informe');
            return y;
        }
        
        // Verificar si hay suficiente espacio o añadir nueva página
        if (y > 230) {
            doc.addPage();
            y = 20;
        }
        
        // Título de sección
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 51, 102);
        doc.text('EVALUACIÓN RESPIRATORIA', 15, y);
        y += 8;
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        // Parámetros de evaluación respiratoria
        doc.setFont(undefined, 'bold');
        doc.text('Parámetros ventilatorios:', 15, y);
        y += 6;
        
        doc.setFont(undefined, 'normal');
        if (respiratoryData.capacidad) {
            if (respiratoryData.capacidad.cvf !== null) {
                doc.text(`• Capacidad Vital Forzada (CVF): ${respiratoryData.capacidad.cvf}%`, 20, y);
                y += 5;
            }
            
            if (respiratoryData.capacidad.pim !== null) {
                doc.text(`• Presión Inspiratoria Máxima (PIM): ${respiratoryData.capacidad.pim} cmH₂O`, 20, y);
                y += 5;
            }
            
            if (respiratoryData.capacidad.pem !== null) {
                doc.text(`• Presión Espiratoria Máxima (PEM): ${respiratoryData.capacidad.pem} cmH₂O`, 20, y);
                y += 5;
            }
            
            if (respiratoryData.capacidad.saturacion !== null) {
                doc.text(`• Saturación de Oxígeno: ${respiratoryData.capacidad.saturacion}%`, 20, y);
                y += 5;
            }
        }
        
        // Síntomas respiratorios
        if (respiratoryData.sintomas && respiratoryData.sintomas.length > 0) {
            y += 3;
            doc.setFont(undefined, 'bold');
            doc.text('Síntomas respiratorios:', 15, y);
            y += 6;
            
            doc.setFont(undefined, 'normal');
            const sintomasText = respiratoryData.sintomas.map(s => 
                s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')
            ).join(', ');
            
            // Verificar longitud y ajustar si es necesario
            if (doc.getTextWidth(sintomasText) > 180) {
                const sintomasLines = doc.splitTextToSize(sintomasText, 180);
                doc.text(sintomasLines, 20, y);
                y += 5 * sintomasLines.length;
            } else {
                doc.text(sintomasText, 20, y);
                y += 5;
            }
        }
        
        // Dispositivos en uso
        let dispositivosEnUso = [];
        
        // VMNI
        if (respiratoryData.dispositivos && respiratoryData.dispositivos.vmni && respiratoryData.dispositivos.vmni.enUso) {
            y += 3;
            doc.setFont(undefined, 'bold');
            doc.text('Ventilación Mecánica No Invasiva (VMNI):', 15, y);
            y += 6;
            
            doc.setFont(undefined, 'normal');
            let tipoVmni = 'BiPAP';
            switch (respiratoryData.dispositivos.vmni.tipo) {
                case 'bipap': tipoVmni = 'BiPAP'; break;
                case 'cpap': tipoVmni = 'CPAP'; break;
                case 'otro-vmni': tipoVmni = 'Otro'; break;
            }
            doc.text(`• Tipo: ${tipoVmni}`, 20, y);
            y += 5;
            
            if (respiratoryData.dispositivos.vmni.horasUso !== null) {
                doc.text(`• Horas de uso diario: ${respiratoryData.dispositivos.vmni.horasUso} h/día`, 20, y);
                y += 5;
            }
            
            if (respiratoryData.dispositivos.vmni.fechaInicio) {
                const fechaFormatted = this.formatDate(respiratoryData.dispositivos.vmni.fechaInicio);
                doc.text(`• Fecha de inicio: ${fechaFormatted}`, 20, y);
                y += 5;
            }
            
            if (respiratoryData.dispositivos.vmni.periodos && respiratoryData.dispositivos.vmni.periodos.length > 0) {
                const periodosText = respiratoryData.dispositivos.vmni.periodos.map(p => 
                    p.charAt(0).toUpperCase() + p.slice(1)
                ).join(', ');
                doc.text(`• Períodos de uso: ${periodosText}`, 20, y);
                y += 5;
            }
            
            dispositivosEnUso.push('VMNI');
        }
        
        // VMI
        if (respiratoryData.dispositivos && respiratoryData.dispositivos.vmi && respiratoryData.dispositivos.vmi.enUso) {
            y += 3;
            doc.setFont(undefined, 'bold');
            doc.text('Ventilación Mecánica Invasiva (VMI):', 15, y);
            y += 6;
            
            doc.setFont(undefined, 'normal');
            let tipoVmi = 'Traqueostomía permanente';
            switch (respiratoryData.dispositivos.vmi.tipo) {
                case 'traq-permanente': tipoVmi = 'Traqueostomía permanente'; break;
                case 'traq-intermitente': tipoVmi = 'Traqueostomía con ventilación intermitente'; break;
                case 'otro-vmi': tipoVmi = 'Otro'; break;
            }
            doc.text(`• Tipo: ${tipoVmi}`, 20, y);
            y += 5;
            
            if (respiratoryData.dispositivos.vmi.fechaInicio) {
                const fechaFormatted = this.formatDate(respiratoryData.dispositivos.vmi.fechaInicio);
                doc.text(`• Fecha de inicio: ${fechaFormatted}`, 20, y);
                y += 5;
            }
            
            if (respiratoryData.dispositivos.vmi.dependencia) {
                let dependenciaText = '';
                switch (respiratoryData.dispositivos.vmi.dependencia) {
                    case 'total': dependenciaText = 'Total (24h/día)'; break;
                    case 'alta': dependenciaText = 'Alta (16-23h/día)'; break;
                    case 'media': dependenciaText = 'Media (8-16h/día)'; break;
                    case 'baja': dependenciaText = 'Baja (<8h/día)'; break;
                }
                doc.text(`• Grado de dependencia: ${dependenciaText}`, 20, y);
                y += 5;
            }
            
            dispositivosEnUso.push('VMI');
        }
        
        // Otros dispositivos
        if (respiratoryData.dispositivos && respiratoryData.dispositivos.otrosDispositivos && 
            respiratoryData.dispositivos.otrosDispositivos.length > 0) {
            
            y += 3;
            doc.setFont(undefined, 'bold');
            doc.text('Otros dispositivos respiratorios en uso:', 15, y);
            y += 6;
            
            doc.setFont(undefined, 'normal');
            respiratoryData.dispositivos.otrosDispositivos.forEach(dispositivo => {
                let nombreDispositivo = '';
                switch (dispositivo) {
                    case 'asistente-tos': nombreDispositivo = 'Asistente de tos (Cough Assist)'; break;
                    case 'aspirador': nombreDispositivo = 'Aspirador de secreciones'; break;
                    case 'oxigenoterapia': nombreDispositivo = 'Oxigenoterapia domiciliaria'; break;
                    case 'apnea': nombreDispositivo = 'Dispositivo para apnea del sueño'; break;
                    default: nombreDispositivo = dispositivo;
                }
                doc.text(`• ${nombreDispositivo}`, 20, y);
                y += 5;
                
                dispositivosEnUso.push(nombreDispositivo);
            });
        }
        
        // Dispositivos indicados
        if (respiratoryData.dispositivosIndicados && respiratoryData.dispositivosIndicados.tipos && 
            respiratoryData.dispositivosIndicados.tipos.length > 0) {
            
            // Verificar si hay suficiente espacio o añadir nueva página
            if (y > 230) {
                doc.addPage();
                y = 20;
            }
            
            y += 3;
            doc.setFont(undefined, 'bold');
            doc.setTextColor(153, 0, 0);
            doc.text('Dispositivos indicados (no en uso):', 15, y);
            y += 6;
            
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            
            respiratoryData.dispositivosIndicados.tipos.forEach(tipo => {
                let nombreDispositivo = '';
                switch (tipo) {
                    case 'vmni': nombreDispositivo = 'Ventilación Mecánica No Invasiva'; break;
                    case 'vmi': nombreDispositivo = 'Ventilación Mecánica Invasiva'; break;
                    case 'asistente-tos': nombreDispositivo = 'Asistente de tos'; break;
                    case 'aspirador': nombreDispositivo = 'Aspirador de secreciones'; break;
                    case 'oxigenoterapia': nombreDispositivo = 'Oxigenoterapia'; break;
                    default: nombreDispositivo = tipo;
                }
                doc.text(`• ${nombreDispositivo}`, 20, y);
                y += 5;
            });
            
            // Motivo de no utilización
            if (respiratoryData.dispositivosIndicados.motivo) {
                let motivoText = '';
                switch (respiratoryData.dispositivosIndicados.motivo) {
                    case 'en-tramite': motivoText = 'En trámite/pendiente'; break;
                    case 'rechazo': motivoText = 'Rechazo del paciente'; break;
                    case 'contraindicacion': motivoText = 'Contraindicación médica'; break;
                    case 'no-disponible': motivoText = 'No disponible en su área'; break;
                    case 'economico': motivoText = 'Factores económicos'; break;
                    case 'otro': motivoText = 'Otro motivo'; break;
                    default: motivoText = respiratoryData.dispositivosIndicados.motivo;
                }
                
                doc.text(`Motivo principal de no utilización: ${motivoText}`, 20, y);
                y += 5;
            }
            
            // Observaciones
            if (respiratoryData.dispositivosIndicados.observaciones) {
                y += 3;
                doc.setFont(undefined, 'bold');
                doc.text('Observaciones:', 15, y);
                y += 6;
                
                doc.setFont(undefined, 'normal');
                const observacionesLines = doc.splitTextToSize(
                    respiratoryData.dispositivosIndicados.observaciones, 180
                );
                doc.text(observacionesLines, 20, y);
                y += 5 * observacionesLines.length;
            }
        }
        
        return y;
    }
};