// Módulo de progresión temporal
class ProgressionModule {
    constructor() {
        this.progressionContainer = document.querySelector('.progression-section');
        this.progressionChart = document.querySelector('.progression-chart');
        this.saveButton = document.querySelector('#guardarEvolucion');
        this.chartData = [];

        if (!this.progressionContainer || !this.progressionChart) {
            console.error('No se encontraron los elementos necesarios para el módulo de progresión');
            return;
        }

        this.initialize();
    }

    initialize() {
        this.loadSavedData();
        if (this.saveButton) {
            this.saveButton.addEventListener('click', () => this.guardarEvolucion());
        }
    }

    loadSavedData() {
        const savedData = localStorage.getItem('chartData');
        if (savedData) {
            try {
                this.chartData = JSON.parse(savedData);
                this.renderChart();
            } catch (error) {
                console.error('Error al cargar datos guardados:', error);
                this.chartData = [];
            }
        }
    }

    onAreasUpdated(areas) {
        console.log('Áreas actualizadas recibidas:', areas);
        
        if (!areas || areas.length === 0) {
            console.log('No hay áreas para actualizar');
            return;
        }

        const newDataPoint = {
            date: new Date().toISOString(),
            areas: areas.map(area => ({
                name: area.name || 'Área sin nombre',
                severity: area.severity || 'leve',
                evolution: area.evolution || 'estable',
                coordinates: area.coordinates,
                startDate: area.startDate || new Date().toISOString()
            }))
        };

        // Solo añadir si es diferente al último punto
        const lastPoint = this.chartData[this.chartData.length - 1];
        if (!lastPoint || JSON.stringify(lastPoint.areas) !== JSON.stringify(newDataPoint.areas)) {
            this.chartData.push(newDataPoint);
            localStorage.setItem('chartData', JSON.stringify(this.chartData));
            this.renderChart();
        }
    }

    guardarEvolucion() {
        if (!window.EMPA_ANATOMY) {
            console.error('Módulo de anatomía no encontrado');
            alert('Error: No se puede acceder al módulo de anatomía');
            return;
        }

        const selectedAreas = window.EMPA_ANATOMY.getSelectedAreas();
        if (!selectedAreas || selectedAreas.length === 0) {
            alert('No hay áreas seleccionadas para guardar');
            return;
        }

        this.onAreasUpdated(selectedAreas);
        alert('Evolución guardada correctamente');
    }

    renderChart() {
        if (!this.chartData || this.chartData.length === 0) {
            this.showEmptyMessage();
            return;
        }

        // Limpiar el contenedor
        this.progressionChart.innerHTML = '';

        // Crear contenedor del gráfico
        const container = document.createElement('div');
        container.className = 'chart-container';
        this.progressionChart.appendChild(container);

        // Crear ejes
        this.createYAxis(container);
        const plotArea = this.createPlotArea(container);
        this.createXAxis(container);

        // Dibujar puntos y líneas
        this.drawDataPoints(plotArea);
    }

    createYAxis(container) {
        const yAxis = document.createElement('div');
        yAxis.className = 'chart-y-axis';
        
        // Añadir etiquetas
        const labels = ['Grave', 'Moderada', 'Leve'];
        labels.forEach((label, index) => {
            const yLabel = document.createElement('div');
            yLabel.className = 'y-axis-label';
            yLabel.textContent = label;
            yLabel.style.bottom = `${(index * 33.33)}%`;
            yAxis.appendChild(yLabel);
        });

        container.appendChild(yAxis);
    }

    createPlotArea(container) {
        const plotArea = document.createElement('div');
        plotArea.className = 'chart-plot-area';
        container.appendChild(plotArea);
        return plotArea;
    }

    createXAxis(container) {
        // Añadir etiquetas de fecha en el eje X
        const dates = this.chartData.map(point => new Date(point.date));
        const plotWidth = container.offsetWidth - 60; // Restar el ancho del eje Y
        
        dates.forEach((date, index) => {
            const label = document.createElement('div');
            label.className = 'x-axis-label';
            label.textContent = date.toLocaleDateString();
            label.style.left = `${60 + (index * (plotWidth / (dates.length - 1)))}px`;
            container.appendChild(label);
        });
    }

    drawDataPoints(plotArea) {
        const plotHeight = plotArea.offsetHeight;
        const plotWidth = plotArea.offsetWidth;
        const totalPoints = this.chartData.length;

        // Mapa de severidad a posición Y
        const severityMap = {
            'leve': 0.166,
            'moderada': 0.5,
            'moderado': 0.5,
            'grave': 0.833,
            'severo': 0.833,
            'severa': 0.833
        };

        // Dibujar puntos y líneas para cada área
        const areaTracker = new Map();

        this.chartData.forEach((dataPoint, index) => {
            const x = (index / (totalPoints - 1)) * plotWidth;

            dataPoint.areas.forEach(area => {
                const y = severityMap[area.severity] * plotHeight;
                
                // Crear punto
                const point = document.createElement('div');
                point.className = `chart-point severity-${area.severity}`;
                point.style.left = `${x}px`;
                point.style.bottom = `${y}px`;
                point.title = `${area.name}\nFecha: ${new Date(dataPoint.date).toLocaleDateString()}\nSeveridad: ${area.severity}`;
                plotArea.appendChild(point);

                // Dibujar línea si hay punto previo
                if (areaTracker.has(area.name)) {
                    const prevPoint = areaTracker.get(area.name);
                    const line = document.createElement('div');
                    line.className = `chart-line evolution-${area.evolution}`;
                    
                    // Calcular posición y rotación de la línea
                    const dx = x - prevPoint.x;
                    const dy = y - prevPoint.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                    line.style.width = `${length}px`;
                    line.style.transform = `translate(${prevPoint.x}px, ${-prevPoint.y}px) rotate(${angle}deg)`;
                    
                    plotArea.appendChild(line);
                }

                // Actualizar tracker
                areaTracker.set(area.name, { x, y });
            });
        });
    }

    showEmptyMessage() {
        this.progressionChart.innerHTML = `
            <div class="empty-chart-message">
                <p>No hay datos de evolución disponibles</p>
                <p>Cree áreas en la imagen anatómica para ver su progresión</p>
            </div>
        `;
    }
}

// Inicializar el módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.EMPA_PROGRESSION = new ProgressionModule();
}); 