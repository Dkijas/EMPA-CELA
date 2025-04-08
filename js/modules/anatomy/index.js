// Módulo de Anatomía
class AnatomyModule {
    constructor() {
        this.initialized = false;
        this.elements = null;
        this.state = {
            areas: [],
            selectedAreaIndex: null,
            isEditing: false
        };
    }

    async init() {
        if (this.initialized) {
            console.log('Módulo de anatomía ya inicializado');
            return;
        }

        console.log('Inicializando módulo de anatomía');
        
        try {
            // Esperar a que el DOM esté listo
            if (document.readyState !== 'complete') {
                await new Promise(resolve => window.addEventListener('load', resolve));
            }

            // Obtener elementos del DOM
            this.elements = this.getElements();
            
            // Configurar eventos
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('Módulo de anatomía inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar el módulo de anatomía:', error);
            throw error;
        }
    }

    getElements() {
        const elements = {
            container: document.querySelector('.anatomy-container'),
            image: document.querySelector('.anatomy-image'),
            overlay: document.querySelector('.anatomy-overlay'),
            markerContainer: document.querySelector('.marker-container'),
            form: document.getElementById('area-detail-form'),
            saveButton: document.getElementById('btn-save-area'),
            cancelButton: document.getElementById('btn-cancel-area')
        };

        // Verificar que todos los elementos existen
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            throw new Error(`Elementos faltantes: ${missingElements.join(', ')}`);
        }

        return elements;
    }

    setupEventListeners() {
        console.log('Configurando event listeners');

        // Evento de clic en el overlay
        this.elements.overlay.addEventListener('click', (e) => {
            if (!this.state.isEditing) {
                // Obtener coordenadas relativas al overlay
                const rect = this.elements.overlay.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                // Guardar las coordenadas originales del clic
                const clickCoordinates = { x, y };
                console.log('Clic original en:', clickCoordinates);
                
                this.handleOverlayClick(clickCoordinates);
            }
        });

        // Eventos del formulario
        this.elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulario enviado');
            
            // Usar las coordenadas originales guardadas en el marcador temporal
            if (this.tempMarker) {
                const coordinates = {
                    x: parseFloat(this.tempMarker.style.left),
                    y: parseFloat(this.tempMarker.style.top)
                };
                this.handleFormSubmit(coordinates);
            } else {
                console.error('No hay marcador temporal para guardar');
            }
        });
        
        this.elements.cancelButton.addEventListener('click', () => this.handleFormCancel());
    }

    calculateImageCoordinates(event) {
        const image = this.elements.image;
        const rect = image.getBoundingClientRect();
        
        // Obtener las dimensiones reales y escaladas de la imagen
        const naturalRatio = image.naturalWidth / image.naturalHeight;
        const containerRatio = rect.width / rect.height;
        
        let imageWidth, imageHeight, offsetX, offsetY;
        
        if (naturalRatio > containerRatio) {
            // La imagen se ajusta al ancho
            imageWidth = rect.width;
            imageHeight = rect.width / naturalRatio;
            offsetX = 0;
            offsetY = (rect.height - imageHeight) / 2;
        } else {
            // La imagen se ajusta al alto
            imageHeight = rect.height;
            imageWidth = rect.height * naturalRatio;
            offsetX = (rect.width - imageWidth) / 2;
            offsetY = 0;
        }

        // Calcular las coordenadas relativas a la imagen real
        const x = event.clientX - rect.left - offsetX;
        const y = event.clientY - rect.top - offsetY;

        // Verificar si el clic está dentro de la imagen
        if (x < 0 || x > imageWidth || y < 0 || y > imageHeight) {
            console.log('Clic fuera de la imagen');
            return null;
        }

        // Convertir a porcentajes
        return {
            x: (x / imageWidth) * 100,
            y: (y / imageHeight) * 100
        };
    }

    handleOverlayClick(coordinates) {
        if (this.state.isEditing) {
            console.log('Ignorando clic mientras se edita');
            return;
        }

        try {
            // Crear marcador temporal
            this.createTempMarker(coordinates);
            
            // Mostrar el formulario
            this.showAreaDetailsForm(coordinates);
            
            // Actualizar estado
            this.state.isEditing = true;
            console.log('Estado actualizado: isEditing = true');
        } catch (error) {
            console.error('Error al crear marcador temporal:', error);
        }
    }

    createTempMarker(coordinates) {
        // Eliminar marcador temporal existente
        if (this.tempMarker && this.tempMarker.parentNode) {
            this.tempMarker.remove();
        }

        const marker = document.createElement('div');
        marker.className = 'anatomy-marker temp-marker';
        
        // Guardar las coordenadas exactas como porcentajes
        marker.style.left = `${coordinates.x}%`;
        marker.style.top = `${coordinates.y}%`;
        
        this.elements.markerContainer.appendChild(marker);
        this.tempMarker = marker;

        console.log('Marcador temporal creado en:', coordinates);
    }

    showAreaDetailsForm(coordinates) {
        console.log('Mostrando formulario para coordenadas:', coordinates);
        
        const form = this.elements.form;
        if (!form) {
            console.error('Formulario no encontrado');
            return;
        }

        // Guardar coordenadas exactas
        form.dataset.tempX = coordinates.x.toString();
        form.dataset.tempY = coordinates.y.toString();
        
        // Asegurar que el formulario esté visible y accesible
        form.style.display = 'block';
        form.style.visibility = 'visible';
        form.style.opacity = '1';
        form.style.zIndex = '1000';
        
        // Añadir clase visible para estilos adicionales
        form.classList.add('visible');
        
        // Limpiar y enfocar
        form.reset();
        const firstInput = form.querySelector('select, input');
        if (firstInput) {
            firstInput.focus();
        }
    }

    handleFormSubmit(coordinates) {
        const form = this.elements.form;
        
        // Usar las coordenadas exactas del marcador temporal
        const areaData = {
            name: form.querySelector('#area-name').value || 'Área personalizada',
            coordinates: {
                x: coordinates.x,
                y: coordinates.y
            },
            severity: form.querySelector('#area-severity').value,
            evolution: form.querySelector('#area-evolution').value,
            startDate: form.querySelector('#area-start-date').value || new Date().toISOString().split('T')[0],
            impact: form.querySelector('#area-impact').value,
            interventions: Array.from(form.querySelector('#area-interventions').selectedOptions)
                .map(option => option.value)
        };

        console.log('Guardando área con datos:', areaData);

        if (this.state.selectedAreaIndex !== null) {
            // Actualizar área existente
            this.state.areas[this.state.selectedAreaIndex] = areaData;
        } else {
            // Añadir nueva área
            this.state.areas.push(areaData);
        }

        this.updateMarkers();
        this.resetForm();

        // Notificar al módulo de progresión
        if (typeof window.EMPA_PROGRESSION !== 'undefined') {
            console.log('Notificando al módulo de progresión sobre nueva área');
            window.EMPA_PROGRESSION.onAreasUpdated(this.getSelectedAreas());
        } else {
            console.warn('Módulo de progresión no encontrado');
        }
    }

    handleFormCancel() {
        console.log('Cancelando edición de área');
        this.resetForm();
    }

    resetForm() {
        const form = this.elements.form;
        form.reset();
        
        // Remover clase visible
        form.classList.remove('visible');
        
        // Ocultar el formulario
        form.style.display = 'none';
        form.style.visibility = 'hidden';
        form.style.opacity = '0';
        
        this.state.isEditing = false;
        this.state.selectedAreaIndex = null;
        
        if (this.tempMarker) {
            this.tempMarker.remove();
            this.tempMarker = null;
        }
    }

    updateMarkers() {
        console.log('Actualizando marcadores:', this.state.areas);
        
        // Limpiar marcadores existentes
        this.elements.markerContainer.innerHTML = '';
        
        // Crear nuevos marcadores
        this.state.areas.forEach((area, index) => {
            const marker = document.createElement('div');
            marker.className = `anatomy-marker permanent-marker marker-${area.severity}`;
            
            // Usar las coordenadas exactas guardadas
            marker.style.left = `${area.coordinates.x}%`;
            marker.style.top = `${area.coordinates.y}%`;
            marker.dataset.index = index;
            
            // Añadir evento de clic para edición
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectArea(index);
            });
            
            this.elements.markerContainer.appendChild(marker);
            console.log('Marcador permanente creado en:', area.coordinates);
        });
    }

    selectArea(index) {
        console.log('Seleccionando área:', index);
        
        const area = this.state.areas[index];
        if (!area) {
            console.warn('Área no encontrada:', index);
            return;
        }

        this.state.selectedAreaIndex = index;
        this.state.isEditing = true;

        // Mostrar formulario con datos del área
        const form = this.elements.form;
        form.querySelector('#area-severity').value = area.severity || '';
        form.querySelector('#area-evolution').value = area.evolution || '';
        form.querySelector('#area-start-date').value = area.startDate || '';
        form.querySelector('#area-impact').value = area.impact || '';

        // Seleccionar intervenciones
        const interventionsSelect = form.querySelector('#area-interventions');
        Array.from(interventionsSelect.options).forEach(option => {
            option.selected = area.interventions?.includes(option.value) || false;
        });

        form.dataset.tempX = area.coordinates.x.toString();
        form.dataset.tempY = area.coordinates.y.toString();

        this.showAreaDetailsForm(area.coordinates);
    }

    // Método para obtener las áreas seleccionadas
    getSelectedAreas() {
        return this.state.areas.map(area => ({
            name: area.name || 'Área personalizada',
            severity: area.severity || 'leve',
            evolution: area.evolution || 'estable',
            coordinates: area.coordinates,
            startDate: area.startDate || new Date().toISOString().split('T')[0]
        }));
    }
}

// Exportar el módulo
window.EMPA_ANATOMY = new AnatomyModule();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.EMPA_ANATOMY.init().then(() => {
        // Notificar al módulo de progresión después de inicializar
        if (typeof window.EMPA_PROGRESSION !== 'undefined') {
            window.EMPA_PROGRESSION.onAreasUpdated(window.EMPA_ANATOMY.getSelectedAreas());
        }
    });
});