// Módulo de Anatomía
class AnatomyModule {
    constructor() {
        this.initialized = false;
        this.markerManager = null;
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
            
            // Inicializar el gestor de marcadores
            const container = this.elements.markerContainer;
            console.log('Creando gestor de marcadores con contenedor:', container);
            this.markerManager = new MarkerManager(container);

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
            form: document.querySelector('#area-detail-form'),
            saveButton: document.querySelector('#save-area-button'),
            cancelButton: document.querySelector('#cancel-area-button')
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
                const rect = e.target.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                console.log('Clic en overlay:', { x, y });
                this.handleOverlayClick({ x, y });
            }
        });

        // Eventos del formulario
        this.elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        this.elements.cancelButton.addEventListener('click', () => {
            this.handleFormCancel();
        });

        // Suscribirse a eventos del gestor de marcadores
        EventBus.on('marker:selected', ({ index, area }) => {
            console.log('Marcador seleccionado:', { index, area });
            this.selectArea(index);
        });

        EventBus.on('marker:created', ({ coordinates, type, data }) => {
            console.log('Marcador creado:', { coordinates, type, data });
            if (type === 'temp') {
                this.showAreaDetailsForm(coordinates);
            }
        });
    }

    handleOverlayClick(coordinates) {
        if (this.state.isEditing) {
            console.log('Ignorando clic mientras se edita');
            return;
        }

        try {
            this.markerManager.createMarker(coordinates, 'temp');
            this.state.isEditing = true;
        } catch (error) {
            console.error('Error al crear marcador temporal:', error);
        }
    }

    showAreaDetailsForm(coordinates) {
        console.log('Mostrando formulario para coordenadas:', coordinates);
        
        const form = this.elements.form;
        form.style.display = 'block';
        form.style.opacity = '1';
        form.style.visibility = 'visible';
        
        // Limpiar campos del formulario
        form.reset();
        
        // Guardar coordenadas temporales
        form.dataset.tempX = coordinates.x;
        form.dataset.tempY = coordinates.y;
        
        // Asegurar que el formulario es visible
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    handleFormSubmit() {
        const form = this.elements.form;
        const coordinates = {
            x: parseFloat(form.dataset.tempX),
            y: parseFloat(form.dataset.tempY)
        };

        const areaData = {
            coordinates,
            severity: form.querySelector('[name="severity"]').value,
            evolution: form.querySelector('[name="evolution"]').value,
            startDate: form.querySelector('[name="start-date"]').value,
            impact: form.querySelector('[name="impact"]').value
        };

        console.log('Guardando área:', areaData);

        if (this.state.selectedAreaIndex !== null) {
            // Actualizar área existente
            this.state.areas[this.state.selectedAreaIndex] = areaData;
        } else {
            // Añadir nueva área
            this.state.areas.push(areaData);
        }

        this.updateAreas();
        this.resetForm();
    }

    handleFormCancel() {
        console.log('Cancelando edición de área');
        this.resetForm();
    }

    resetForm() {
        const form = this.elements.form;
        form.style.display = 'none';
        form.reset();
        
        this.state.isEditing = false;
        this.state.selectedAreaIndex = null;
        
        this.markerManager.removeTempMarker();
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
        form.querySelector('[name="severity"]').value = area.severity || '';
        form.querySelector('[name="evolution"]').value = area.evolution || '';
        form.querySelector('[name="start-date"]').value = area.startDate || '';
        form.querySelector('[name="impact"]').value = area.impact || '';

        form.dataset.tempX = area.coordinates.x;
        form.dataset.tempY = area.coordinates.y;

        this.showAreaDetailsForm(area.coordinates);
    }

    updateAreas() {
        console.log('Actualizando áreas:', this.state.areas);
        this.markerManager.updateMarkers(this.state.areas);
    }
}

// Crear e inicializar el módulo
const anatomyModule = new AnatomyModule();
anatomyModule.init().catch(error => {
    console.error('Error al inicializar el módulo de anatomía:', error);
});