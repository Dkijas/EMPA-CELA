// pdf.js - Módulo para generación de informes en PDF

const EMPA_PDF = {
    // Inicializa el módulo de PDF
    init: function() {
        console.log('Inicializando módulo de PDF...');
        
        // Verificar si existe la biblioteca jsPDF (se cargaría externamente)
        if (typeof jsPDF === 'undefined') {
            console.warn('La biblioteca jsPDF no está disponible. La generación de PDF estará limitada.');
        }
        
        console.log('Módulo de PDF inicializado correctamente');
    },
    
    // Generar informe en PDF con los datos de la evaluación
    generateReport: function() {
        // Verificar si está disponible jsPDF
        if (typeof jsPDF === 'undefined') {
            alert('No se puede generar el PDF. Falta la biblioteca jsPDF.');
            return false;
        }
        
        try {
            // Crear nuevo documento
            const doc = new jsPDF();
            
            // Añadir título
            doc.setFontSize(18);
            doc.text('Informe de Evaluación EMPA-CELA', 20, 20);
            
            // Añadir fecha
            doc.setFontSize(12);
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
            
            // Datos del paciente
            this.addPatientData(doc, 40);
            
            // Añadir resultados
            const resultData = EMPA_CALCULATION.calculateScore();
            this.addResults(doc, resultData, 70);
            
            // Añadir áreas anatómicas afectadas
            this.addAnatomyAreas(doc, 140);
            
            // Guardar PDF
            doc.save('informe-empa-cela.pdf');
            
            return true;
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Ocurrió un error al generar el PDF. Por favor, inténtelo de nuevo.');
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
        yPos += 6;
        doc.text(`ID/NHC: ${idPaciente}`, 20, yPos);
        yPos += 6;
        doc.text(`Fecha de nacimiento: ${this.formatDate(fechaNacimiento)}`, 20, yPos);
        yPos += 6;
        doc.text(`Fecha de evaluación: ${this.formatDate(fechaEvaluacion)}`, 20, yPos);
        yPos += 6;
        doc.text(`Profesional evaluador: ${profesional}`, 20, yPos);
        yPos += 6;
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
        yPos += 6;
        
        // Añadir nivel de prioridad
        doc.text(`Nivel de prioridad: ${resultData.priority.text}`, 20, yPos);
        yPos += 10;
        
        // Añadir recomendaciones
        doc.text('Recomendaciones:', 20, yPos);
        yPos += 6;
        
        if (resultData.recommendations && resultData.recommendations.length > 0) {
            resultData.recommendations.forEach(recommendation => {
                doc.text(`• ${recommendation}`, 25, yPos);
                yPos += 6;
            });
        } else {
            doc.text('• No hay recomendaciones disponibles', 25, yPos);
            yPos += 6;
        }
        
        // Retornar la nueva posición Y tras añadir los resultados
        return yPos + 10;
    },
    
    // Añadir información de áreas anatómicas
    addAnatomyAreas: function(doc, startY) {
        if (EMPA.selectedAreas.length === 0) {
            return startY; // No hay áreas seleccionadas
        }
        
        doc.setFontSize(14);
        doc.text('Áreas Anatómicas Afectadas', 20, startY);
        
        doc.setFontSize(10);
        let yPos = startY + 10;
        
        // Agrupar áreas por categoría
        const groupedAreas = {};
        
        EMPA.selectedAreas.forEach(area => {
            if (!groupedAreas[area.category]) {
                groupedAreas[area.category] = [];
            }
            groupedAreas[area.category].push(area);
        });
        
        // Mostrar áreas por categoría
        for (const category in groupedAreas) {
            const categoryName = this.getCategoryName(category);
            doc.setFontStyle('bold');
            doc.text(categoryName, 20, yPos);
            doc.setFontStyle('normal');
            yPos += 6;
            
            groupedAreas[category].forEach(area => {
                // Severidad y evolución
                let severityText = '';
                switch (area.severity) {
                    case 'leve': severityText = 'Leve'; break;
                    case 'moderado': severityText = 'Moderado'; break;
                    case 'severo': severityText = 'Severo'; break;
                    default: severityText = 'No especificado';
                }
                
                let evolutionText = '';
                switch (area.evolution) {
                    case 'estable': evolutionText = 'Estable'; break;
                    case 'mejoria': evolutionText = 'Mejora'; break;
                    case 'empeoramiento': evolutionText = 'Empeoramiento'; break;
                    default: evolutionText = 'No especificado';
                }
                
                doc.text(`• ${area.name}: ${severityText} (${evolutionText})`, 25, yPos);
                
                // Fecha de inicio si existe
                if (area.startDate) {
                    yPos += 5;
                    doc.text(`  Inicio: ${this.formatDate(area.startDate)}`, 25, yPos);
                }
                
                yPos += 6;
                
                // Verificar si hay que añadir una nueva página
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
            });
            
            yPos += 5;
        }
        
        return yPos;
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
    }
};