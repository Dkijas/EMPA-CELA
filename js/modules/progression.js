// progression.js - Módulo para gráficos de progresión de la enfermedad

const EMPA_PROGRESSION = {
    // Elementos del DOM para la sección de progresión
    elements: {
        progressionContainer: null,
        progressionChart: null
    },
    
    // Datos para el gráfico de progresión
    chartData: [],
    
    // Inicializa el módulo de progresión
    init: function() {
        console.log('Inicializando módulo de progresión...');
        
        // Obtener referencias a elementos DOM
        this.elements.progressionContainer = document.getElementById('progression-container');
        this.elements.progressionChart = document.getElementById('progression-chart');
        
        // Inicializar la sección de progresión si existe
        if (this.elements.progressionContainer) {
            this.setupProgressionSection();
        }
        
        console.log('Módulo de progresión inicializado correctamente');
    },
    
    // Configurar la sección de progresión
    setupProgressionSection: function() {
        // Inicializar datos de ejemplo para la progresión
        this.initSampleData();
        
        // Crear el gráfico de progresión
        this.createProgressionChart();
    },
    
    // Inicializar datos de ejemplo para la progresión
    initSampleData: function() {
        // Datos de ejemplo para mostrar la progresión
        this.chartData = [
            {
                date: new Date(2023, 0, 15),
                areas: [
                    { name: "Región Bulbar", severity: "leve", evolution: "estable" },
                    { name: "Musculatura Respiratoria", severity: "no", evolution: "estable" },
                    { name: "Brazo Derecho", severity: "moderado", evolution: "estable" }
                ]
            },
            {
                date: new Date(2023, 1, 20),
                areas: [
                    { name: "Región Bulbar", severity: "moderado", evolution: "empeoramiento" },
                    { name: "Musculatura Respiratoria", severity: "leve", evolution: "empeoramiento" },
                    { name: "Brazo Derecho", severity: "moderado", evolution: "estable" },
                    { name: "Pierna Izquierda", severity: "leve", evolution: "estable" }
                ]
            },
            {
                date: new Date(2023, 2, 18),
                areas: [
                    { name: "Región Bulbar", severity: "severo", evolution: "empeoramiento" },
                    { name: "Musculatura Respiratoria", severity: "moderado", evolution: "empeoramiento" },
                    { name: "Brazo Derecho", severity: "severo", evolution: "empeoramiento" },
                    { name: "Pierna Izquierda", severity: "moderado", evolution: "empeoramiento" },
                    { name: "Brazo Izquierdo", severity: "leve", evolution: "estable" }
                ]
            },
            {
                date: new Date(2023, 3, 22),
                areas: [
                    { name: "Región Bulbar", severity: "severo", evolution: "estable" },
                    { name: "Musculatura Respiratoria", severity: "severo", evolution: "empeoramiento" },
                    { name: "Brazo Derecho", severity: "severo", evolution: "estable" },
                    { name: "Pierna Izquierda", severity: "severo", evolution: "empeoramiento" },
                    { name: "Brazo Izquierdo", severity: "moderado", evolution: "empeoramiento" },
                    { name: "Pierna Derecha", severity: "leve", evolution: "estable" }
                ]
            }
        ];
    },
    
    // Crear el gráfico de progresión
    createProgressionChart: function() {
        if (!this.elements.progressionChart) {
            console.error("No se encontró el contenedor del gráfico de progresión");
            return;
        }
        
        // Limpiar el contenedor
        this.elements.progressionChart.innerHTML = '';
        
        // Calcular el ancho del gráfico
        const totalWidth = this.elements.progressionChart.clientWidth;
        const timelineWidth = totalWidth - 100; // Reservar espacio para etiquetas
        
        // Calcular el número de días entre la primera y última fecha
        const firstDate = this.chartData[0].date;
        const lastDate = this.chartData[this.chartData.length - 1].date;
        const totalDays = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
        
        // Crear elementos base del gráfico
        const chart = document.createElement('div');
        chart.className = 'progression-chart-container';
        
        // Crear eje Y (niveles de severidad)
        const yAxis = document.createElement('div');
        yAxis.className = 'y-axis';
        
        // Añadir etiquetas para los niveles de severidad
        const severityLevels = [
            { text: "Severo", value: "severo", position: 75 },
            { text: "Moderado", value: "moderado", position: 50 },
            { text: "Leve", value: "leve", position: 25 },
            { text: "No afectación", value: "no", position: 0 }
        ];
        
        severityLevels.forEach(level => {
            const severityLabel = document.createElement('div');
            severityLabel.className = 'severity-label';
            severityLabel.textContent = level.text;
            severityLabel.style.bottom = `${level.position}%`;
            yAxis.appendChild(severityLabel);
            
            // Añadir línea horizontal para cada nivel
            const gridLine = document.createElement('div');
            gridLine.className = 'grid-line';
            gridLine.style.bottom = `${level.position}%`;
            chart.appendChild(gridLine);
        });
        
        chart.appendChild(yAxis);
        
        // Crear eje X (línea de tiempo)
        const xAxis = document.createElement('div');
        xAxis.className = 'x-axis';
        
        // Crear área de puntos de datos
        const plotArea = document.createElement('div');
        plotArea.className = 'plot-area';
        
        // Mapeo de severidad a posición vertical (porcentaje)
        const severityPositions = {
            "no": 0,
            "leve": 25,
            "moderado": 50,
            "severo": 75
        };
        
        // Colores para los puntos según severidad
        const severityColors = {
            "no": "#CCCCCC",
            "leve": "#CCB800",
            "moderado": "#CC7000",
            "severo": "#CC0000"
        };
        
        // Crear puntos para cada área en cada fecha
        this.chartData.forEach((datePoint, dateIndex) => {
            const daysSinceStart = Math.ceil((datePoint.date - firstDate) / (1000 * 60 * 60 * 24));
            const positionX = (daysSinceStart / totalDays) * 100;
            
            // Añadir etiqueta de fecha
            const dateLabel = document.createElement('div');
            dateLabel.className = 'date-label';
            dateLabel.textContent = datePoint.date.toLocaleDateString();
            dateLabel.style.left = `${positionX}%`;
            xAxis.appendChild(dateLabel);
            
            // Crear línea vertical para la fecha
            const dateLine = document.createElement('div');
            dateLine.className = 'date-line';
            dateLine.style.left = `${positionX}%`;
            plotArea.appendChild(dateLine);
            
            // Crear puntos para cada área
            datePoint.areas.forEach(area => {
                const positionY = severityPositions[area.severity] || 0;
                const color = severityColors[area.severity] || "#CCCCCC";
                
                // Crear punto
                const point = document.createElement('div');
                point.className = 'data-point';
                point.style.left = `${positionX}%`;
                point.style.bottom = `${positionY}%`;
                point.style.backgroundColor = color;
                
                // Añadir tooltip con información del área
                point.setAttribute('data-tooltip', `
                    ${area.name}: ${area.severity}
                    Evolución: ${area.evolution}
                `);
                
                // Añadir eventos para mostrar tooltip
                point.addEventListener('mouseenter', function() {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'point-tooltip';
                    tooltip.innerHTML = this.getAttribute('data-tooltip').replace(/\n/g, '<br>');
                    
                    const rect = this.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + window.scrollX}px`;
                    tooltip.style.top = `${rect.top + window.scrollY - 60}px`;
                    
                    document.body.appendChild(tooltip);
                    this.setAttribute('data-tooltip-active', 'true');
                });
                
                point.addEventListener('mouseleave', function() {
                    if (this.getAttribute('data-tooltip-active') === 'true') {
                        const tooltips = document.querySelectorAll('.point-tooltip');
                        tooltips.forEach(tooltip => tooltip.remove());
                        this.removeAttribute('data-tooltip-active');
                    }
                });
                
                plotArea.appendChild(point);
                
                // Si hay un punto previo para esta área, dibujar una línea conectora
                if (dateIndex > 0) {
                    const prevDatePoint = this.chartData[dateIndex - 1];
                    const prevArea = prevDatePoint.areas.find(a => a.name === area.name);
                    
                    if (prevArea) {
                        const prevDaysSinceStart = Math.ceil((prevDatePoint.date - firstDate) / (1000 * 60 * 60 * 24));
                        const prevPositionX = (prevDaysSinceStart / totalDays) * 100;
                        const prevPositionY = severityPositions[prevArea.severity] || 0;
                        
                        // Crear línea conectora
                        const connector = document.createElement('div');
                        connector.className = 'connector-line';
                        
                        // Calcular ángulo y longitud de la línea
                        const dx = positionX - prevPositionX;
                        const dy = positionY - prevPositionY;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                        
                        // Establecer propiedades de la línea
                        connector.style.width = `${length}%`;
                        connector.style.transform = `rotate(${angle}deg)`;
                        connector.style.left = `${prevPositionX}%`;
                        connector.style.bottom = `${prevPositionY}%`;
                        
                        // Color según evolución
                        if (area.evolution === 'mejoria') {
                            connector.style.backgroundColor = '#00CC00'; // Verde para mejoría
                        } else if (area.evolution === 'empeoramiento') {
                            connector.style.backgroundColor = '#CC0000'; // Rojo para empeoramiento
                        }
                        
                        plotArea.appendChild(connector);
                    }
                }
            });
        });
        
        chart.appendChild(plotArea);
        chart.appendChild(xAxis);
        
        // Añadir el gráfico al contenedor
        this.elements.progressionChart.appendChild(chart);
    },
    
    // Actualizar el gráfico de progresión con datos reales
    updateProgressionChart: function(data) {
        if (data && Array.isArray(data)) {
            this.chartData = data;
            this.createProgressionChart();
        }
    },
    
    // Obtener datos de progresión a partir de las áreas seleccionadas
    getProgressionFromSelectedAreas: function() {
        // Se implementaría para convertir EMPA.selectedAreas en datos de progresión
        // con la fecha actual
        const today = new Date();
        
        const currentData = {
            date: today,
            areas: EMPA.selectedAreas.map(area => ({
                name: area.name,
                severity: area.severity,
                evolution: area.evolution
            }))
        };
        
        // Añadir los datos actuales a la serie temporal
        this.chartData.push(currentData);
        
        // Actualizar el gráfico
        this.createProgressionChart();
    }
}; 