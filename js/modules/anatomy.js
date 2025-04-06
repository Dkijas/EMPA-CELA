// anatomy.js - Módulo para la sección de anatomía

const EMPA_ANATOMY = {
    // Elementos del DOM para la sección de anatomía
    elements: {
        anatomyContainer: null,
        anatomyImageContainer: null,
        anatomyOverlay: null,
        areaDetailsForm: null,
        addAreaBtn: null
    },
    
    // Inicializa el módulo de anatomía
    init: function() {
        console.log('Inicializando módulo de anatomía...');
        
        // Obtener referencias a elementos DOM
        this.elements.anatomyContainer = document.getElementById('anatomy-container');
        this.elements.anatomyImageContainer = document.getElementById('anatomy-image-container');
        this.elements.anatomyOverlay = document.getElementById('anatomy-overlay');
        this.elements.areaDetailsForm = document.getElementById('area-details-form');
        this.elements.addAreaBtn = document.getElementById('add-area-btn');
        
        // Configurar la sección de anatomía
        this.setupAnatomySection();
        
        console.log('Módulo de anatomía inicializado correctamente');
    },
    
    // Función para configurar la sección de anatomía
    setupAnatomySection: function() {
        // Verificar si el contenedor de anatomía existe
        if (!this.elements.anatomyContainer) {
            console.error("No se encontró el contenedor de anatomía");
            return;
        }
        
        // Definir las áreas anatómicas relevantes para ELA
        if (EMPA.anatomyAreas.length === 0) {
            EMPA.anatomyAreas = [
                {
                    name: "Región Bulbar",
                    category: "bulbar",
                    coordinates: { x: 50, y: 15, radius: 8 },
                    description: "Incluye músculos faciales, lengua, mandíbula, paladar, faringe y laringe."
                },
                {
                    name: "Región Cervical",
                    category: "cervical",
                    coordinates: { x: 50, y: 25, radius: 7 },
                    description: "Incluye músculos del cuello, responsables del soporte de la cabeza."
                },
                {
                    name: "Musculatura Respiratoria",
                    category: "respiratoria",
                    coordinates: { x: 50, y: 40, radius: 10 },
                    description: "Incluye diafragma e intercostales, fundamentales para la respiración."
                },
                {
                    name: "Hombro y Brazo Derecho",
                    category: "miembro_superior",
                    coordinates: { x: 65, y: 30, radius: 6 },
                    description: "Incluye deltoides, bíceps, tríceps y músculos del hombro."
                },
                {
                    name: "Hombro y Brazo Izquierdo",
                    category: "miembro_superior",
                    coordinates: { x: 35, y: 30, radius: 6 },
                    description: "Incluye deltoides, bíceps, tríceps y músculos del hombro."
                },
                {
                    name: "Antebrazo y Mano Derecha",
                    category: "miembro_superior",
                    coordinates: { x: 75, y: 40, radius: 5 },
                    description: "Incluye músculos flexores, extensores de la muñeca y dedos."
                },
                {
                    name: "Antebrazo y Mano Izquierda",
                    category: "miembro_superior",
                    coordinates: { x: 25, y: 40, radius: 5 },
                    description: "Incluye músculos flexores, extensores de la muñeca y dedos."
                },
                {
                    name: "Tronco",
                    category: "otra",
                    coordinates: { x: 50, y: 50, radius: 9 },
                    description: "Incluye músculos abdominales, paravertebrales y de la espalda."
                },
                {
                    name: "Cadera y Muslo Derecho",
                    category: "miembro_inferior",
                    coordinates: { x: 60, y: 65, radius: 7 },
                    description: "Incluye glúteos, cuádriceps, isquiotibiales."
                },
                {
                    name: "Cadera y Muslo Izquierdo",
                    category: "miembro_inferior",
                    coordinates: { x: 40, y: 65, radius: 7 },
                    description: "Incluye glúteos, cuádriceps, isquiotibiales."
                },
                {
                    name: "Pierna y Pie Derecho",
                    category: "miembro_inferior",
                    coordinates: { x: 60, y: 85, radius: 6 },
                    description: "Incluye gemelos, tibiales, peroneos y músculos del pie."
                },
                {
                    name: "Pierna y Pie Izquierdo",
                    category: "miembro_inferior",
                    coordinates: { x: 40, y: 85, radius: 6 },
                    description: "Incluye gemelos, tibiales, peroneos y músculos del pie."
                }
            ];
        }
        
        // Crear los círculos para cada área anatómica
        this.createAnatomyAreas();
        
        // Configurar evento para añadir área
        if (this.elements.addAreaBtn) {
            this.elements.addAreaBtn.addEventListener('click', this.addSelectedArea.bind(this));
        }
        
        // Mostrar áreas ya seleccionadas (si las hay)
        this.renderSelectedAreas();
    },
    
    // Función para crear los círculos de las áreas anatómicas
    createAnatomyAreas: function() {
        if (!this.elements.anatomyOverlay) {
            console.error("No se encontró el overlay de anatomía");
            return;
        }
        
        // Limpiar el overlay antes de añadir nuevos elementos
        this.elements.anatomyOverlay.innerHTML = '';
        
        // Crear un círculo para cada área anatómica
        EMPA.anatomyAreas.forEach(area => {
            const circle = document.createElement('div');
            circle.className = 'anatomy-circle';
            
            // Posicionar el círculo
            circle.style.left = `${area.coordinates.x}%`;
            circle.style.top = `${area.coordinates.y}%`;
            circle.style.width = `${area.coordinates.radius * 2}px`;
            circle.style.height = `${area.coordinates.radius * 2}px`;
            circle.style.borderRadius = '50%';
            circle.style.marginLeft = `-${area.coordinates.radius}px`;
            circle.style.marginTop = `-${area.coordinates.radius}px`;
            
            // Añadir datos del área
            circle.dataset.name = area.name;
            circle.dataset.category = area.category;
            circle.dataset.description = area.description;
            
            // Añadir evento de hover para mostrar el nombre del área
            circle.addEventListener('mouseenter', () => {
                EMPA.currentHoveredArea = area;
                this.showAreaTooltip(area, circle);
            });
            
            circle.addEventListener('mouseleave', () => {
                this.hideAreaTooltip();
                EMPA.currentHoveredArea = null;
            });
            
            // Añadir evento para seleccionar el área
            circle.addEventListener('click', () => {
                this.showAreaDetailsForm(area);
            });
            
            // Añadir el círculo al overlay
            this.elements.anatomyOverlay.appendChild(circle);
        });
    },
    
    // Mostrar tooltip con información del área
    showAreaTooltip: function(area, circleElement) {
        let tooltip = document.getElementById('anatomy-tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'anatomy-tooltip';
            tooltip.className = 'anatomy-tooltip';
            document.body.appendChild(tooltip);
        }
        
        // Obtener la posición del elemento en la pantalla
        const rect = circleElement.getBoundingClientRect();
        
        // Establecer contenido y posición del tooltip
        tooltip.innerHTML = `
            <div class="tooltip-title">${area.name}</div>
            <div class="tooltip-description">${area.description}</div>
        `;
        
        tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
        tooltip.style.display = 'block';
    },
    
    // Ocultar el tooltip
    hideAreaTooltip: function() {
        const tooltip = document.getElementById('anatomy-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    },
    
    // Mostrar formulario de detalles del área
    showAreaDetailsForm: function(area) {
        if (!this.elements.areaDetailsForm) {
            console.error("No se encontró el formulario de detalles del área");
            return;
        }
        
        // Establecer nombre y categoría del área
        document.getElementById('area-name').textContent = area.name;
        document.getElementById('area-category').textContent = area.category;
        
        // Mostrar el formulario
        this.elements.areaDetailsForm.style.display = 'block';
        
        // Resetear el formulario al estado inicial
        const addAreaBtn = document.getElementById('add-area-btn');
        addAreaBtn.textContent = 'Añadir área';
        addAreaBtn.setAttribute('data-mode', 'add');
        addAreaBtn.removeAttribute('data-area');
        
        // Mostrar el formulario y hacer scroll hacia él
        this.elements.areaDetailsForm.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Añadir o actualizar área seleccionada
    addSelectedArea: function(e) {
        e.preventDefault();
        
        // Verificar si hay un área seleccionada
        if (!EMPA.currentHoveredArea) {
            console.error("No hay ninguna área seleccionada");
            return;
        }
        
        // Obtener modo (añadir o editar)
        const addAreaBtn = this.elements.addAreaBtn;
        const mode = addAreaBtn.getAttribute('data-mode') || 'add';
        
        // Recopilar datos del formulario
        const severitySelect = document.getElementById('severity-level');
        const evolutionSelect = document.getElementById('evolution-level');
        const startDateInput = document.getElementById('symptom-start-date');
        const functionalImpactSelect = document.getElementById('functional-impact');
        const interventionSelect = document.getElementById('intervention');
        
        // Validar datos
        if (!severitySelect || !evolutionSelect) {
            console.error("Faltan campos requeridos en el formulario");
            return;
        }
        
        // Construir objeto con los datos del área
        const areaData = {
            name: EMPA.currentHoveredArea.name,
            category: EMPA.currentHoveredArea.category,
            coordinates: EMPA.currentHoveredArea.coordinates,
            severity: severitySelect.value,
            evolution: evolutionSelect.value,
            startDate: startDateInput.value,
            functionalImpact: functionalImpactSelect.value,
            intervention: Array.from(interventionSelect.selectedOptions).map(option => option.value)
        };
        
        // Añadir o actualizar el área en la lista de áreas seleccionadas
        if (mode === 'edit') {
            // Buscar y actualizar el área existente
            const areaName = addAreaBtn.getAttribute('data-area');
            const index = EMPA.selectedAreas.findIndex(area => area.name === areaName);
            
            if (index !== -1) {
                EMPA.selectedAreas[index] = areaData;
            }
        } else {
            // Verificar si el área ya existe
            const areaExists = EMPA.selectedAreas.some(area => area.name === areaData.name);
            
            if (areaExists) {
                // Actualizar el área existente
                const index = EMPA.selectedAreas.findIndex(area => area.name === areaData.name);
                EMPA.selectedAreas[index] = areaData;
            } else {
                // Añadir nueva área
                EMPA.selectedAreas.push(areaData);
            }
        }
        
        // Actualizar la visualización de áreas seleccionadas
        this.renderSelectedAreas();
        
        // Ocultar el formulario
        this.elements.areaDetailsForm.style.display = 'none';
        
        // Resetear el área actual
        EMPA.currentHoveredArea = null;
    },
    
    // Renderizar las áreas seleccionadas
    renderSelectedAreas: function() {
        const container = document.getElementById('selected-areas-list');
        if (!container) {
            console.error("No se encontró el contenedor de áreas seleccionadas");
            return;
        }
        
        // Limpiar contenedor
        container.innerHTML = '';
        
        // Agrupar áreas por categoría
        const groupedAreas = {};
        
        EMPA.selectedAreas.forEach(area => {
            if (!groupedAreas[area.category]) {
                groupedAreas[area.category] = [];
            }
            groupedAreas[area.category].push(area);
        });
        
        // Crear elementos para cada categoría y sus áreas
        for (const category in groupedAreas) {
            // Crear cabecera de categoría
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = this.getCategoryName(category);
            container.appendChild(categoryHeader);
            
            // Crear lista de áreas en esta categoría
            const areasList = document.createElement('div');
            areasList.className = 'areas-list';
            
            groupedAreas[category].forEach(area => {
                const areaItem = document.createElement('div');
                areaItem.className = 'area-item';
                
                // Asignar color según nivel de severidad
                let severityColor = '';
                let severityText = '';
                
                switch (area.severity) {
                    case 'leve':
                        severityColor = '#CCB800'; // Amarillo
                        severityText = 'Leve';
                        break;
                    case 'moderado':
                        severityColor = '#CC7000'; // Naranja
                        severityText = 'Moderado';
                        break;
                    case 'severo':
                        severityColor = '#CC0000'; // Rojo
                        severityText = 'Severo';
                        break;
                    default:
                        severityColor = '#CCCCCC'; // Gris
                        severityText = 'No especificado';
                }
                
                // Construir contenido del item
                areaItem.innerHTML = `
                    <div class="area-header">
                        <span class="area-name">${area.name}</span>
                        <div class="area-actions">
                            <button class="btn-edit" data-area="${area.name}">Editar</button>
                            <button class="btn-delete" data-area="${area.name}">Eliminar</button>
                        </div>
                    </div>
                    <div class="area-details">
                        <div class="severity-indicator" style="background-color: ${severityColor}">${severityText}</div>
                        <div class="area-evolution">${this.getEvolutionText(area.evolution)}</div>
                        ${area.startDate ? `<div class="area-start-date">Inicio: ${this.formatDate(area.startDate)}</div>` : ''}
                    </div>
                `;
                
                // Añadir evento para editar
                areaItem.querySelector('.btn-edit').addEventListener('click', () => {
                    this.editArea(area.name);
                });
                
                // Añadir evento para eliminar
                areaItem.querySelector('.btn-delete').addEventListener('click', () => {
                    this.deleteArea(area.name);
                });
                
                areasList.appendChild(areaItem);
            });
            
            container.appendChild(areasList);
        }
        
        // Actualizar círculos en la imagen con los colores correspondientes
        this.updateAnatomyCircles();
    },
    
    // Actualizar la visualización de círculos según los datos de áreas seleccionadas
    updateAnatomyCircles: function() {
        // Recorrer todos los círculos y actualizar sus estilos según el área seleccionada
        const circles = document.querySelectorAll('.anatomy-circle');
        
        circles.forEach(circle => {
            const areaName = circle.dataset.name;
            
            // Buscar si el área está en las seleccionadas
            const selectedArea = EMPA.selectedAreas.find(area => area.name === areaName);
            
            if (selectedArea) {
                // Aplicar estilo según la severidad
                switch (selectedArea.severity) {
                    case 'leve':
                        circle.style.backgroundColor = 'rgba(204, 184, 0, 0.7)'; // Amarillo
                        break;
                    case 'moderado':
                        circle.style.backgroundColor = 'rgba(204, 112, 0, 0.7)'; // Naranja
                        break;
                    case 'severo':
                        circle.style.backgroundColor = 'rgba(204, 0, 0, 0.7)'; // Rojo
                        break;
                    default:
                        circle.style.backgroundColor = 'rgba(100, 100, 100, 0.3)'; // Gris por defecto
                }
                
                // Añadir borde para indicar selección
                circle.style.border = '2px solid white';
            } else {
                // Estilo para círculos no seleccionados
                circle.style.backgroundColor = 'rgba(100, 100, 100, 0.3)';
                circle.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            }
        });
    },
    
    // Función para editar un área seleccionada
    editArea: function(areaName) {
        // Buscar el área en la lista de áreas seleccionadas
        const selectedArea = EMPA.selectedAreas.find(area => area.name === areaName);
        if (!selectedArea) {
            console.error(`No se pudo encontrar el área "${areaName}" para editar`);
            return;
        }
        
        // Buscar el área original en la lista de anatomyAreas para recuperar las coordenadas
        const originalArea = EMPA.anatomyAreas.find(area => area.name === areaName);
        if (!originalArea) {
            console.error(`No se pudo encontrar la definición original del área "${areaName}"`);
            return;
        }
        
        console.log("Área encontrada para editar:", selectedArea);
        
        // Rellenar el formulario con los datos del área seleccionada
        document.getElementById('area-name').textContent = selectedArea.name;
        document.getElementById('area-category').textContent = selectedArea.category;
        
        // Establecer el nivel de severidad
        const severitySelect = document.getElementById('severity-level');
        if (severitySelect) {
            for (let i = 0; i < severitySelect.options.length; i++) {
                if (severitySelect.options[i].value === selectedArea.severity) {
                    severitySelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Establecer el nivel de evolución
        const evolutionSelect = document.getElementById('evolution-level');
        if (evolutionSelect) {
            for (let i = 0; i < evolutionSelect.options.length; i++) {
                if (evolutionSelect.options[i].value === selectedArea.evolution) {
                    evolutionSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Establecer la fecha de inicio
        document.getElementById('symptom-start-date').value = selectedArea.startDate || '';
        
        // Establecer el impacto funcional
        document.getElementById('functional-impact').value = selectedArea.functionalImpact || 'sin-impacto';
        
        // Establecer las intervenciones (selección múltiple)
        const interventionSelect = document.getElementById('intervention');
        if (interventionSelect && selectedArea.intervention) {
            // Desmarcar todas las opciones primero
            Array.from(interventionSelect.options).forEach(option => option.selected = false);
            
            // Marcar las opciones que están en el área seleccionada
            selectedArea.intervention.forEach(interventionValue => {
                for (let i = 0; i < interventionSelect.options.length; i++) {
                    if (interventionSelect.options[i].value === interventionValue) {
                        interventionSelect.options[i].selected = true;
                    }
                }
            });
        }
        
        // Actualizar el botón para que indique que es una edición
        const addAreaBtn = document.getElementById('add-area-btn');
        addAreaBtn.textContent = 'Actualizar área';
        addAreaBtn.setAttribute('data-mode', 'edit');
        addAreaBtn.setAttribute('data-area', areaName);
        
        // Mostrar el formulario de detalles del área
        document.getElementById('area-details-form').style.display = 'block';
        
        // Establecer el área actual para que addSelectedArea sepa que estamos editando
        EMPA.currentHoveredArea = originalArea;
        
        // Hacer scroll hacia el formulario para que el usuario lo vea
        document.getElementById('area-details-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    
    // Función para eliminar un área seleccionada
    deleteArea: function(areaName) {
        // Confirmar la eliminación
        if (confirm(`¿Está seguro de que desea eliminar el área "${areaName}"?`)) {
            // Filtrar el área de la lista de áreas seleccionadas
            EMPA.selectedAreas = EMPA.selectedAreas.filter(area => area.name !== areaName);
            
            // Actualizar la visualización
            this.renderSelectedAreas();
        }
    },
    
    // Función para obtener el nombre legible de la categoría
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
    
    // Función para obtener el texto de la evolución
    getEvolutionText: function(evolution) {
        switch (evolution) {
            case 'estable':
                return 'Estable';
            case 'mejoria':
                return `<span class="change-better">Mejora ${'+'}</span>`;
            case 'empeoramiento':
                return `<span class="change-worse">Empeoramiento ${'-'}</span>`;
            default:
                return 'No especificado';
        }
    },
    
    // Formatear fecha para mostrar
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    },
    
    // Llamado cuando se activa la pestaña de anatomía
    onTabActivated: function() {
        console.log('Tab de anatomía activado');
        
        // Asegurarse de que los círculos estén actualizados
        this.updateAnatomyCircles();
    }
}; 