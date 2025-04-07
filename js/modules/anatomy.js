// anatomy.js - Módulo para la sección de anatomía

const EMPA_ANATOMY = {
    // Datos y estado
    elements: {}, // Referencias a elementos del DOM
    selectedAreas: [], // Áreas seleccionadas por el usuario
    editingAreaIndex: null, // Índice del área que está siendo editada actualmente
    
    // Obtener referencias a elementos del DOM
    getElements: function() {
        this.elements = this.elements || {};
        this.elements.anatomyContainer = document.getElementById('anatomy-container');
        this.elements.anatomyImageContainer = document.getElementById('anatomy-image-container');
        this.elements.anatomyImage = document.getElementById('anatomy-image');
        this.elements.anatomyOverlay = document.getElementById('anatomy-overlay');
        this.elements.areaDetailsForm = document.getElementById('area-detail-form');
        this.elements.btnSaveArea = document.getElementById('btn-save-area');
        this.elements.btnCancelArea = document.getElementById('btn-cancel-area');
        
        console.log('Referencias a elementos DOM de anatomía obtenidas');
    },
    
    // Inicializa el módulo de anatomía
    init: function() {
        try {
            console.log('Inicializando módulo de anatomía...');
            
            // Inicializar arreglo de áreas seleccionadas vacío
            this.selectedAreas = [];
            
            // Obtener referencias a elementos del DOM
            this.getElements();
            
            // Configurar estilos CSS
            this.injectCss();
            
            // Configurar eventos para los botones del formulario
            this.initFormEvents();
            
            // Configuración inicial de la sección de anatomía
            this.setupAnatomySection();
            
            console.log('Módulo de anatomía inicializado correctamente');
            return true;
        } catch (error) {
            console.error('Error al inicializar el módulo de anatomía:', error);
            return false;
        }
    },
    
    // Inyectar estilos CSS necesarios para los marcadores y elementos visuales
    injectCss: function() {
        // Crear elemento style si no existe
        let styleElem = document.getElementById('anatomy-styles');
        if (!styleElem) {
            styleElem = document.createElement('style');
            styleElem.id = 'anatomy-styles';
            
            // Añadir estilos CSS
            styleElem.textContent = `
            .anatomy-marker {
                position: absolute;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background-color: rgba(255, 0, 0, 0.5);
                border: 2px solid rgba(255, 0, 0, 0.8);
                transform: translate(-50%, -50%);
                cursor: pointer;
                z-index: 10;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .anatomy-marker:hover {
                transform: translate(-50%, -50%) scale(1.2);
                box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
            }
            
            #temp-marker {
                background-color: rgba(0, 150, 255, 0.5);
                border-color: rgba(0, 150, 255, 0.8);
                animation: pulsate 1.5s infinite ease-in-out;
                box-shadow: 0 0 5px rgba(0, 150, 255, 0.8);
                z-index: 11;
            }
            
            .cursor-highlight {
                position: absolute;
                pointer-events: none;
                width: 20px;
                height: 20px;
                background-color: rgba(100, 200, 255, 0.3);
                border: 2px dashed rgba(100, 200, 255, 0.8);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: 5;
            }
            
            @keyframes pulsate {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            
            .marker-leve {
                background-color: #CCB800;
            }
            
            .marker-moderada, .marker-moderado {
                background-color: #CC7000;
            }
            
            .marker-grave, .marker-severo {
                background-color: #CC0000;
            }
        `;
            
            // Añadir al head del documento
            document.head.appendChild(styleElem);
            console.log('Estilos CSS inyectados');
        }
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
            const overlay = this.elements.anatomyOverlay;
            overlay.addEventListener('click', this.handleOverlayClick.bind(this));
            
            // Configurar evento de movimiento del ratón
            overlay.addEventListener('mousemove', this.handleMouseMove.bind(this));
            
            // Evento cuando el ratón sale del área
            overlay.addEventListener('mouseleave', () => {
                if (this.elements.cursorIndicator) {
                    this.elements.cursorIndicator.style.display = 'none';
                }
            });
            
            // Actualizar la lista de áreas seleccionadas
            this.renderSelectedAreas();
            
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
            
            // Crear indicador de cursor si no existe
            if (!this.elements.cursorIndicator) {
                const cursorIndicator = document.createElement('div');
                cursorIndicator.id = 'cursor-indicator';
                cursorIndicator.className = 'cursor-highlight';
                cursorIndicator.style.display = 'none';
                this.elements.anatomyOverlay.appendChild(cursorIndicator);
                this.elements.cursorIndicator = cursorIndicator;
            }
            
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
        
        // Crear marcador temporal en la posición del clic
        const tempMarker = document.createElement('div');
        tempMarker.id = 'temp-marker';
        tempMarker.style.left = x + 'px';
        tempMarker.style.top = y + 'px';
        
        // Guardamos las coordenadas como atributos para poder recuperarlas después
        tempMarker.dataset.x = x;
        tempMarker.dataset.y = y;
        
        // Eliminar cualquier marcador temporal anterior
        const existingTemp = document.getElementById('temp-marker');
        if (existingTemp) existingTemp.remove();
        
        // Añadir al overlay
        this.elements.anatomyOverlay.appendChild(tempMarker);
        
        // Mostrar formulario para agregar área
        this.showAreaDetailsForm(x, y);
    },
    
    // Manejador del evento mousemove en el overlay
    handleMouseMove: function(event) {
        // Calcular posición relativa al contenedor
        const rect = this.elements.anatomyOverlay.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Actualizar indicador del cursor únicamente
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
        if (!this.elements.cursorIndicator) {
            // Crear elemento si no existe
            const cursorIndicator = document.createElement('div');
            cursorIndicator.className = 'cursor-highlight';
            this.elements.anatomyOverlay.appendChild(cursorIndicator);
            this.elements.cursorIndicator = cursorIndicator;
        }
        
        // Actualizar posición
        const cursor = this.elements.cursorIndicator;
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
        cursor.style.display = 'block';
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
        
        // Resetear el formulario
        document.getElementById('current-area-name').textContent = 'Nueva área';
        document.getElementById('area-severity').value = 'leve';
        document.getElementById('area-evolution').value = 'estable';
        document.getElementById('area-impact').value = 'ninguno';
        
        // Establecer fecha actual por defecto
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('area-start-date').value = today;
        
        // Limpiar selección de intervenciones
        const interventionsSelect = document.getElementById('area-interventions');
        for (let i = 0; i < interventionsSelect.options.length; i++) {
            interventionsSelect.options[i].selected = false;
        }
        
        // Mostrar el formulario
        this.elements.areaDetailsForm.style.display = 'block';
        
        // Hacer scroll al formulario para asegurar que es visible
        this.elements.areaDetailsForm.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Inicializar eventos para los botones del formulario
    initFormEvents: function() {
        console.log('Inicializando eventos de formulario de anatomía');
        
        // Botón Guardar
        this.elements.btnSaveArea.addEventListener('click', (e) => {
            e.preventDefault();
            this.addSelectedArea();
        });
        
        // Botón Cancelar
        this.elements.btnCancelArea.addEventListener('click', (e) => {
            e.preventDefault();
            this.resetAreaForm();
        });
        
        // Botón Restablecer selección
        const resetBtn = document.getElementById('reset-areas-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetAllAreas();
            });
        } else {
            console.error('No se encontró el botón de restablecer selección');
        }
    },
    
    // Actualiza el gráfico de progresión con los datos actuales
    updateProgressionChart: function() {
        try {
            console.log('Actualizando gráfico de progresión con áreas seleccionadas');
            
            // Verificar que el módulo de progresión esté disponible
            if (typeof EMPA_PROGRESSION === 'undefined' || !EMPA_PROGRESSION.getProgressionFromSelectedAreas) {
                console.error('El módulo de progresión no está disponible o no tiene la función necesaria');
                return;
            }
            
            // Actualizar las áreas en EMPA si es necesario para mantener consistencia
            if (typeof EMPA !== 'undefined') {
                EMPA.selectedAreas = this.selectedAreas;
            }
            
            // Actualizar directamente el gráfico llamando a la función en el módulo de progresión
            EMPA_PROGRESSION.selectedAreas = this.selectedAreas; // Compartir datos
            EMPA_PROGRESSION.getProgressionFromSelectedAreas();
            
            console.log('Solicitud de actualización del gráfico de progresión enviada');
        } catch (error) {
            console.error('Error al actualizar el gráfico de progresión:', error);
        }
    },
    
    // Renderiza la lista de áreas seleccionadas
    renderSelectedAreas: function() {
        const listContainer = document.getElementById('affected-areas-list');
        if (!listContainer) {
            console.error('Contenedor de lista de áreas no encontrado');
            return;
        }
        
        // Limpiar lista actual
        listContainer.innerHTML = '';
        
        // Verificar si hay áreas seleccionadas
        if (!this.selectedAreas || this.selectedAreas.length === 0) {
            listContainer.innerHTML = '<div class="no-areas">No hay áreas seleccionadas</div>';
            
            // También asegurarse de que no haya marcadores sin áreas asociadas
            this.cleanupAllMarkers();
            
            // Actualizar gráfico de progresión incluso cuando no hay áreas
            this.updateProgressionChart();
            return;
        }
        
        // Eliminar áreas duplicadas, si existen (comparando coordenadas)
        const areasUnicas = [];
        const coordsMap = new Map(); // Mapa para rastrear coordenadas ya procesadas
        
        this.selectedAreas.forEach(area => {
            if (!area || !area.coordinates) return;
            
            // Crear una clave única para las coordenadas
            const key = `${area.coordinates.x.toFixed(1)},${area.coordinates.y.toFixed(1)}`;
            
            // Solo añadir el área si no existe ya una con las mismas coordenadas
            if (!coordsMap.has(key)) {
                coordsMap.set(key, true);
                areasUnicas.push(area);
            } else {
                console.log('Área duplicada detectada y eliminada:', area.name);
            }
        });
        
        // Reemplazar array de áreas con las únicas
        if (areasUnicas.length !== this.selectedAreas.length) {
            console.log(`Se eliminaron ${this.selectedAreas.length - areasUnicas.length} áreas duplicadas`);
            this.selectedAreas = areasUnicas;
        }
        
        // Crear lista y añadir cada área
        const list = document.createElement('div');
        list.id = 'selected-areas-list';
        
        // Agregar cada área a la lista
        this.selectedAreas.forEach((area, index) => {
            const areaItem = document.createElement('div');
            areaItem.className = 'area-item';
            
            // Crear encabezado del área
            const areaHeader = document.createElement('div');
            areaHeader.className = 'area-header';
            
            // Nombre del área
            const areaName = document.createElement('div');
            areaName.className = 'area-name';
            areaName.textContent = area.name || 'Área ' + (index + 1);
            
            // Botones de acción
            const areaActions = document.createElement('div');
            areaActions.className = 'area-actions';
            
            // Botón editar
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-edit';
            editBtn.textContent = 'Editar';
            editBtn.addEventListener('click', () => this.editArea(index));
            
            // Botón eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.addEventListener('click', () => {
                if (confirm('¿Está seguro de eliminar esta área?')) {
                    this.selectedAreas.splice(index, 1);
                    this.updateAnatomyMarkers();
                    this.renderSelectedAreas();
                    // Nota: No necesitamos llamar a updateProgressionChart aquí porque
                    // se llamará automáticamente en la próxima llamada a renderSelectedAreas
                }
            });
            
            // Añadir botones al contenedor de acciones
            areaActions.appendChild(editBtn);
            areaActions.appendChild(deleteBtn);
            
            // Añadir nombre y acciones al encabezado
            areaHeader.appendChild(areaName);
            areaHeader.appendChild(areaActions);
            
            // Añadir encabezado al item
            areaItem.appendChild(areaHeader);
            
            // Añadir detalles del área
            const areaDetails = document.createElement('div');
            areaDetails.className = 'area-details';
            
            // Información de severidad
            const severityElement = document.createElement('div');
            severityElement.className = 'area-severity';
            const severityLabel = document.createElement('strong');
            severityLabel.textContent = 'Severidad: ';
            const severityValue = document.createElement('span');
            severityValue.className = `severity-${area.severity || 'leve'}`;
            severityValue.textContent = this.capitalizeFirstLetter(area.severity || 'leve');
            severityElement.appendChild(severityLabel);
            severityElement.appendChild(severityValue);
            
            // Información de evolución
            const evolutionElement = document.createElement('div');
            evolutionElement.className = 'area-evolution';
            const evolutionLabel = document.createElement('strong');
            evolutionLabel.textContent = 'Evolución: ';
            const evolutionValue = document.createElement('span');
            evolutionValue.textContent = this.capitalizeFirstLetter(area.evolution || 'estable');
            evolutionElement.appendChild(evolutionLabel);
            evolutionElement.appendChild(evolutionValue);
            
            // Intervenciones (si existen)
            if (area.intervention && area.intervention.length > 0) {
                const interventionsElement = document.createElement('div');
                interventionsElement.className = 'area-interventions';
                const interventionsLabel = document.createElement('strong');
                interventionsLabel.textContent = 'Intervenciones: ';
                interventionsElement.appendChild(interventionsLabel);
                
                const interventionsValue = document.createElement('span');
                interventionsValue.textContent = area.intervention.map(i => this.getInterventionName(i)).join(', ');
                interventionsElement.appendChild(interventionsValue);
                
                areaDetails.appendChild(interventionsElement);
            }
            
            // Fecha de inicio de síntomas
            if (area.startDate) {
                const startDateElement = document.createElement('div');
                startDateElement.className = 'area-start-date';
                const startDateLabel = document.createElement('strong');
                startDateLabel.textContent = 'Inicio: ';
                const startDateValue = document.createElement('span');
                startDateValue.textContent = this.formatDate(area.startDate);
                startDateElement.appendChild(startDateLabel);
                startDateElement.appendChild(startDateValue);
                areaDetails.appendChild(startDateElement);
            }
            
            // Impacto funcional
            if (area.functionalImpact && area.functionalImpact !== 'ninguno') {
                const impactElement = document.createElement('div');
                impactElement.className = 'area-impact';
                const impactLabel = document.createElement('strong');
                impactLabel.textContent = 'Impacto: ';
                const impactValue = document.createElement('span');
                impactValue.textContent = this.capitalizeFirstLetter(area.functionalImpact);
                impactElement.appendChild(impactLabel);
                impactElement.appendChild(impactValue);
                areaDetails.appendChild(impactElement);
            }
            
            // Añadir información de severidad y evolución
            areaDetails.appendChild(severityElement);
            areaDetails.appendChild(evolutionElement);
            
            // Añadir detalles al item
            areaItem.appendChild(areaDetails);
            
            // Añadir item a la lista
            list.appendChild(areaItem);
        });
        
        // Añadir lista al contenedor
        listContainer.appendChild(list);
        
        // Actualizar los marcadores visuales para que coincidan con las áreas seleccionadas
        this.updateAnatomyMarkers();
        
        // Actualizar el gráfico de progresión con las áreas actualizadas
        // Solo actualizamos si hay cambios
        if (this.selectedAreas.length > 0) {
            this.updateProgressionChart();
        }
    },
    
    // Capitaliza la primera letra de una cadena
    capitalizeFirstLetter: function(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    // Formatea una fecha en formato legible
    formatDate: function(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    },
    
    // Obtiene el nombre legible de una intervención
    getInterventionName: function(intervention) {
        const interventions = {
            'fisioterapia': 'Fisioterapia',
            'terapia-ocupacional': 'Terapia ocupacional',
            'logopedia': 'Logopedia',
            'hidroterapia': 'Hidroterapia',
            'ortesis': 'Ortesis',
            'farmacologico': 'Tratamiento farmacológico',
            'observacion': 'Observación'
        };
        
        return interventions[intervention] || intervention;
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
        // Verificar que exista el área
        if (!this.selectedAreas || index < 0 || index >= this.selectedAreas.length) {
            console.error('Índice de área inválido o no hay áreas seleccionadas');
            return;
        }
        
        // Obtener el área a editar
        const area = this.selectedAreas[index];
        console.log('Editando área:', area);
        
        // Establecer modo de edición
        this.editingAreaIndex = index;
        
        // Calcular posición en píxeles para mostrar marcador temporal
        const overlay = this.elements.anatomyOverlay;
        if (!overlay) return;
        
        const x = (area.coordinates.x / 100) * overlay.offsetWidth;
        const y = (area.coordinates.y / 100) * overlay.offsetHeight;
        
        // Crear marcador temporal en la posición del área
        const tempMarker = document.createElement('div');
        tempMarker.id = 'temp-marker';
        tempMarker.style.left = x + 'px';
        tempMarker.style.top = y + 'px';
        
        // Guardar coordenadas originales como atributos
        tempMarker.dataset.x = x;
        tempMarker.dataset.y = y;
        
        // Eliminar cualquier marcador temporal anterior
        const existingTemp = document.getElementById('temp-marker');
        if (existingTemp) existingTemp.remove();
        
        // Añadir al overlay
        this.elements.anatomyOverlay.appendChild(tempMarker);
        
        // Preparar el formulario con los datos del área
        document.getElementById('current-area-name').textContent = area.name || 'Área';
        document.getElementById('area-severity').value = area.severity || 'leve';
        document.getElementById('area-evolution').value = area.evolution || 'estable';
        document.getElementById('area-start-date').value = area.startDate || '';
        document.getElementById('area-impact').value = area.functionalImpact || 'ninguno';
        
        // Seleccionar intervenciones
        const interventionsSelect = document.getElementById('area-interventions');
        for (let i = 0; i < interventionsSelect.options.length; i++) {
            const option = interventionsSelect.options[i];
            option.selected = area.intervention && area.intervention.includes(option.value);
        }
        
        // Mostrar formulario
        this.elements.areaDetailsForm.style.display = 'block';
        
        // Guardar coordenadas en el formulario para usarlas si se elimina el marcador temporal
        this.elements.areaDetailsForm.dataset.tempX = area.coordinates.x;
        this.elements.areaDetailsForm.dataset.tempY = area.coordinates.y;
        
        // Hacer scroll para que el formulario sea visible
        this.elements.areaDetailsForm.scrollIntoView({ behavior: 'smooth' });
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
            // Asegurarse de que el área tiene coordenadas
            if (!area.coordinates) {
                console.error('Área sin coordenadas:', area);
                return;
            }
            
            // Obtener coordenadas relativas a la imagen
            const overlay = this.elements.anatomyOverlay;
            const x = (area.coordinates.x / 100) * overlay.offsetWidth;
            const y = (area.coordinates.y / 100) * overlay.offsetHeight;
            
            // Obtener severidad para estilo
            const severity = area.severity || 'leve';
            
            // Crear el marcador
            const marker = document.createElement('div');
            marker.className = `anatomy-marker marker-${severity}`;
            marker.setAttribute('data-index', index);
            marker.setAttribute('data-name', area.name || 'Área');
            marker.setAttribute('data-severity', severity);
            marker.setAttribute('title', area.name || 'Área');
            
            // Establecer posición
            marker.style.left = x + 'px';
            marker.style.top = y + 'px';
            
            // Añadir evento click para editar el área
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editArea(index);
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
    
    // Se activa cuando la pestaña de anatomía es seleccionada
    onTabActivated: function() {
        console.log('Pestaña de anatomía activada');
        
        try {
            // Actualizar overlay por si ha cambiado el tamaño
            this.updateAnatomyOverlay();
            
            // Verificar si hay áreas duplicadas y eliminarlas antes de renderizar
            if (this.selectedAreas && this.selectedAreas.length > 0) {
                // Eliminar áreas duplicadas
                const areasUnicas = [];
                const coordsMap = new Map();
                
                this.selectedAreas.forEach(area => {
                    if (!area || !area.coordinates) return;
                    
                    const key = `${area.coordinates.x.toFixed(1)},${area.coordinates.y.toFixed(1)}`;
                    
                    if (!coordsMap.has(key)) {
                        coordsMap.set(key, true);
                        areasUnicas.push(area);
                    } else {
                        console.log('Área duplicada detectada y eliminada en onTabActivated:', area.name);
                    }
                });
                
                if (areasUnicas.length !== this.selectedAreas.length) {
                    console.log(`Se eliminaron ${this.selectedAreas.length - areasUnicas.length} áreas duplicadas en onTabActivated`);
                    this.selectedAreas = areasUnicas;
                }
            }
            
            // Renderizar áreas que ya existen (sin crear automáticamente)
            this.renderSelectedAreas();
            
            console.log('Pestaña de anatomía configurada correctamente');
        } catch (error) {
            console.error('Error al activar pestaña de anatomía:', error);
        }
    },
    
    // Comprueba si hay un área cercana al punto especificado
    checkForNearbyArea: function(x, y) {
        if (!this.selectedAreas || this.selectedAreas.length === 0) {
            return null;
        }
        
        // Distancia máxima para considerar un área como cercana (en píxeles)
        const maxDistance = 15;
        
        // Buscar áreas cercanas
        for (let i = 0; i < this.selectedAreas.length; i++) {
            const area = this.selectedAreas[i];
            
            // Obtener posición del área en píxeles
            const overlay = this.elements.anatomyOverlay;
            const areaX = (area.coordinates.x / 100) * overlay.offsetWidth;
            const areaY = (area.coordinates.y / 100) * overlay.offsetHeight;
            
            // Calcular distancia
            const distance = Math.sqrt(
                Math.pow(areaX - x, 2) + Math.pow(areaY - y, 2)
            );
            
            if (distance <= maxDistance) {
                return { index: i, area: area };
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
    },
    
    // Crear un área temporal
    createTempArea: function(x, y) {
        // Eliminar cualquier marcador temporal anterior
        const existingTemp = document.getElementById('temp-marker');
        if (existingTemp) existingTemp.remove();
        
        // Crear un nuevo marcador temporal
        const tempMarker = document.createElement('div');
        tempMarker.id = 'temp-marker';
        tempMarker.style.left = `${x}px`;
        tempMarker.style.top = `${y}px`;
        
        // Guardar las coordenadas como atributos data-
        tempMarker.dataset.x = x;
        tempMarker.dataset.y = y;
        
        this.elements.anatomyOverlay.appendChild(tempMarker);
        
        // Guardar las coordenadas temporales
        this.tempCoords = { x, y };
        
        console.log('Área temporal creada en:', x, y);
    },
    
    // Añadir o actualizar área seleccionada
    addSelectedArea: function() {
        console.log('Añadiendo área seleccionada');
        
        // Verificar que el formulario está disponible
        if (!this.elements.areaDetailsForm) {
            console.error('Formulario de detalles no encontrado');
            return;
        }
        
        // Obtener valores del formulario
        const severity = document.getElementById('area-severity').value;
        const evolution = document.getElementById('area-evolution').value;
        const startDate = document.getElementById('area-start-date').value;
        const impact = document.getElementById('area-impact').value;
        
        // Obtener intervenciones seleccionadas
        const interventionsSelect = document.getElementById('area-interventions');
        const interventions = Array.from(interventionsSelect.selectedOptions).map(option => option.value);
        
        // Obtener coordenadas del marcador temporal
        const tempMarker = document.getElementById('temp-marker');
        if (!tempMarker) {
            console.error('No se encontró el marcador temporal, cancelando creación del área');
            return;
        }
        
        let x = parseFloat(tempMarker.dataset.x);
        let y = parseFloat(tempMarker.dataset.y);
        
        if (isNaN(x) || isNaN(y)) {
            console.error('Coordenadas inválidas, cancelando creación del área');
            return;
        }
        
        // Convertir coordenadas a porcentajes para almacenamiento
        const overlay = this.elements.anatomyOverlay;
        if (!overlay) {
            console.error('Overlay no encontrado');
            return;
        }
        
        const xPercent = (x / overlay.offsetWidth) * 100;
        const yPercent = (y / overlay.offsetHeight) * 100;
        
        // Generar nombre único para el área
        const areaName = this.editingAreaIndex !== null && this.editingAreaIndex !== undefined 
            ? this.selectedAreas[this.editingAreaIndex].name 
            : 'Área personalizada ' + (this.selectedAreas.length + 1);
        
        // Crear objeto de área
        const areaData = {
            name: areaName,
            category: "personalizada",
            coordinates: {
                x: xPercent, 
                y: yPercent, 
                radius: 8
            },
            severity: severity,
            evolution: evolution,
            startDate: startDate,
            functionalImpact: impact,
            intervention: interventions,
            description: "Área definida por el usuario",
            timestamp: new Date().getTime()
        };
        
        console.log('Nueva área creada:', areaData);
        
        // Si estamos editando, reemplazar el área existente
        if (this.editingAreaIndex !== undefined && this.editingAreaIndex !== null) {
            this.selectedAreas[this.editingAreaIndex] = areaData;
            console.log('Área actualizada en índice:', this.editingAreaIndex);
        } else {
            // Si es un área nueva, agregarla al array
            if (!this.selectedAreas) {
                this.selectedAreas = [];
            }
            this.selectedAreas.push(areaData);
            console.log('Nueva área añadida');
        }
        
        // Limpiar estado de edición antes de actualizar visualización
        this.resetAreaForm();
        
        // Actualizar visualización
        this.updateAnatomyMarkers();
        this.renderSelectedAreas();
        
        // Actualizar gráfico de progresión temporal
        this.updateProgressionChart();
        
        console.log('Total de áreas seleccionadas:', this.selectedAreas.length);
    },
    
    // Actualiza la lista de áreas afectadas en la interfaz
    updateAreasList: function() {
        // Utilizar el mismo método que renderSelectedAreas para mantener coherencia
        this.renderSelectedAreas();
    },
    
    // Elimina todas las áreas seleccionadas y sus marcadores
    resetAllAreas: function() {
        if (confirm('¿Está seguro de que desea eliminar todas las áreas seleccionadas?')) {
            console.log('Eliminando todas las áreas seleccionadas');
            
            // Vaciar el array de áreas seleccionadas
            this.selectedAreas = [];
            
            // Limpiar marcadores visuales
            this.cleanupAllMarkers();
            
            // Actualizar la lista en la interfaz
            this.renderSelectedAreas();
            
            console.log('Todas las áreas han sido eliminadas');
        }
    },
    
    // Reiniciar el formulario de áreas
    resetAreaForm: function() {
        // Ocultar formulario
        this.elements.areaDetailsForm.style.display = 'none';
        
        // Limpiar valores
        this.editingAreaIndex = null;
        
        // Eliminar marcador temporal
        const tempMarker = document.getElementById('temp-marker');
        if (tempMarker) tempMarker.remove();
    },
    
    // Obtiene la etiqueta de severidad a partir del valor
    getSeverityLabel: function(severity) {
        switch (severity) {
            case 'leve':
                return 'Severidad: Leve';
            case 'moderada':
            case 'moderado':
                return 'Severidad: Moderada';
            case 'grave':
            case 'severo':
                return 'Severidad: Grave';
            default:
                return 'Severidad: ' + this.capitalizeFirstLetter(severity);
        }
    }
}; 