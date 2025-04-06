// anatomy.js - Módulo para la sección de anatomía

const EMPA_ANATOMY = {
    // Elementos del DOM para la sección de anatomía
    elements: {
        anatomyContainer: null,
        anatomyImageContainer: null,
        anatomyImage: null,
        anatomyOverlay: null,
        areaDetailsForm: null,
        btnSaveArea: null,
        btnCancelArea: null
    },
    
    // Inicializa el módulo de anatomía
    init: function() {
        console.log('Inicializando módulo de anatomía...');
        
        // Obtener referencias a elementos DOM
        this.elements.anatomyContainer = document.getElementById('anatomy-container');
        this.elements.anatomyImageContainer = document.getElementById('anatomy-image-container');
        this.elements.anatomyImage = document.getElementById('anatomy-image');
        this.elements.anatomyOverlay = document.getElementById('anatomy-overlay');
        this.elements.areaDetailsForm = document.getElementById('area-details-form');
        this.elements.btnSaveArea = document.getElementById('btn-save-area');
        this.elements.btnCancelArea = document.getElementById('btn-cancel-area');
        
        // Añadir estilos CSS necesarios para los marcadores
        this.addRequiredStyles();
        
        // Log para depuración
        console.log('Elementos DOM de anatomía:', {
            container: this.elements.anatomyContainer,
            imageContainer: this.elements.anatomyImageContainer,
            image: this.elements.anatomyImage,
            overlay: this.elements.anatomyOverlay,
            detailsForm: this.elements.areaDetailsForm,
            saveBtn: this.elements.btnSaveArea,
            cancelBtn: this.elements.btnCancelArea
        });
        
        // Configurar la sección de anatomía con el comportamiento original
        this.setupAnatomySection();
        
        console.log('Módulo de anatomía inicializado correctamente');
    },
    
    // Añadir estilos CSS necesarios para el módulo
    addRequiredStyles: function() {
        // Verificar si los estilos ya existen
        if (document.getElementById('anatomy-module-styles')) return;
        
        // Crear elemento de estilo
        const styleElem = document.createElement('style');
        styleElem.id = 'anatomy-module-styles';
        
        // Definir los estilos necesarios
        styleElem.textContent = `
            /* Estilos para el indicador de cursor */
            .cursor-highlight {
                position: absolute;
                width: 24px;
                height: 24px;
                background-color: rgba(0, 120, 255, 0.3);
                border: 2px solid rgba(0, 120, 255, 0.8);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 15;
                box-shadow: 0 0 5px rgba(0, 120, 255, 0.5);
            }
            
            /* Estilos para el marcador temporal */
            #temp-marker {
                position: absolute;
                width: 20px;
                height: 20px;
                background-color: rgba(0, 150, 255, 0.5);
                border: 2px solid rgba(0, 150, 255, 0.8);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: 30;
                box-shadow: 0 0 10px rgba(0, 150, 255, 0.7);
            }
            
            /* Estilos para los marcadores de gravedad */
            .anatomy-marker {
                position: absolute;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                cursor: pointer;
                z-index: 20;
            }
            
            .marker-leve {
                background-color: rgba(204, 184, 0, 0.6);
                border: 2px solid rgba(204, 184, 0, 0.9);
                box-shadow: 0 0 6px rgba(204, 184, 0, 0.7);
            }
            
            .marker-moderada {
                background-color: rgba(204, 112, 0, 0.6);
                border: 2px solid rgba(204, 112, 0, 0.9);
                box-shadow: 0 0 6px rgba(204, 112, 0, 0.7);
            }
            
            .marker-grave {
                background-color: rgba(204, 0, 0, 0.6);
                border: 2px solid rgba(204, 0, 0, 0.9);
                box-shadow: 0 0 6px rgba(204, 0, 0, 0.7);
            }
            
            /* Estilos para la lista de áreas seleccionadas */
            .area-item {
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-bottom: 10px;
                background-color: #f9f9f9;
            }
            
            .area-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background-color: #f0f0f0;
                border-bottom: 1px solid #ddd;
            }
            
            .area-name {
                font-weight: bold;
                margin-right: 8px;
            }
            
            .area-coords {
                color: #666;
                font-size: 12px;
            }
            
            .area-actions {
                display: flex;
            }
            
            .btn-edit, .btn-delete {
                padding: 2px 8px;
                margin-left: 5px;
                border: 1px solid;
                border-radius: 3px;
                background: none;
                cursor: pointer;
                font-size: 12px;
            }
            
            .btn-edit {
                border-color: #0275d8;
                color: #0275d8;
            }
            
            .btn-delete {
                border-color: #d9534f;
                color: #d9534f;
            }
            
            .area-details {
                padding: 8px 12px;
            }
            
            .area-severity {
                display: flex;
                align-items: center;
                margin-bottom: 6px;
            }
            
            .severity-indicator {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 3px;
                color: white;
                font-weight: bold;
                margin-left: 5px;
            }
            
            strong {
                font-weight: bold;
                margin-right: 4px;
            }
            
            .severity-leve {
                background-color: #CCB800;
            }
            
            .severity-moderada, .severity-moderado {
                background-color: #CC7000;
            }
            
            .severity-grave, .severity-severo {
                background-color: #CC0000;
            }
            
            .area-evolution, .area-start-date, .area-impact, .area-interventions {
                margin: 3px 0;
                font-size: 13px;
            }
            
            .change-better {
                color: green;
            }
            
            .change-worse {
                color: red;
            }
            
            .intervention-title {
                font-weight: bold;
            }
        `;
        
        // Añadir al head del documento
        document.head.appendChild(styleElem);
    },
    
    // Función para configurar la sección de anatomía
    setupAnatomySection: function() {
        try {
            console.log('Configurando sección de anatomía...');
            
            // Limpiar cualquier marcador existente
            this.cleanupAllMarkers();
            
            // Asegurarse de que el contenedor existe
            if (!this.elements.anatomyContainer) {
                console.error('No se encontró el contenedor de anatomía');
                return;
            }
            
            // Asegurarse de que la imagen existe
            if (!this.elements.anatomyImageContainer) {
                console.error('No se encontró la imagen de anatomía');
                return;
            }
            
            // Configurar el contenedor y sobreposición al tamaño de la imagen
            const img = this.elements.anatomyImageContainer.querySelector('img');
            const overlay = this.elements.anatomyOverlay;
            
            // Configurar evento para cuando la imagen esté cargada
            img.onload = () => {
                console.log('Imagen anatómica cargada correctamente');
                this.updateAnatomyOverlay();
            };
            
            // Si ya está cargada, actualizar ahora
            if (img.complete) {
                console.log('Imagen anatómica ya estaba cargada');
                this.updateAnatomyOverlay();
            }
            
            // Reconfigurar overlay si la ventana cambia de tamaño
            window.addEventListener('resize', () => {
                this.updateAnatomyOverlay();
            });
            
            // Configurar evento de clic en la sobreposición
            overlay.addEventListener('click', this.handleOverlayClick.bind(this));
            
            // Configurar evento de movimiento del ratón
            overlay.addEventListener('mousemove', this.handleMouseMove.bind(this));
            
            // Evento cuando el ratón sale del área
            overlay.addEventListener('mouseleave', () => {
                if (this.elements.cursorIndicator) {
                    this.elements.cursorIndicator.style.display = 'none';
                }
            });
            
            // Actualizar marcadores de anatomía
            this.updateAnatomyMarkers();
            
            console.log('Sección de anatomía configurada correctamente');
        } catch (error) {
            console.error('Error al configurar la sección de anatomía:', error);
        }
    },
    
    // Actualizar sobreposición de anatomía
    updateAnatomyOverlay: function() {
        try {
            if (!this.elements.anatomyImageContainer || !this.elements.anatomyOverlay) {
                console.error('Elementos de anatomía no disponibles para actualizar overlay');
                return;
            }
            
            const img = this.elements.anatomyImageContainer.querySelector('img');
            const overlay = this.elements.anatomyOverlay;
            
            // Actualizar el tamaño del overlay al tamaño actual de la imagen
            overlay.style.width = img.offsetWidth + 'px';
            overlay.style.height = img.offsetHeight + 'px';
            
            console.log(`Overlay actualizado a: ${img.offsetWidth}x${img.offsetHeight}`);
        } catch (error) {
            console.error('Error al actualizar la sobreposición de anatomía:', error);
        }
    },
    
    // Manejador del evento click en el overlay
    handleOverlayClick: function(event) {
        // Calcular posición relativa al contenedor
        const rect = this.elements.anatomyOverlay.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        console.log('Click detectado en overlay:', x, y);
        
        // Comprobar si hay un área cercana existente
        const nearbyArea = this.checkForNearbyArea(x, y);
        if (nearbyArea) {
            console.log('Área cercana encontrada:', nearbyArea);
            this.editArea(nearbyArea.index);
            return;
        }
        
        // Crear marcador temporal
        this.createTempArea(x, y);
        
        // Mostrar formulario para agregar área
        this.showAreaDetailsForm(x, y);
    },
    
    // Manejador del evento mousemove en el overlay
    handleMouseMove: function(event) {
        // Calcular posición relativa al contenedor
        const rect = this.elements.anatomyOverlay.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Actualizar indicador del cursor
        this.updateCursorIndicator(x, y);
    },
    
    // Manejador del evento mouseleave en el overlay
    handleMouseLeave: function() {
        // Eliminar el indicador del cursor cuando el ratón sale del área
        const cursorIndicator = document.querySelector('.cursor-highlight');
        if (cursorIndicator) {
            cursorIndicator.remove();
        }
    },
    
    // Limpia todos los marcadores y elementos relacionados
    cleanupAllMarkers: function() {
        console.log('Limpiando todos los marcadores...');
        
        // Eliminar el indicador del cursor
        const cursorIndicator = document.querySelector('.cursor-highlight');
        if (cursorIndicator) {
            cursorIndicator.remove();
        }
        
        // Eliminar marcador temporal
        const tempMarker = document.getElementById('temp-marker');
        if (tempMarker) {
            tempMarker.remove();
        }
        
        // Eliminar todos los marcadores de anatomía
        const markers = document.querySelectorAll('.anatomy-marker');
        markers.forEach(marker => marker.remove());
        
        console.log('Todos los marcadores eliminados');
    },
    
    // Ajustar el overlay para que coincida exactamente con la imagen
    adjustOverlay: function() {
        const anatomyImage = document.getElementById('anatomia-img');
        if (!anatomyImage || !this.elements.anatomyOverlay) return;
        
        const imgRect = anatomyImage.getBoundingClientRect();
        const overlay = this.elements.anatomyOverlay;
        
        // Garantizar que el overlay coincida exactamente con la imagen
        overlay.style.width = `${imgRect.width}px`;
        overlay.style.height = `${imgRect.height}px`;
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        
        // Eliminar cualquier transformación que pueda afectar al posicionamiento
        overlay.style.transform = 'none';
        
        console.log('Overlay ajustado a dimensiones:', imgRect.width, 'x', imgRect.height);
    },
    
    // Crear un marcador temporal en la posición del clic
    createTemporaryMarker: function(x, y) {
        // Eliminar marcador anterior si existe
        this.removeTemporaryMarker();
        
        // Obtener dimensiones del overlay
        const overlay = this.elements.anatomyOverlay;
        if (!overlay) return;
        
        // Convertir coordenadas de porcentaje a píxeles (si son porcentajes)
        const xPx = x > 0 && x <= 100 ? (x / 100) * overlay.offsetWidth : x;
        const yPx = y > 0 && y <= 100 ? (y / 100) * overlay.offsetHeight : y;
        
        // Crear nuevo marcador
        const marker = document.createElement('div');
        marker.id = 'temp-marker';
        marker.className = 'anatomy-marker';
        
        // Usar posición absoluta con píxeles
        marker.style.position = 'absolute';
        marker.style.left = `${xPx}px`;
        marker.style.top = `${yPx}px`;
        marker.style.transform = 'translate(-50%, -50%)';
        
        // Estilo visual
        marker.style.backgroundColor = 'rgba(0, 150, 255, 0.5)';
        marker.style.borderColor = 'rgba(0, 150, 255, 0.8)';
        marker.style.width = '18px';
        marker.style.height = '18px';
        marker.style.zIndex = '30';
        marker.style.boxShadow = '0 0 10px rgba(0, 150, 255, 0.7)';
        
        // Registrar coordenadas originales
        marker.dataset.originalX = x;
        marker.dataset.originalY = y;
        
        // Agregar al overlay
        this.elements.anatomyOverlay.appendChild(marker);
        
        console.log(`Marcador temporal creado en (${xPx}px, ${yPx}px) - Coords originales: (${x}, ${y})`);
    },
    
    // Eliminar el marcador temporal
    removeTemporaryMarker: function() {
        const marker = document.getElementById('temp-marker');
        if (marker) {
            marker.remove();
        }
    },
    
    // Actualizar el indicador de cursor
    updateCursorIndicator: function(x, y) {
        // Eliminar cualquier indicador existente para evitar duplicados
        const existingIndicator = document.querySelector('.cursor-highlight');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Crear un nuevo indicador del cursor si aún no existe
        const cursorIndicator = document.createElement('div');
        cursorIndicator.className = 'cursor-highlight';
        cursorIndicator.style.left = x + 'px';
        cursorIndicator.style.top = y + 'px';
        cursorIndicator.style.display = 'block';
        
        // Agregar el indicador al overlay
        if (this.elements.anatomyOverlay) {
            this.elements.anatomyOverlay.appendChild(cursorIndicator);
            console.log('Indicador de cursor actualizado en posición:', x, y);
        } else {
            console.error('No se pudo encontrar el overlay de anatomía');
        }
    },
    
    // Eliminar el indicador de cursor
    removeCursorIndicator: function() {
        const indicator = document.getElementById('cursor-indicator');
        if (indicator) {
            indicator.remove();
        }
    },
    
    // Muestra el formulario para añadir detalles del área
    showAreaDetailsForm: function(x, y) {
        console.log('Mostrando formulario para área en:', x, y);
        
        if (!this.elements.areaDetailsForm) {
            console.error('Formulario de detalles no encontrado');
            return;
        }
        
        // Convertir coordenadas a porcentajes para almacenamiento
        const overlay = this.elements.anatomyOverlay;
        if (!overlay) return;
        
        const xPercent = (x / overlay.offsetWidth) * 100;
        const yPercent = (y / overlay.offsetHeight) * 100;
        
        // Guardar temporalmente las coordenadas en el formulario
        this.elements.areaDetailsForm.dataset.tempX = xPercent;
        this.elements.areaDetailsForm.dataset.tempY = yPercent;
        
        // Configurar el formulario con los IDs correctos según el HTML
        const nameContainer = document.getElementById('custom-name-container');
        const customNameInput = document.getElementById('custom-area-name');
        const nameSpan = document.getElementById('area-name');
        const categorySpan = document.getElementById('area-category');
        const severitySelect = document.getElementById('severity-level');
        const evolutionSelect = document.getElementById('evolution-level');
        const startDateInput = document.getElementById('symptom-start-date');
        const functionalImpactSelect = document.getElementById('functional-impact');
        const interventionSelect = document.getElementById('intervention');
        
        // Mostrar el campo para nombre personalizado
        if (nameContainer) {
            nameContainer.style.display = 'block';
        }
        
        // Establecer valores por defecto
        if (customNameInput) customNameInput.value = '';
        if (nameSpan) nameSpan.textContent = 'Área personalizada';
        if (categorySpan) categorySpan.textContent = 'Área Personalizada';
        if (severitySelect) severitySelect.value = 'leve';
        if (evolutionSelect) evolutionSelect.value = 'estable';
        if (startDateInput) startDateInput.value = new Date().toISOString().split('T')[0];
        if (functionalImpactSelect) functionalImpactSelect.value = 'sin-impacto';
        
        // Desseleccionar todas las opciones en el select múltiple
        if (interventionSelect) {
            Array.from(interventionSelect.options).forEach(option => {
                option.selected = false;
            });
            // Seleccionar la primera opción por defecto
            if (interventionSelect.options.length > 0) {
                interventionSelect.options[0].selected = true;
            }
        }
        
        // Mostrar formulario y posicionarlo cerca del área seleccionada
        this.elements.areaDetailsForm.style.display = 'block';
        
        // Configurar los botones del formulario
        const saveButton = this.elements.btnSaveArea;
        if (saveButton) {
            // Configurar como modo añadir
            saveButton.textContent = 'Guardar';
            saveButton.setAttribute('data-mode', 'add');
            saveButton.removeAttribute('data-area');
            
            // Eliminar eventos anteriores para evitar duplicados
            if (this._handleAddArea) {
                saveButton.removeEventListener('click', this._handleAddArea);
            }
            
            // Crear nueva referencia para el manejador
            this._handleAddArea = (e) => {
                e.preventDefault();
                this.addSelectedArea();
            };
            saveButton.addEventListener('click', this._handleAddArea);
        }
        
        const cancelButton = this.elements.btnCancelArea;
        if (cancelButton) {
            // Eliminar eventos anteriores para evitar duplicados
            if (this._handleCancelArea) {
                cancelButton.removeEventListener('click', this._handleCancelArea);
            }
            
            // Crear nueva referencia para el manejador
            this._handleCancelArea = (e) => {
                e.preventDefault();
                this.elements.areaDetailsForm.style.display = 'none';
                const tempMarker = document.getElementById('temp-marker');
                if (tempMarker) tempMarker.remove();
            };
            cancelButton.addEventListener('click', this._handleCancelArea);
        }
        
        // Hacer scroll para que el formulario sea visible
        this.elements.areaDetailsForm.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Añadir o actualizar área seleccionada
    addSelectedArea: function() {
        console.log('Añadiendo área seleccionada');
        
        // Verificar que el formulario está disponible
        if (!this.elements.areaDetailsForm) {
            console.error('Formulario de detalles no encontrado');
            return;
        }
        
        // Obtener valores del formulario con los IDs correctos según el HTML
        const customNameInput = document.getElementById('custom-area-name');
        const severitySelect = document.getElementById('severity-level');
        const evolutionSelect = document.getElementById('evolution-level');
        const startDateInput = document.getElementById('symptom-start-date');
        const functionalImpactSelect = document.getElementById('functional-impact');
        const interventionSelect = document.getElementById('intervention');
        
        // Validar campos obligatorios
        if (!severitySelect) {
            console.error('Campos obligatorios no encontrados en el formulario');
            return;
        }
        
        // Obtener el nombre personalizado si existe
        let name = 'Área personalizada';
        if (customNameInput && customNameInput.value.trim() !== '') {
            name = customNameInput.value.trim();
        }
        
        // Obtener otros valores y asegurar valores predeterminados
        const severity = (severitySelect && severitySelect.value) ? severitySelect.value : 'leve';
        const evolution = (evolutionSelect && evolutionSelect.value) ? evolutionSelect.value : 'estable';
        const startDate = (startDateInput && startDateInput.value) ? startDateInput.value : '';
        const functionalImpact = (functionalImpactSelect && functionalImpactSelect.value) ? functionalImpactSelect.value : 'sin-impacto';
        
        // Obtener intervenciones seleccionadas (es un select múltiple)
        let interventions = [];
        if (interventionSelect) {
            interventions = Array.from(interventionSelect.selectedOptions).map(option => option.value);
        }
        
        // Obtener coordenadas del marcador temporal
        const tempMarker = document.getElementById('temp-marker');
        let x, y;
        
        if (tempMarker) {
            // Usar coordenadas del marcador temporal si existe
            x = parseFloat(tempMarker.dataset.x);
            y = parseFloat(tempMarker.dataset.y);
        } else {
            // Usar coordenadas almacenadas en el formulario como respaldo
            x = parseFloat(this.elements.areaDetailsForm.dataset.tempX);
            y = parseFloat(this.elements.areaDetailsForm.dataset.tempY);
        }
        
        // Convertir coordenadas a porcentajes para almacenamiento
        const overlay = this.elements.anatomyOverlay;
        if (!overlay) {
            console.error('Overlay no encontrado');
            return;
        }
        
        const xPercent = tempMarker ? 
            (x / overlay.offsetWidth) * 100 : 
            parseFloat(this.elements.areaDetailsForm.dataset.tempX);
            
        const yPercent = tempMarker ? 
            (y / overlay.offsetHeight) * 100 : 
            parseFloat(this.elements.areaDetailsForm.dataset.tempY);
        
        // Crear objeto de área
        const areaData = {
            name: name,
            category: "personalizada",
            coordinates: { 
                x: xPercent, 
                y: yPercent, 
                radius: 8 
            },
            severity: severity,
            evolution: evolution,
            startDate: startDate,
            functionalImpact: functionalImpact,
            intervention: interventions,
            description: "Área definida por el usuario"
        };
        
        console.log('Nueva área creada:', areaData);
        
        // Determinar si estamos en modo edición o adición
        const saveButton = this.elements.btnSaveArea;
        const mode = saveButton ? saveButton.getAttribute('data-mode') || 'add' : 'add';
        const editIndex = parseInt(this.elements.areaDetailsForm.dataset.editIndex);
        
        if (mode === 'edit' && !isNaN(editIndex) && editIndex >= 0 && editIndex < this.selectedAreas.length) {
            // Actualizar área existente
            this.selectedAreas[editIndex] = areaData;
            console.log('Área actualizada en índice:', editIndex);
        } else {
            // Añadir a las áreas seleccionadas
            if (!this.selectedAreas) {
                this.selectedAreas = [];
            }
            
            // Verificar si hay un área cercana para evitar duplicados
            const existsNearby = this.selectedAreas.some(area => {
                const dx = area.coordinates.x - areaData.coordinates.x;
                const dy = area.coordinates.y - areaData.coordinates.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                return distance < 5; // 5% de tolerancia
            });
            
            if (existsNearby) {
                if (!confirm("Ya existe un área cercana a estas coordenadas. ¿Desea añadir otra área muy próxima?")) {
                    return;
                }
            }
            
            this.selectedAreas.push(areaData);
            console.log('Nueva área añadida');
        }
        
        // Actualizar la visualización
        this.renderSelectedAreas();
        this.updateAnatomyMarkers();
        
        // Limpiar y ocultar el formulario
        this.elements.areaDetailsForm.style.display = 'none';
        
        // Eliminar el marcador temporal
        if (tempMarker) {
            tempMarker.remove();
        }
        
        // Restaurar botón a modo añadir
        if (saveButton) {
            saveButton.textContent = 'Guardar';
            saveButton.setAttribute('data-mode', 'add');
            saveButton.removeAttribute('data-area-index');
        }
        
        console.log('Área procesada correctamente. Total áreas:', this.selectedAreas.length);
        
        // También actualizar las áreas en el objeto global EMPA si existe
        if (typeof EMPA !== 'undefined') {
            EMPA.selectedAreas = this.selectedAreas;
        }
        
        // Actualizar gráfico de progresión si está disponible
        this.updateProgressionChart();
    },
    
    // Actualiza el gráfico de progresión con los datos actuales
    updateProgressionChart: function() {
        if (typeof EMPA_PROGRESSION !== 'undefined' && EMPA_PROGRESSION.getProgressionFromSelectedAreas) {
            console.log('Actualizando gráfico de progresión con áreas seleccionadas');
            EMPA_PROGRESSION.getProgressionFromSelectedAreas();
        } else {
            console.log('El módulo de progresión no está disponible');
        }
    },
    
    // Renderiza las áreas seleccionadas en la lista
    renderSelectedAreas: function() {
        console.log('Renderizando áreas seleccionadas');
        
        // Verificar que tenemos las áreas seleccionadas
        if (!this.selectedAreas) {
            console.log('No hay áreas seleccionadas para renderizar');
            return;
        }
        
        // Encontrar el contenedor donde se mostrarán las áreas
        const selectedAreasContainer = document.getElementById('selected-areas-list');
        if (!selectedAreasContainer) {
            console.error('No se encontró el contenedor para las áreas seleccionadas');
            return;
        }
        
        // Limpiar el contenedor
        selectedAreasContainer.innerHTML = '';
        
        // Verificar si hay áreas para mostrar
        if (this.selectedAreas.length === 0) {
            selectedAreasContainer.innerHTML = '<p class="text-muted">No hay áreas seleccionadas</p>';
            return;
        }
        
        // Agregar cada área a la lista
        this.selectedAreas.forEach((area, index) => {
            const areaItem = document.createElement('div');
            areaItem.className = 'area-item';
            
            // Contenedor principal de información
            const infoContainer = document.createElement('div');
            infoContainer.className = 'area-info';
            
            // Cabecera con nombre y botones
            const headerDiv = document.createElement('div');
            headerDiv.className = 'area-header';
            
            // Nombre del área
            const nameSpan = document.createElement('span');
            nameSpan.className = 'area-name';
            nameSpan.textContent = area.name || 'Área personalizada';
            headerDiv.appendChild(nameSpan);
            
            // Botones de acción
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'area-actions';
            
            // Botón editar
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-edit';
            editBtn.textContent = 'Editar';
            editBtn.setAttribute('data-area', area.name);
            editBtn.onclick = () => this.editArea(index);
            actionsDiv.appendChild(editBtn);
            
            // Botón eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.setAttribute('data-area', area.name);
            deleteBtn.onclick = () => this.deleteArea(index);
            actionsDiv.appendChild(deleteBtn);
            
            headerDiv.appendChild(actionsDiv);
            infoContainer.appendChild(headerDiv);
            
            // Detalles del área
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'area-details';
            
            // Severidad - siempre mostrar un indicador de severidad con etiqueta
            const severityDiv = document.createElement('div');
            severityDiv.className = 'area-severity';
            
            const severityValue = area.severity || 'leve'; // Usar 'leve' como valor predeterminado
            const severityLabel = document.createElement('div');
            severityLabel.className = `severity-indicator severity-${severityValue}`;
            severityLabel.textContent = this.getSeverityLabel(severityValue);
            
            // Añadir etiqueta y valor
            severityDiv.innerHTML = '<strong>Severidad:</strong> ';
            severityDiv.appendChild(severityLabel);
            
            detailsDiv.appendChild(severityDiv);
            
            // Evolución
            if (area.evolution) {
                const evolutionDiv = document.createElement('div');
                evolutionDiv.className = 'area-evolution';
                evolutionDiv.innerHTML = '<strong>Evolución:</strong> ' + this.getEvolutionText(area.evolution);
                detailsDiv.appendChild(evolutionDiv);
            }
            
            // Fecha de inicio
            if (area.startDate) {
                const startDateDiv = document.createElement('div');
                startDateDiv.className = 'area-start-date';
                startDateDiv.textContent = 'Inicio: ' + this.formatDate(area.startDate);
                detailsDiv.appendChild(startDateDiv);
            }
            
            // Impacto funcional
            if (area.functionalImpact) {
                const impactDiv = document.createElement('div');
                impactDiv.className = 'area-impact';
                impactDiv.textContent = 'Impacto: ' + this.getFunctionalImpactText(area.functionalImpact);
                detailsDiv.appendChild(impactDiv);
            }
            
            // Intervenciones recomendadas
            if (area.intervention && area.intervention.length > 0) {
                const interventionsDiv = document.createElement('div');
                interventionsDiv.className = 'area-interventions';
                interventionsDiv.innerHTML = '<strong>Intervenciones:</strong> ' + area.intervention.map(i => this.getInterventionText(i)).join(', ');
                detailsDiv.appendChild(interventionsDiv);
            }
            
            infoContainer.appendChild(detailsDiv);
            areaItem.appendChild(infoContainer);
            
            // Añadir el elemento completo a la lista
            selectedAreasContainer.appendChild(areaItem);
        });
        
        console.log('Áreas seleccionadas renderizadas:', this.selectedAreas.length);
    },
    
    // Obtiene la etiqueta para la severidad
    getSeverityLabel: function(severity) {
        switch (severity) {
            case 'leve': return 'Leve';
            case 'moderada': return 'Moderada';
            case 'moderado': return 'Moderada';
            case 'grave': return 'Grave';
            case 'severo': return 'Grave';
            case 'severa': return 'Grave';
            default: return 'Leve';
        }
    },
    
    // Obtiene la clase CSS para la severidad
    getSeverityClass: function(severity) {
        switch (severity) {
            case 'leve': return 'warning';
            case 'moderada': return 'orange'; 
            case 'moderado': return 'orange';
            case 'grave': return 'danger';
            case 'severo': return 'danger';
            case 'severa': return 'danger';
            default: return 'warning';
        }
    },
    
    // Elimina un área por su índice
    deleteArea: function(index) {
        if (confirm('¿Está seguro de que desea eliminar esta área?')) {
            // Verificar que el índice sea válido
            if (index >= 0 && index < this.selectedAreas.length) {
                // Eliminar el área
                this.selectedAreas.splice(index, 1);
                
                // Actualizar la visualización
                this.renderSelectedAreas();
                this.updateAnatomyMarkers();
                
                // También actualizar las áreas en el objeto global EMPA si existe
                if (typeof EMPA !== 'undefined') {
                    EMPA.selectedAreas = this.selectedAreas;
                }
                
                // Actualizar gráfico de progresión
                this.updateProgressionChart();
                
                console.log('Área eliminada. Quedan:', this.selectedAreas.length);
            }
        }
    },
    
    // Edita un área existente
    editArea: function(index) {
        console.log('Editando área con índice:', index);
        
        // Verificar que el índice es válido y que el área existe
        if (index < 0 || index >= this.selectedAreas.length) {
            console.error('Índice de área inválido:', index);
            return;
        }
        
        const area = this.selectedAreas[index];
        if (!area) {
            console.error('Área no encontrada en el índice:', index);
            return;
        }
        
        console.log('Área a editar:', area);
        
        // Obtener referencias a elementos del formulario
        const form = this.elements.areaDetailsForm;
        const customNameInput = document.getElementById('custom-area-name');
        const nameSpan = document.getElementById('area-name');
        const categorySpan = document.getElementById('area-category');
        const severitySelect = document.getElementById('severity-level');
        const evolutionSelect = document.getElementById('evolution-level');
        const startDateInput = document.getElementById('symptom-start-date');
        const functionalImpactSelect = document.getElementById('functional-impact');
        const interventionSelect = document.getElementById('intervention');
        
        if (!form) {
            console.error('Formulario de detalles no encontrado');
            return;
        }
        
        // Almacenar el índice del área en el formulario para usarlo al guardar
        form.dataset.editIndex = index;
        form.style.display = 'block';
        
        // Mostrar el nombre del área si está disponible
        if (nameSpan) {
            nameSpan.textContent = area.name || 'Área personalizada';
        }
        
        // Mostrar la categoría
        if (categorySpan) {
            categorySpan.textContent = 'Área Personalizada';
        }
        
        // Si es un área personalizada, permitir editar el nombre
        const nameContainer = document.getElementById('custom-name-container');
        if (nameContainer) {
            nameContainer.style.display = 'block';
            if (customNameInput) {
                customNameInput.value = area.name || '';
            }
        }
        
        // Establecer valores en los campos del formulario
        if (severitySelect) severitySelect.value = area.severity || 'leve';
        if (evolutionSelect) evolutionSelect.value = area.evolution || 'estable';
        if (startDateInput) startDateInput.value = area.startDate || new Date().toISOString().split('T')[0];
        if (functionalImpactSelect) functionalImpactSelect.value = area.functionalImpact || 'sin-impacto';
        
        // Establecer intervenciones seleccionadas
        if (interventionSelect && area.intervention && Array.isArray(area.intervention)) {
            // Primero deseleccionar todas las opciones
            Array.from(interventionSelect.options).forEach(option => {
                option.selected = false;
            });
            
            // Luego seleccionar las intervenciones que correspondan
            area.intervention.forEach(intervention => {
                const option = Array.from(interventionSelect.options).find(opt => opt.value === intervention);
                if (option) option.selected = true;
            });
        }
        
        // Cambiar el botón de añadir a actualizar
        const saveButton = this.elements.btnSaveArea;
        if (saveButton) {
            saveButton.textContent = 'Actualizar';
            saveButton.setAttribute('data-mode', 'edit');
            saveButton.setAttribute('data-area-index', index);
            
            // Eliminar eventos anteriores para evitar duplicados
            if (this._handleAddArea) {
                saveButton.removeEventListener('click', this._handleAddArea);
            }
            if (this._handleUpdateArea) {
                saveButton.removeEventListener('click', this._handleUpdateArea);
            }
            
            // Crear nuevo manejador para actualizar
            this._handleUpdateArea = (e) => {
                e.preventDefault();
                const editIndex = parseInt(form.dataset.editIndex);
                const area = this.selectedAreas[editIndex];
                
                // Obtener valores actualizados del formulario
                const updatedArea = {
                    ...area,
                    name: customNameInput ? customNameInput.value.trim() || 'Área personalizada' : 'Área personalizada',
                    severity: severitySelect ? severitySelect.value : 'leve',
                    evolution: evolutionSelect ? evolutionSelect.value : 'estable',
                    startDate: startDateInput ? startDateInput.value : '',
                    functionalImpact: functionalImpactSelect ? functionalImpactSelect.value : 'sin-impacto',
                    intervention: interventionSelect ? Array.from(interventionSelect.selectedOptions).map(opt => opt.value) : []
                };
                
                // Actualizar el área
                this.selectedAreas[editIndex] = updatedArea;
                
                // Actualizar visualmente
                this.renderSelectedAreas();
                this.updateAnatomyMarkers();
                
                // Ocultar formulario
                form.style.display = 'none';
                
                // Restaurar el botón a modo añadir
                saveButton.textContent = 'Guardar';
                saveButton.setAttribute('data-mode', 'add');
                saveButton.removeAttribute('data-area-index');
                
                // Restablecer el evento de añadir
                saveButton.removeEventListener('click', this._handleUpdateArea);
                this._handleAddArea = (e) => {
                    e.preventDefault();
                    this.addSelectedArea();
                };
                saveButton.addEventListener('click', this._handleAddArea);
                
                console.log('Área actualizada:', updatedArea);
            };
            
            // Añadir el evento de actualización
            saveButton.addEventListener('click', this._handleUpdateArea);
        }
        
        // Hacer scroll para que el formulario sea visible
        form.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Actualiza los marcadores de anatomía basados en las áreas seleccionadas
    updateAnatomyMarkers: function() {
        console.log('Actualizando marcadores de anatomía');
        
        // Verificar que el overlay existe
        if (!this.elements.anatomyOverlay) {
            console.error('No se encontró el overlay de anatomía');
            return;
        }
        
        // Eliminar marcadores existentes para evitar duplicados
        const existingMarkers = this.elements.anatomyOverlay.querySelectorAll('.anatomy-marker');
        existingMarkers.forEach(marker => marker.remove());
        
        // Verificar si hay áreas para mostrar
        if (!this.selectedAreas || this.selectedAreas.length === 0) {
            console.log('No hay áreas seleccionadas para mostrar marcadores');
            return;
        }
        
        // Crear marcadores para cada área seleccionada
        this.selectedAreas.forEach((area, index) => {
            // Obtener propiedades del área
            const x = area.coordinates.x;
            const y = area.coordinates.y;
            const severity = area.severity || 'leve';
            
            // Crear el marcador
            const marker = document.createElement('div');
            marker.className = `anatomy-marker marker-${severity}`;
            marker.setAttribute('data-index', index);
            marker.setAttribute('data-name', area.name);
            marker.setAttribute('data-severity', severity);
            marker.setAttribute('title', area.name);
            
            // Calcular posición en píxeles
            const overlay = this.elements.anatomyOverlay;
            const xPx = (x / 100) * overlay.offsetWidth;
            const yPx = (y / 100) * overlay.offsetHeight;
            
            // Establecer posición
            marker.style.left = xPx + 'px';
            marker.style.top = yPx + 'px';
            
            // Añadir evento click para editar el área
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editArea(index);
            });
            
            // Añadir evento mouseenter para mostrar tooltip
            marker.addEventListener('mouseenter', () => {
                this.showMarkerTooltip(marker, area);
            });
            
            // Añadir evento mouseleave para ocultar tooltip
            marker.addEventListener('mouseleave', () => {
                this.hideMarkerTooltip();
            });
            
            // Añadir al overlay
            this.elements.anatomyOverlay.appendChild(marker);
        });
        
        console.log('Marcadores de anatomía actualizados:', this.selectedAreas.length);
    },
    
    // Muestra un tooltip con la información del área
    showMarkerTooltip: function(marker, area) {
        // Eliminar cualquier tooltip existente
        this.hideMarkerTooltip();
        
        // Crear tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'marker-tooltip';
        tooltip.id = 'marker-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.zIndex = '50';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '14px';
        tooltip.style.maxWidth = '250px';
        tooltip.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        tooltip.style.pointerEvents = 'none';
        
        // Contenido del tooltip
        let tooltipContent = `<strong>${area.name}</strong>`;
        
        if (area.severity) {
            const severityLabel = this.getSeverityLabel(area.severity);
            tooltipContent += `<br><span class="severity">${severityLabel}</span>`;
        }
        
        if (area.description) {
            tooltipContent += `<br>${area.description}`;
        }
        
        tooltip.innerHTML = tooltipContent;
        
        // Calcular posición
        const markerRect = marker.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        
        const left = markerRect.left - bodyRect.left + markerRect.width / 2;
        const top = markerRect.top - bodyRect.top - tooltip.offsetHeight - 10;
        
        // Posicionar el tooltip
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        
        // Añadir al documento
        document.body.appendChild(tooltip);
    },
    
    // Oculta el tooltip de marcador
    hideMarkerTooltip: function() {
        const tooltip = document.getElementById('marker-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    },
    
    // Función para obtener el nombre legible de la categoría
    getCategoryName: function(category) {
        return 'Áreas Personalizadas';
    },
    
    // Función para obtener el texto de la evolución
    getEvolutionText: function(evolution) {
        switch (evolution) {
            case 'estable':
                return 'Estable';
            case 'mejoria':
                return `<span class="change-better">Mejora</span>`;
            case 'empeoramiento':
                return `<span class="change-worse">Empeoramiento</span>`;
            default:
                return 'No especificado';
        }
    },
    
    // Formatear fecha para mostrar
    formatDate: function(dateString) {
        if (!dateString) return 'No especificada';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString();
    },
    
    // Se activa cuando la pestaña de anatomía es seleccionada
    onTabActivated: function() {
        console.log('Anatomía: Tab activado');
        
        // Limpiar marcadores existentes
        this.cleanupAllMarkers();
        
        // Verificar que tenemos todos los elementos necesarios
        if (!this.elements.anatomyContainer) {
            console.error('Anatomía: No se encontró el contenedor de anatomía');
            return;
        }
        
        if (!this.elements.anatomyImageContainer) {
            console.error('Anatomía: No se encontró el contenedor de imagen');
            return;
        }
        
        if (!this.elements.anatomyOverlay) {
            console.error('Anatomía: No se encontró el overlay');
            return;
        }
        
        // Verificar si la imagen está cargada
        const anatomyImage = this.elements.anatomyImageContainer.querySelector('img');
        if (!anatomyImage) {
            console.error('Anatomía: No se encontró la imagen');
            return;
        } else {
            console.log('Anatomía: Imagen encontrada', anatomyImage.src);
        }
        
        // Configurar la sección de anatomía
        this.setupAnatomySection();
        
        // Renderizar las áreas seleccionadas
        this.renderSelectedAreas();
        
        // Asegurar que los marcadores estén actualizados
        this.updateAnatomyMarkers();
        
        console.log('Anatomía: Tab configurado correctamente');
    },
    
    // Crea un área temporal en la posición especificada
    createTempArea: function(x, y) {
        console.log('Creando área temporal en:', x, y);
        
        // Eliminar marcador temporal existente si lo hay
        const existingTemp = document.getElementById('temp-marker');
        if (existingTemp) {
            existingTemp.remove();
        }
        
        // Crear nuevo marcador temporal
        const tempMarker = document.createElement('div');
        tempMarker.id = 'temp-marker';
        tempMarker.style.left = x + 'px';
        tempMarker.style.top = y + 'px';
        
        // Guardar coordenadas originales como atributos data
        tempMarker.dataset.x = x;
        tempMarker.dataset.y = y;
        
        // Añadir al overlay
        if (this.elements.anatomyOverlay) {
            this.elements.anatomyOverlay.appendChild(tempMarker);
        }
    },
    
    // Comprueba si hay un área cercana al punto especificado
    checkForNearbyArea: function(x, y) {
        if (!this.selectedAreas || this.selectedAreas.length === 0) {
            return null;
        }
        
        const overlay = this.elements.anatomyOverlay;
        if (!overlay) return null;
        
        // Distancia máxima en píxeles para considerar "cerca"
        const maxDistance = 15; 
        
        for (let i = 0; i < this.selectedAreas.length; i++) {
            const area = this.selectedAreas[i];
            
            // Obtener posición en píxeles del área
            const areaX = (area.coordinates.x / 100) * overlay.offsetWidth;
            const areaY = (area.coordinates.y / 100) * overlay.offsetHeight;
            
            // Calcular distancia
            const distance = Math.sqrt(
                Math.pow(x - areaX, 2) + 
                Math.pow(y - areaY, 2)
            );
            
            if (distance <= maxDistance) {
                return { area: area, index: i };
            }
        }
        
        return null;
    },
    
    // Obtiene el texto del impacto funcional
    getFunctionalImpactText: function(impact) {
        switch (impact) {
            case 'sin-impacto':
                return 'Sin impacto funcional';
            case 'leve':
                return 'Impacto leve - No afecta actividades diarias';
            case 'moderado':
                return 'Impacto moderado - Limita algunas actividades';
            case 'severo':
                return 'Impacto severo - Requiere asistencia';
            case 'completo':
                return 'Pérdida completa de la función';
            default:
                return 'No especificado';
        }
    },
    
    // Obtiene el texto de la intervención
    getInterventionText: function(intervention) {
        switch (intervention) {
            case 'ninguna':
                return 'Observación';
            case 'fisioterapia':
                return 'Fisioterapia';
            case 'terapia-ocupacional':
                return 'Terapia ocupacional';
            case 'logopedia':
                return 'Logopedia';
            case 'nutricional':
                return 'Apoyo nutricional';
            case 'respiratoria':
                return 'Asistencia respiratoria';
            case 'ayudas-tecnicas':
                return 'Ayudas técnicas';
            case 'farmacologica':
                return 'Tratamiento farmacológico';
            default:
                return intervention;
        }
    }
}; 