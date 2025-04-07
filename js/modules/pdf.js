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
        // Verificar si está disponible jsPDF
        if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
            alert('No se puede generar el PDF. Falta la biblioteca jsPDF.');
            return false;
        }
        
        try {
            // Crear nuevo documento
            const { jsPDF } = jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            // Definir márgenes
            const margin = 20; // margen en mm
            
            // Añadir título
            doc.setFontSize(18);
            doc.text('Informe de Evaluación EMPA-CELA', margin, margin);
            
            // Añadir fecha
            doc.setFontSize(12);
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, margin + 10);
            
            // Datos del paciente
            let currentY = this.addPatientData(doc, margin + 20);
            
            // Añadir resultados
            const resultData = EMPA_CALCULATION.calculateScore();
            currentY = this.addResults(doc, resultData, currentY + 10);
            
            // Añadir áreas anatómicas afectadas
            this.addAnatomyAreas(doc, currentY + 10);
            
            // Añadir nota de descargo de responsabilidad
            this.addDisclaimer(doc);
            
            // Guardar PDF
            doc.save('informe-empa-cela.pdf');
            
            return true;
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Ocurrió un error al generar el PDF. Por favor, inténtelo de nuevo.');
            return false;
        }
    },
    
    // Generar informe simplificado en PDF (solo con datos esenciales)
    generateSimpleReport: function() {
        // Verificar si está disponible jsPDF
        if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
            alert('No se puede generar el PDF. Falta la biblioteca jsPDF.');
            return false;
        }
        
        try {
            // Crear nuevo documento
            const { jsPDF } = jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            // Definir márgenes
            const margin = 20; // margen en mm
            
            // Añadir título
            doc.setFontSize(16);
            doc.text('Evaluación Simplificada EMPA-CELA', margin, margin);
            
            // Añadir fecha
            doc.setFontSize(10);
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, margin + 10);
            
            // Obtener datos básicos del paciente
            const nombrePaciente = document.getElementById('nombre_paciente').value || 'No especificado';
            const idPaciente = document.getElementById('id_paciente').value || 'No especificado';
            
            // Añadir datos básicos
            doc.text(`Paciente: ${nombrePaciente}`, margin, margin + 20);
            doc.text(`ID/NHC: ${idPaciente}`, margin, margin + 28);
            
            // Añadir resultados
            const resultData = EMPA_CALCULATION.calculateScore();
            
            // Dibujar un recuadro para el resultado con más espacio
            doc.setDrawColor(0);
            doc.setFillColor(240, 240, 240);
            doc.rect(margin, margin + 35, 170, 35, 'F');
            
            // Añadir resultado
            doc.setFontSize(12);
            doc.text(`Puntuación total: ${resultData.total}`, margin + 10, margin + 45);
            
            // Añadir nivel de prioridad (con color)
            let priorityColor;
            switch (resultData.priority.level) {
                case 1: priorityColor = [220, 53, 69]; break; // Rojo
                case 2: priorityColor = [253, 126, 20]; break; // Naranja
                case 3: priorityColor = [255, 193, 7]; break; // Amarillo
                case 4: priorityColor = [13, 110, 253]; break; // Azul
                case 5: priorityColor = [25, 135, 84]; break; // Verde
                default: priorityColor = [33, 37, 41]; // Gris oscuro
            }
            
            doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
            doc.setFontSize(14);
            doc.text(resultData.priority.text, margin + 10, margin + 60);
            doc.setTextColor(0);
            
            // Añadir nota de descargo de responsabilidad
            this.addSimpleDisclaimer(doc);
            
            // Guardar PDF
            doc.save('empa-cela-simplificado.pdf');
            
            return true;
        } catch (error) {
            console.error('Error al generar el PDF simplificado:', error);
            alert('Ocurrió un error al generar el PDF simplificado. Por favor, inténtelo de nuevo.');
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
    addDisclaimer: function(doc) {
        // Asegurar que estamos en la última página
        const totalPages = doc.internal.getNumberOfPages();
        doc.setPage(totalPages);
        
        // Obtener dimensiones de página
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        
        // Añadir una línea separadora
        doc.setDrawColor(200);
        doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
        
        // Añadir texto de descargo
        doc.setFontSize(8);
        doc.setTextColor(100);
        const disclaimer = 'AVISO IMPORTANTE: Esta escala no ha sido validada clínicamente. No se asume responsabilidad de ningún tipo ' +
            'por su uso. Los resultados son meramente orientativos y no deben utilizarse como única herramienta para tomar decisiones ' +
            'clínicas. Consulte siempre con profesionales sanitarios cualificados.';
        
        // Usar splitTextToSize para dividir el texto adecuadamente
        const textLines = doc.splitTextToSize(disclaimer, pageWidth - (margin*2));
        doc.text(textLines, margin, pageHeight - 30);
    },
    
    // Añadir descargo de responsabilidad simple al PDF
    addSimpleDisclaimer: function(doc) {
        // Obtener dimensiones de página
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        
        // Añadir una línea separadora
        doc.setDrawColor(200);
        doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
        
        // Añadir texto de descargo
        doc.setFontSize(8);
        doc.setTextColor(100);
        const disclaimer = 'AVISO: Esta escala no ha sido validada clínicamente. Los resultados son meramente orientativos.';
        
        doc.text(disclaimer, margin, pageHeight - 20);
    }
};