// anatomy.js - Módulo para la sección de anatomía

const EMPA_ANATOMY = (function() {
    let isInitialized = false;
    let elements = {};
    let selectedAreas = [];
    let editingAreaIndex = null;
    
    // Coordenadas de las áreas anatómicas
    const anatomyAreas = {
        'Cabeza': { x: 50, y: 10, radius: 30 },
        'Cuello': { x: 50, y: 40, radius: 20 },
        'Hombro derecho': { x: 70, y: 60, radius: 25 },
        'Hombro izquierdo': { x: 30, y: 60, radius: 25 },
        'Brazo derecho': { x: 80, y: 90, radius: 25 },
        'Brazo izquierdo': { x: 20, y: 90, radius: 25 },
        'Tronco': { x: 50, y: 100, radius: 40 },
        'Pierna derecha': { x: 60, y: 160, radius: 30 },
        'Pierna izquierda': { x: 40, y: 160, radius: 30 }
    };

    function getElements() {
        elements = {
            anatomyContainer: document.getElementById('anatomy-container'),
            anatomyOverlay: document.getElementById('anatomy-overlay'),
            anatomyImage: document.getElementById('anatomy-image'),
            markersContainer: document.getElementById('markers-container'),
            areaDetailForm: document.getElementById('area-detail-form'),
            areaSeverity: document.getElementById('area-severity'),
            areaEvolution: document.getElementById('area-evolution'),
            areaStartDate: document.getElementById('area-start-date'),
            areaImpact: document.getElementById('area-impact'),
            areaInterventions: document.getElementById('area-interventions'),
            btnSaveArea: document.getElementById('btn-save-area'),
            btnCancelArea: document.getElementById('btn-cancel-area'),
            btnResetAreas: document.getElementById('reset-areas-btn'),
            affectedAreasList: document.getElementById('affected-areas-list')
        };

        // Verificar elementos requeridos
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            console.error('Elementos faltantes:', missingElements.join(', '));
            return false;
        }

        return true;
    }

    function init() {
        console.log('Inicializando módulo de anatomía...');
        
        if (isInitialized) {
            console.log('El módulo de anatomía ya está inicializado');
            return;
        }

        if (!getElements()) {
            console.error('No se pudo inicializar el módulo de anatomía: faltan elementos DOM');
            return;
        }

        console.log('Elementos DOM encontrados:', elements);
        
        // Inicializar con lista vacía de áreas seleccionadas
        selectedAreas = [];
        
        setupStyles();
        setupAnatomyOverlay();
        setupEventListeners();
        
        isInitialized = true;
        console.log('Módulo de anatomía inicializado correctamente');
    }

    function setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .anatomy-container {
                position: relative;
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                background-color: transparent;
            }
            
            .anatomy-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                cursor: crosshair;
                z-index: 5;
                background: transparent;
                pointer-events: auto;
            }
            
            .anatomy-marker {
                position: absolute;
                width: 16px;
                height: 16px;
                background-color: rgba(255, 0, 0, 0.5);
                border: 2px solid red;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 10;
                pointer-events: auto;
            }
            
            .anatomy-marker:hover {
                background-color: rgba(255, 0, 0, 0.7);
                transform: translate(-50%, -50%) scale(1.2);
                box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
            }
            
            .anatomy-marker.temp-marker {
                background-color: rgba(0, 128, 255, 0.5);
                border-color: #0080ff;
                z-index: 15;
            }
            
            .anatomy-marker.temp-marker:hover {
                background-color: rgba(0, 128, 255, 0.7);
            }
        `;
        document.head.appendChild(style);
    }

    function setupAnatomyOverlay() {
        console.log('Configurando overlay de anatomía...');

        // Configurar el overlay
        const overlay = elements.anatomyOverlay;
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.cursor = 'crosshair';
        overlay.style.zIndex = '5';
        overlay.style.backgroundColor = 'transparent';
        overlay.style.pointerEvents = 'all';

        // Asegurarse de que el overlay tenga las mismas dimensiones que la imagen
        function adjustOverlaySize() {
            if (elements.anatomyImage) {
                const imgRect = elements.anatomyImage.getBoundingClientRect();
                overlay.style.width = `${imgRect.width}px`;
                overlay.style.height = `${imgRect.height}px`;
                console.log('Dimensiones del overlay ajustadas:', {
                    width: imgRect.width,
                    height: imgRect.height
                });
            }
        }

        // Esperar a que la imagen se cargue antes de ajustar el tamaño
        if (elements.anatomyImage.complete) {
            adjustOverlaySize();
        } else {
            elements.anatomyImage.onload = adjustOverlaySize;
        }
        
        // Ajustar tamaño cuando la ventana cambie de tamaño
        window.addEventListener('resize', adjustOverlaySize);

        // Eliminar eventos anteriores
        overlay.removeEventListener('click', handleOverlayClick);
        
        // Configurar el evento de clic
        function handleOverlayClick(event) {
            console.log('Clic en el overlay detectado');
            event.preventDefault();
            event.stopPropagation();
            
            const rect = overlay.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            
            console.log('Coordenadas del clic:', { x, y, clientX: event.clientX, clientY: event.clientY, rect });
            
            createTempMarker(x, y);
            showAreaDetailsForm();
        }

        // Añadir el evento de clic
        overlay.addEventListener('click', handleOverlayClick);
        
        // Añadir eventos para mejorar la experiencia de usuario
        overlay.addEventListener('mouseover', () => {
            overlay.style.cursor = 'crosshair';
        });
        
        overlay.addEventListener('mouseout', () => {
            overlay.style.cursor = 'default';
        });
    }

    function setupEventListeners() {
        // Configurar eventos para los botones del formulario
        elements.btnSaveArea.onclick = function(event) {
            event.preventDefault();
            saveArea();
        };
        
        elements.btnCancelArea.onclick = function(event) {
            event.preventDefault();
            cancelAreaEdit();
        };
        
        elements.btnResetAreas.onclick = function(event) {
            event.preventDefault();
            resetAllAreas();
        };

        // Inicializar fecha actual
        elements.areaStartDate.valueAsDate = new Date();
    }

    function createTempMarker(x, y) {
        // Eliminar marcador temporal existente
        const existingTemp = elements.markersContainer.querySelector('.temp-marker');
        if (existingTemp) existingTemp.remove();

        // Crear nuevo marcador temporal
        const marker = document.createElement('div');
        marker.className = 'anatomy-marker temp-marker';
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        elements.markersContainer.appendChild(marker);

        // Guardar coordenadas en el formulario
        elements.areaDetailForm.dataset.x = x;
        elements.areaDetailForm.dataset.y = y;
    }

    function showAreaDetailsForm() {
        elements.areaDetailForm.style.display = 'block';
        elements.areaDetailForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function saveArea() {
        const x = parseFloat(elements.areaDetailForm.dataset.x);
        const y = parseFloat(elements.areaDetailForm.dataset.y);
        
        const areaData = {
            coordinates: { x, y },
            severity: elements.areaSeverity.value,
            evolution: elements.areaEvolution.value,
            startDate: elements.areaStartDate.value,
            impact: elements.areaImpact.value,
            interventions: Array.from(elements.areaInterventions.selectedOptions).map(opt => opt.value)
        };

        if (editingAreaIndex !== null) {
            selectedAreas[editingAreaIndex] = areaData;
        } else {
            selectedAreas.push(areaData);
        }

        updateMarkers();
        updateAreasList();
        
        // Limpiar y ocultar formulario
        elements.areaDetailForm.reset();
        elements.areaDetailForm.style.display = 'none';
        editingAreaIndex = null;

        // Eliminar marcador temporal
        const tempMarker = elements.markersContainer.querySelector('.temp-marker');
        if (tempMarker) tempMarker.remove();
    }

    function cancelAreaEdit() {
        elements.areaDetailForm.reset();
        elements.areaDetailForm.style.display = 'none';
        editingAreaIndex = null;

        const tempMarker = elements.markersContainer.querySelector('.temp-marker');
        if (tempMarker) tempMarker.remove();
    }

    function updateMarkers() {
        // Limpiar marcadores existentes excepto el temporal
        const markers = elements.markersContainer.querySelectorAll('.anatomy-marker:not(.temp-marker)');
        markers.forEach(marker => marker.remove());

        // Crear marcadores para cada área
        selectedAreas.forEach((area, index) => {
            const marker = document.createElement('div');
            marker.className = `anatomy-marker marker-${area.severity}`;
            marker.style.left = `${area.coordinates.x}%`;
            marker.style.top = `${area.coordinates.y}%`;
            marker.dataset.index = index;
            
            // Tooltip con información
            marker.title = `Severidad: ${area.severity}\nEvolución: ${area.evolution}`;
            
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                editArea(index);
            });

            elements.markersContainer.appendChild(marker);
        });
    }

    function updateAreasList() {
        elements.affectedAreasList.innerHTML = '';
        
        if (selectedAreas.length === 0) {
            elements.affectedAreasList.innerHTML = '<p>No hay áreas seleccionadas</p>';
            return;
        }

        selectedAreas.forEach((area, index) => {
            const areaElement = document.createElement('div');
            areaElement.className = 'affected-area-item';
            areaElement.innerHTML = `
                <h4>Área ${index + 1}</h4>
                <p>Severidad: ${area.severity}</p>
                <p>Evolución: ${area.evolution}</p>
                <div class="area-actions">
                    <button onclick="EMPA_ANATOMY.editArea(${index})">Editar</button>
                    <button onclick="EMPA_ANATOMY.deleteArea(${index})">Eliminar</button>
                </div>
            `;
            elements.affectedAreasList.appendChild(areaElement);
        });
    }

    function editArea(index) {
        const area = selectedAreas[index];
        if (!area) return;

        editingAreaIndex = index;
        createTempMarker(area.coordinates.x, area.coordinates.y);
        
        elements.areaSeverity.value = area.severity;
        elements.areaEvolution.value = area.evolution;
        elements.areaStartDate.value = area.startDate;
        elements.areaImpact.value = area.impact;
        
        Array.from(elements.areaInterventions.options).forEach(option => {
            option.selected = area.interventions.includes(option.value);
        });
        
        showAreaDetailsForm();
    }

    function deleteArea(index) {
        selectedAreas.splice(index, 1);
        updateMarkers();
        updateAreasList();
    }

    function resetAllAreas() {
        selectedAreas = [];
        updateMarkers();
        updateAreasList();
        
        elements.areaDetailForm.reset();
        elements.areaDetailForm.style.display = 'none';
        editingAreaIndex = null;
    }

    // API pública
    return {
        init,
        editArea,
        deleteArea,
        resetAllAreas,
        getSelectedAreas: () => selectedAreas
    };
})();

// Exportar el módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMPA_ANATOMY;
}

// Auto-inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', EMPA_ANATOMY.init); 