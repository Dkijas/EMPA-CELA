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
        
        try {
            // Obtener referencias a elementos DOM
            this.elements.progressionContainer = document.getElementById('progression-container');
            this.elements.progressionChart = document.getElementById('progression-chart');
            
            // Verificar si los elementos existen
            if (!this.elements.progressionContainer) {
                console.warn('No se encontró el contenedor de progresión con ID "progression-container"');
                // Intentar crear el contenedor si no existe
                this.createProgressionContainer();
            }
            
            // Inicializar la sección de progresión si existe
            if (this.elements.progressionContainer) {
                this.setupProgressionSection();
                console.log('Módulo de progresión inicializado correctamente');
            } else {
                console.error('No se pudo inicializar el módulo de progresión: faltan elementos DOM necesarios');
            }
        } catch (error) {
            console.error('Error al inicializar el módulo de progresión:', error);
        }
    },
    
    // Crear contenedor de progresión si no existe
    createProgressionContainer: function() {
        try {
            // Buscar un contenedor adecuado en la tab de anatomía
            const anatomiaTab = document.getElementById('anatomia-tab');
            if (anatomiaTab) {
                // Crear el contenedor de progresión
                const container = document.createElement('div');
                container.id = 'progression-container';
                container.className = 'progression-section';
                container.innerHTML = `
                    <h3>Evolución temporal de la enfermedad</h3>
                    <div id="progression-chart" class="progression-chart"></div>
                `;
                
                // Añadir al final de la tab de anatomía
                anatomiaTab.appendChild(container);
                
                // Actualizar referencia
                this.elements.progressionContainer = container;
                this.elements.progressionChart = document.getElementById('progression-chart');
                
                console.log('Contenedor de progresión creado dinámicamente');
                return true;
            } else {
                console.warn('No se encontró la tab de anatomía para añadir el contenedor de progresión');
                return false;
            }
        } catch (error) {
            console.error('Error al crear el contenedor de progresión:', error);
            return false;
        }
    },
    
    // Configurar la sección de progresión
    setupProgressionSection: function() {
        try {
            // Verificar que existen los elementos necesarios
            if (!this.elements.progressionChart) {
                console.error('No se encontró el elemento para el gráfico de progresión');
                return;
            }
            
            // Limpiar datos de ejemplo anteriores
            this.chartData = [];
            
            // Obtener datos de las áreas seleccionadas por el usuario
            this.getProgressionFromSelectedAreas();
            
            // Crear el gráfico de progresión
            this.createProgressionChart();
        } catch (error) {
            console.error('Error al configurar la sección de progresión:', error);
        }
    },
    
    // Método para obtener datos de progresión - no usamos datos de ejemplo
    initSampleData: function() {
        // Esta función ya no inicializa datos de ejemplo
        // En su lugar, simplemente inicializa un array vacío
        this.chartData = [];
        console.log('Datos de progresión inicializados como vacíos - esperando datos reales del usuario');
    },
    
    // Crear el gráfico de progresión
    createProgressionChart: function() {
        try {
            if (!this.elements.progressionChart) {
                console.error("No se encontró el contenedor del gráfico de progresión");
                return;
            }
            
            // Verificar si hay suficientes datos para mostrar
            if (!this.chartData || this.chartData.length === 0) {
                this.elements.progressionChart.innerHTML = '<div class="empty-chart-message">No hay datos disponibles para mostrar la evolución.</div>';
                return;
            }
            
            console.log('Creando gráfico de progresión con', this.chartData.length, 'puntos de datos');
            
            // Limpiar el contenedor
            this.elements.progressionChart.innerHTML = '';
            
            // Filtrar datos válidos (asegurarse de que tengan fecha y áreas)
            let datosValidos = this.chartData.filter(item => item && item.date && item.areas);
            
            // Verificar si quedan datos después del filtro
            if (datosValidos.length === 0) {
                this.elements.progressionChart.innerHTML = '<div class="empty-chart-message">Los datos de progresión no son válidos.</div>';
                return;
            }
            
            // Convertir todas las fechas a objetos Date
            datosValidos = datosValidos.map(item => {
                // Si ya es un objeto Date, dejarlo como está
                if (item.date instanceof Date) {
                    return item;
                }
                // Intentar convertir a Date
                try {
                    return {
                        ...item,
                        date: new Date(item.date)
                    };
                } catch (e) {
                    console.error('Error al convertir fecha:', e);
                    // Usar fecha actual como fallback
                    return {
                        ...item,
                        date: new Date()
                    };
                }
            });
            
            // Ordenar los datos por fecha
            datosValidos.sort((a, b) => a.date - b.date);
            
            // Reemplazar chartData con los datos filtrados y ordenados
            this.chartData = datosValidos;
            
            // Calcular el ancho del gráfico
            const totalWidth = this.elements.progressionChart.clientWidth || 600;
            const timelineWidth = totalWidth - 100; // Reservar espacio para etiquetas
            
            // Verificar que haya suficientes datos después de ordenar
            if (!this.chartData[0]) {
                console.error("Datos de progresión inválidos después del filtrado");
                this.elements.progressionChart.innerHTML = '<div class="empty-chart-message">Error en los datos de progresión.</div>';
                return;
            }
            
            // Calcular el número de días entre la primera y última fecha
            const firstDate = this.chartData[0].date;
            const lastDate = this.chartData[this.chartData.length - 1].date;
            
            // Si solo hay un punto de datos, añadir un día antes y después para mostrar algo
            let totalDays = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
            if (totalDays < 1) totalDays = 2; // Asegurar un período mínimo
            
            // Crear elementos base del gráfico
            const chart = document.createElement('div');
            chart.className = 'chart-container';
            chart.style.height = '300px';
            chart.style.position = 'relative';
            chart.style.marginBottom = '30px';
            
            // Crear eje Y (niveles de severidad)
            const yAxis = document.createElement('div');
            yAxis.className = 'chart-y-axis';
            yAxis.style.position = 'absolute';
            yAxis.style.left = '0';
            yAxis.style.top = '0';
            yAxis.style.bottom = '0';
            yAxis.style.width = '80px';
            
            // Añadir etiquetas para los niveles de severidad
            const severityLevels = [
                { text: "Grave", value: "severo", position: 75 },
                { text: "Moderada", value: "moderado", position: 50 },
                { text: "Leve", value: "leve", position: 25 },
                { text: "No afectación", value: "no", position: 0 }
            ];
            
            severityLevels.forEach(level => {
                const severityLabel = document.createElement('div');
                severityLabel.className = 'chart-y-label';
                severityLabel.textContent = level.text;
                severityLabel.style.position = 'absolute';
                severityLabel.style.right = '5px';
                severityLabel.style.bottom = `${level.position}%`;
                severityLabel.style.transform = 'translateY(50%)';
                yAxis.appendChild(severityLabel);
                
                // Añadir línea horizontal para cada nivel
                const gridLine = document.createElement('div');
                gridLine.className = 'chart-grid';
                gridLine.style.position = 'absolute';
                gridLine.style.left = '80px';
                gridLine.style.right = '0';
                gridLine.style.bottom = `${level.position}%`;
                gridLine.style.borderBottom = '1px dashed #ccc';
                chart.appendChild(gridLine);
            });
            
            chart.appendChild(yAxis);
            
            // Crear eje X (línea de tiempo)
            const xAxis = document.createElement('div');
            xAxis.className = 'chart-x-axis';
            xAxis.style.position = 'absolute';
            xAxis.style.left = '80px';
            xAxis.style.right = '0';
            xAxis.style.bottom = '0';
            xAxis.style.height = '30px';
            xAxis.style.borderTop = '1px solid #333';
            
            // Crear área de puntos de datos
            const plotArea = document.createElement('div');
            plotArea.className = 'chart-plot-area';
            plotArea.style.position = 'absolute';
            plotArea.style.left = '80px';
            plotArea.style.right = '0';
            plotArea.style.top = '0';
            plotArea.style.bottom = '30px';
            
            // Mapeo de severidad a posición vertical (porcentaje)
            const severityPositions = {
                "no": 0,
                "leve": 25,
                "moderada": 50,
                "moderado": 50,
                "grave": 75,
                "severo": 75,
                "severa": 75
            };
            
            // Colores para los puntos según severidad
            const severityColors = {
                "no": "#CCCCCC",
                "leve": "#CCB800",
                "moderada": "#CC7000",
                "moderado": "#CC7000",
                "grave": "#CC0000",
                "severo": "#CC0000",
                "severa": "#CC0000"
            };
            
            // Crear puntos para cada área en cada fecha
            this.chartData.forEach((datePoint, dateIndex) => {
                const currentDate = new Date(datePoint.date);
                const daysSinceStart = Math.ceil((currentDate - firstDate) / (1000 * 60 * 60 * 24));
                const positionX = (daysSinceStart / totalDays) * 100;
                
                // Añadir etiqueta de fecha
                const dateLabel = document.createElement('div');
                dateLabel.className = 'chart-x-label';
                dateLabel.textContent = currentDate.toLocaleDateString();
                dateLabel.style.position = 'absolute';
                dateLabel.style.bottom = '-25px';
                dateLabel.style.left = `${positionX}%`;
                dateLabel.style.transform = 'translateX(-50%)';
                xAxis.appendChild(dateLabel);
                
                // Crear línea vertical para la fecha
                const dateLine = document.createElement('div');
                dateLine.className = 'chart-date-line';
                dateLine.style.position = 'absolute';
                dateLine.style.top = '0';
                dateLine.style.bottom = '0';
                dateLine.style.left = `${positionX}%`;
                dateLine.style.width = '1px';
                dateLine.style.backgroundColor = '#999';
                plotArea.appendChild(dateLine);
                
                // Crear un objeto para contar áreas por nivel de severidad
                // para aplicar pequeños desplazamientos y evitar solapamientos
                const severityCounts = {
                    "no": 0,
                    "leve": 0,
                    "moderada": 0,
                    "moderado": 0,
                    "grave": 0,
                    "severo": 0,
                    "severa": 0
                };
                
                // Crear puntos para cada área
                if (datePoint.areas && datePoint.areas.length > 0) {
                    datePoint.areas.forEach(area => {
                        const severityValue = area.severity || 'leve';
                        const positionY = severityPositions[severityValue] || 0;
                        const color = severityColors[severityValue] || "#CCB800";
                        
                        // Incrementar contador para esta severidad
                        severityCounts[severityValue]++;
                        
                        // Calcular desplazamiento horizontal para evitar solapamiento
                        // Cada punto sucesivo con la misma severidad se desplazará un poco
                        const offsetX = (severityCounts[severityValue] - 1) * 3;
                        
                        // Pequeño desplazamiento vertical aleatorio para evitar solapamiento exacto
                        const offsetY = severityCounts[severityValue] % 3 - 1; // -1, 0, o 1
                        
                        // Crear punto
                        const point = document.createElement('div');
                        point.className = `chart-point dot-${severityValue}`;
                        point.style.position = 'absolute';
                        point.style.width = '12px';
                        point.style.height = '12px';
                        point.style.borderRadius = '50%';
                        point.style.backgroundColor = color;
                        
                        // Generar un color de borde distinto para cada área basado en su nombre
                        const hashCode = function(str) {
                            let hash = 0;
                            for (let i = 0; i < str.length; i++) {
                                const char = str.charCodeAt(i);
                                hash = ((hash << 5) - hash) + char;
                                hash = hash & hash;
                            }
                            return hash;
                        };
                        
                        const hue = Math.abs(hashCode(area.name)) % 360;
                        const borderColor = `hsl(${hue}, 70%, 40%)`;
                        
                        point.style.border = `2px solid ${borderColor}`;
                        point.style.left = `calc(${positionX}% + ${offsetX}px)`;
                        point.style.bottom = `calc(${positionY}% + ${offsetY}px)`;
                        point.style.transform = 'translate(-50%, 50%)';
                        point.style.zIndex = '10';
                        point.dataset.areaId = area.name.replace(/\s+/g, '-').toLowerCase();
                        
                        // Información del área para el tooltip
                        const tooltipInfo = `
                            <strong style="color:${borderColor}">${area.name}</strong><br>
                            Severidad: <span style="color:${color};font-weight:bold;">${this.getSeverityLabel(severityValue)}</span><br>
                            ${area.evolution ? 'Evolución: <span style="' + 
                              (area.evolution === 'mejoria' ? 'color:#00CC00;' : 
                               area.evolution === 'empeoramiento' ? 'color:#CC0000;' : 'color:#999999;') + 
                              'font-weight:bold;">' + this.getEvolutionText(area.evolution) + '</span>' : ''}
                        `;
                        
                        // Añadir evento para mostrar tooltip
                        point.addEventListener('mouseenter', function() {
                            const tooltip = document.createElement('div');
                            tooltip.className = 'chart-tooltip';
                            tooltip.innerHTML = tooltipInfo.trim();
                            tooltip.style.position = 'absolute';
                            tooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
                            tooltip.style.color = 'white';
                            tooltip.style.padding = '8px 12px';
                            tooltip.style.borderRadius = '4px';
                            tooltip.style.zIndex = '100';
                            tooltip.style.pointerEvents = 'none';
                            tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
                            
                            document.body.appendChild(tooltip);
                            
                            // Posicionar tooltip arriba o abajo del punto dependiendo del espacio disponible
                            const rect = this.getBoundingClientRect();
                            const tooltipHeight = tooltip.offsetHeight;
                            const viewportHeight = window.innerHeight;
                            
                            // Verificar si hay espacio arriba
                            if (rect.top > tooltipHeight + 10) {
                                // Colocar arriba
                                tooltip.style.left = `${rect.left + window.scrollX}px`;
                                tooltip.style.top = `${rect.top + window.scrollY - tooltipHeight - 10}px`;
                            } else {
                                // Colocar abajo
                                tooltip.style.left = `${rect.left + window.scrollX}px`;
                                tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
                            }
                            
                            // Ajustar horizontalmente si se sale de la pantalla
                            const tooltipRect = tooltip.getBoundingClientRect();
                            if (tooltipRect.right > window.innerWidth) {
                                tooltip.style.left = `${window.innerWidth - tooltipRect.width - 10 + window.scrollX}px`;
                            }
                            if (tooltipRect.left < 0) {
                                tooltip.style.left = `${window.scrollX + 10}px`;
                            }
                            
                            // Guardar referencia al tooltip
                            this.tooltip = tooltip;
                        });
                        
                        point.addEventListener('mouseleave', function() {
                            if (this.tooltip) {
                                this.tooltip.remove();
                                this.tooltip = null;
                            }
                        });
                        
                        plotArea.appendChild(point);
                        
                        // Si hay un punto previo para esta área, dibujar una línea conectora
                        if (dateIndex > 0) {
                            const prevDatePoint = this.chartData[dateIndex - 1];
                            if (prevDatePoint.areas) {
                                const prevArea = prevDatePoint.areas.find(a => a.name === area.name);
                                
                                if (prevArea) {
                                    const prevDate = new Date(prevDatePoint.date);
                                    const prevDaysSinceStart = Math.ceil((prevDate - firstDate) / (1000 * 60 * 60 * 24));
                                    const prevPositionX = (prevDaysSinceStart / totalDays) * 100;
                                    const prevSeverity = prevArea.severity || 'leve';
                                    const prevPositionY = severityPositions[prevSeverity] || 0;
                                    
                                    // Encontrar el offsetX del punto anterior si existe
                                    const prevSeverityCounts = {};
                                    let prevOffsetX = 0;
                                    let prevOffsetY = 0;
                                    
                                    // Contar puntos anteriores con la misma severidad
                                    if (prevDatePoint.areas) {
                                        prevDatePoint.areas.forEach((a, index) => {
                                            const aSeverity = a.severity || 'leve';
                                            prevSeverityCounts[aSeverity] = (prevSeverityCounts[aSeverity] || 0) + 1;
                                            
                                            if (a.name === area.name) {
                                                prevOffsetX = (prevSeverityCounts[aSeverity] - 1) * 3;
                                                prevOffsetY = prevSeverityCounts[aSeverity] % 3 - 1;
                                            }
                                        });
                                    }
                                    
                                    // Calcular coordenadas de inicio y fin ajustadas con los desplazamientos
                                    const x1 = `calc(${prevPositionX}% + ${prevOffsetX}px - 6px)`;
                                    const y1 = `calc(${prevPositionY}% + ${prevOffsetY}px + 6px)`;
                                    const x2 = `calc(${positionX}% + ${offsetX}px - 6px)`;
                                    const y2 = `calc(${positionY}% + ${offsetY}px + 6px)`;
                                    
                                    // Crear línea SVG para conectar puntos
                                    const svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                    svgLine.style.position = 'absolute';
                                    svgLine.style.left = '0';
                                    svgLine.style.top = '0';
                                    svgLine.style.width = '100%';
                                    svgLine.style.height = '100%';
                                    svgLine.style.overflow = 'visible';
                                    svgLine.setAttribute('pointer-events', 'none');
                                    
                                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                                    line.setAttribute('x1', x1);
                                    line.setAttribute('y1', y1);
                                    line.setAttribute('x2', x2);
                                    line.setAttribute('y2', y2);
                                    line.setAttribute('stroke-width', '2');
                                    
                                    // Color según evolución
                                    if (area.evolution === 'mejoria') {
                                        line.setAttribute('stroke', '#00CC00'); // Verde para mejoría
                                    } else if (area.evolution === 'empeoramiento') {
                                        line.setAttribute('stroke', '#CC0000'); // Rojo para empeoramiento
                                    } else {
                                        line.setAttribute('stroke', '#999999'); // Gris para estable
                                    }
                                    
                                    svgLine.appendChild(line);
                                    plotArea.appendChild(svgLine);
                                }
                            }
                        }
                    });
                }
            });
            
            chart.appendChild(plotArea);
            chart.appendChild(xAxis);
            
            // Añadir el gráfico al contenedor
            this.elements.progressionChart.appendChild(chart);
            
            console.log('Gráfico de progresión creado correctamente');
        } catch (error) {
            console.error('Error al crear el gráfico de progresión:', error);
            // Mostrar mensaje de error en el contenedor
            if (this.elements.progressionChart) {
                this.elements.progressionChart.innerHTML = '<div class="empty-chart-message">Error al crear el gráfico de progresión. Por favor, recargue la página.</div>';
            }
        }
    },
    
    // Obtener etiqueta para un nivel de severidad
    getSeverityLabel: function(severity) {
        switch (severity) {
            case 'leve': return 'Leve';
            case 'moderada': return 'Moderada';
            case 'moderado': return 'Moderada';
            case 'grave': return 'Grave';
            case 'severo': return 'Grave';
            case 'severa': return 'Grave';
            case 'no': return 'No afectación';
            default: return 'No especificada';
        }
    },
    
    // Obtener texto para un tipo de evolución
    getEvolutionText: function(evolution) {
        switch (evolution) {
            case 'estable': return 'Estable';
            case 'mejoria': return 'Mejoría';
            case 'empeoramiento': return 'Empeoramiento';
            default: return 'No especificada';
        }
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
        try {
            console.log('Obteniendo datos de progresión a partir de áreas seleccionadas');
            
            // Verificar la existencia de las áreas seleccionadas
            let areasSeleccionadas = [];
            
            // Intentar obtener las áreas desde el módulo EMPA
            if (typeof EMPA !== 'undefined' && EMPA.selectedAreas) {
                areasSeleccionadas = EMPA.selectedAreas;
                console.log('Áreas obtenidas desde EMPA:', areasSeleccionadas.length);
            } 
            // Intentar obtener las áreas desde EMPA_ANATOMY
            else if (typeof EMPA_ANATOMY !== 'undefined' && EMPA_ANATOMY.selectedAreas) {
                areasSeleccionadas = EMPA_ANATOMY.selectedAreas;
                console.log('Áreas obtenidas desde EMPA_ANATOMY:', areasSeleccionadas.length);
            }
            
            // Verificar si hay áreas seleccionadas
            if (!areasSeleccionadas || areasSeleccionadas.length === 0) {
                console.log('No hay áreas seleccionadas para mostrar en el gráfico de progresión');
                
                // No hay datos introducidos por el usuario, mostrar mensaje claro
                this.chartData = [];
                if (this.elements.progressionChart) {
                    this.elements.progressionChart.innerHTML = '<div class="empty-chart-message">Aún no ha seleccionado ningún área anatómica.<br>Haga clic en la imagen para añadir áreas afectadas.</div>';
                }
                return;
            }
            
            const today = new Date();
            
            // Crear objeto con los datos actuales
            const currentData = {
                date: today,
                areas: areasSeleccionadas.map(area => ({
                    name: area.name || 'Área personalizada',
                    severity: area.severity || 'leve',
                    evolution: area.evolution || 'estable'
                }))
            };
            
            // Si no hay datos previos, inicializar con los datos actuales
            if (!this.chartData || this.chartData.length === 0) {
                this.chartData = [currentData];
            } else {
                // Verificar si ya hay una entrada para hoy
                const todayString = today.toDateString();
                const existingTodayIndex = this.chartData.findIndex(entry => {
                    if (!entry || !entry.date) return false;
                    try {
                        const entryDate = new Date(entry.date);
                        return entryDate.toDateString() === todayString;
                    } catch (e) {
                        console.error('Error al comparar fechas:', e);
                        return false;
                    }
                });
                
                if (existingTodayIndex >= 0) {
                    // Actualizar entrada existente para hoy
                    this.chartData[existingTodayIndex] = currentData;
                } else {
                    // Añadir nueva entrada para hoy
                    this.chartData.push(currentData);
                }
            }
            
            console.log('Datos de progresión actualizados:', this.chartData);
            
            // Actualizar el gráfico
            this.createProgressionChart();
        } catch (error) {
            console.error('Error al obtener datos de progresión:', error);
            // Intentar mostrar un mensaje de error si el elemento está disponible
            if (this.elements.progressionChart) {
                this.elements.progressionChart.innerHTML = '<div class="empty-chart-message">Error al procesar los datos de progresión.</div>';
            }
        }
    },
    
    // Método activado cuando se selecciona la pestaña
    onTabActivated: function() {
        console.log('Activando módulo de progresión desde onTabActivated');
        
        try {
            // Volver a buscar elementos DOM en caso de que hayan cambiado
            this.elements.progressionContainer = document.getElementById('progression-container');
            this.elements.progressionChart = document.getElementById('progression-chart');
            
            // Verificar si existen los elementos
            if (!this.elements.progressionContainer || !this.elements.progressionChart) {
                console.warn('Contenedor de progresión no encontrado, intentando crear');
                this.createProgressionContainer();
            }
            
            // Resetear cualquier dato de ejemplo anterior
            this.chartData = [];
            
            // Actualizar la progresión con las áreas seleccionadas actuales
            this.getProgressionFromSelectedAreas();
        } catch (error) {
            console.error('Error al activar pestaña de progresión:', error);
        }
    }
}; 