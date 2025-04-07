// Gestor de marcadores anatómicos
class MarkerManager {
    constructor(container) {
        if (!container) {
            throw new Error('El contenedor de marcadores es requerido');
        }
        console.log('Inicializando MarkerManager con contenedor:', container);
        
        this.container = container;
        this.markers = new Map();
        this.tempMarker = null;

        // Asegurarse de que el contenedor tenga la posición correcta
        if (window.getComputedStyle(container).position === 'static') {
            container.style.position = 'absolute';
        }
    }

    // Crear un nuevo marcador
    createMarker(coordinates, type = 'temp', data = {}) {
        console.log('Creando marcador:', { coordinates, type, data });
        
        // Validar coordenadas
        const validCoords = this.validateCoordinates(coordinates.x, coordinates.y);
        console.log('Coordenadas validadas:', validCoords);

        // Eliminar marcador temporal existente si es necesario
        if (type === 'temp') {
            this.removeTempMarker();
        }

        // Crear el elemento del marcador
        const marker = document.createElement('div');
        marker.className = `anatomy-marker ${type}-marker`;
        
        if (type === 'temp') {
            this.tempMarker = marker;
        } else {
            marker.classList.add(`marker-${data.severity || 'leve'}`);
            marker.title = this.generateTooltip(data);
        }

        // Posicionar el marcador
        this.setMarkerPosition(marker, validCoords);
        
        // Añadir el marcador al contenedor
        try {
            this.container.appendChild(marker);
            console.log('Marcador creado y añadido:', marker);
        } catch (error) {
            console.error('Error al añadir el marcador:', error);
        }

        // Emitir evento de creación
        EventBus.emit('marker:created', { 
            coordinates: validCoords, 
            type, 
            data 
        });
        
        return marker;
    }

    // Establecer posición del marcador
    setMarkerPosition(marker, {x, y}) {
        if (!marker) return;
        
        // Asegurar que las coordenadas estén dentro de los límites
        const validX = Math.max(0, Math.min(100, x));
        const validY = Math.max(0, Math.min(100, y));
        
        marker.style.left = `${validX}%`;
        marker.style.top = `${validY}%`;
        
        console.log('Posición del marcador actualizada:', { x: validX, y: validY });
    }

    // Generar tooltip con información del marcador
    generateTooltip(data) {
        const info = [
            `Severidad: ${data.severity || 'No especificada'}`,
            `Evolución: ${data.evolution || 'No especificada'}`,
            data.startDate ? `Fecha inicio: ${new Date(data.startDate).toLocaleDateString()}` : null,
            `Impacto: ${data.impact || 'No especificado'}`
        ].filter(Boolean);

        return info.join('\n');
    }

    // Actualizar marcadores existentes
    updateMarkers(areas) {
        console.log('Actualizando marcadores:', areas);
        
        this.clearMarkers();
        
        if (!Array.isArray(areas)) {
            console.warn('Las áreas proporcionadas no son un array:', areas);
            return;
        }

        areas.forEach((area, index) => {
            if (!area || !area.coordinates) {
                console.warn(`Área inválida en índice ${index}:`, area);
                return;
            }

            try {
                const marker = this.createMarker(area.coordinates, 'permanent', area);
                marker.dataset.index = index;
                
                // Añadir evento de clic para edición
                marker.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('Marcador clickeado:', { index, area });
                    EventBus.emit('marker:selected', { index, area });
                });

                this.markers.set(index, marker);
            } catch (error) {
                console.error(`Error al crear marcador para área ${index}:`, error);
            }
        });
    }

    // Eliminar marcador temporal
    removeTempMarker() {
        if (this.tempMarker && this.tempMarker.parentNode) {
            this.tempMarker.remove();
            this.tempMarker = null;
            console.log('Marcador temporal eliminado');
        }
    }

    // Limpiar todos los marcadores permanentes
    clearMarkers() {
        console.log('Limpiando todos los marcadores');
        this.markers.forEach(marker => {
            if (marker && marker.parentNode) {
                marker.remove();
            }
        });
        this.markers.clear();
    }

    // Validar coordenadas
    validateCoordinates(x, y) {
        const validX = Math.max(0, Math.min(100, x));
        const validY = Math.max(0, Math.min(100, y));
        
        if (validX !== x || validY !== y) {
            console.warn('Coordenadas ajustadas:', { 
                original: { x, y }, 
                ajustado: { x: validX, y: validY } 
            });
        }
        
        return { x: validX, y: validY };
    }
}

// Exportar el MarkerManager
window.MarkerManager = MarkerManager; 