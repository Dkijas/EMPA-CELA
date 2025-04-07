/**
 * Módulo para el manejo de la evaluación respiratoria
 * @module EMPA_RESPIRATORY
 */
const EMPA_RESPIRATORY = (function() {
    // Estado privado
    let isInitialized = false;
    
    // Estructura de datos para guardar información respiratoria
    let respiratoryData = {
        capacidad: {
            cvf: null,
            pim: null,
            pem: null,
            saturacion: null
        },
        sintomas: [],
        dispositivos: {
            vmni: {
                enUso: false,
                tipo: null,
                horasUso: null,
                fechaInicio: null,
                periodos: []
            },
            vmi: {
                enUso: false,
                tipo: null,
                fechaInicio: null,
                dependencia: null
            },
            otrosDispositivos: []
        },
        dispositivosIndicados: {
            tipos: [],
            motivo: null,
            observaciones: null
        }
    };

    // Rangos de referencia para parámetros respiratorios
    const rangosReferencia = {
        cvf: { min: 80, max: 100, unidad: '%', nombre: 'Capacidad Vital Forzada' },
        pim: { min: 75, max: 130, unidad: 'cmH₂O', nombre: 'Presión Inspiratoria Máxima' },
        pem: { min: 80, max: 120, unidad: 'cmH₂O', nombre: 'Presión Espiratoria Máxima' },
        saturacion: { min: 95, max: 100, unidad: '%', nombre: 'Saturación de Oxígeno' }
    };

    // Referencias a elementos DOM
    let elements = null;

    /**
     * Inicializa las referencias a elementos DOM
     * @returns {Object} Objeto con las referencias a elementos DOM
     */
    function initializeElements() {
        return {
            // Formulario y contenedor
            form: document.getElementById('soporte-respiratorio-form'),
            tab: document.getElementById('respiratorio-tab'),
            
            // Capacidad ventilatoria
            cvf: document.getElementById('capacidad-vital-forzada'),
            pim: document.getElementById('presion-inspiratoria'),
            pem: document.getElementById('presion-espiratoria'),
            saturacion: document.getElementById('saturacion-oxigeno'),
            
            // Checkboxes para síntomas
            sintomasCheckboxes: document.querySelectorAll('input[name="sintomas-respiratorios"]'),
            
            // VMNI
            vmniCheckbox: document.getElementById('uso-vmni'),
            vmniDetails: document.getElementById('vmni-details'),
            tipoVmni: document.getElementById('tipo-vmni'),
            horasVmni: document.getElementById('horas-vmni'),
            inicioVmni: document.getElementById('inicio-vmni'),
            periodosVmni: document.querySelectorAll('input[name="periodos-vmni"]'),
            
            // VMI
            vmiCheckbox: document.getElementById('uso-vmi'),
            vmiDetails: document.getElementById('vmi-details'),
            tipoVmi: document.getElementById('tipo-vmi'),
            inicioVmi: document.getElementById('inicio-vmi'),
            dependenciaVmi: document.getElementById('dependencia-vmi'),
            
            // Otros dispositivos
            otrosDispositivos: document.querySelectorAll('input[name="otros-dispositivos"]'),
            
            // Dispositivos indicados
            dispositivosIndicados: document.querySelectorAll('input[name="dispositivos-indicados"]'),
            motivoNoUso: document.getElementById('motivo-no-uso'),
            notasDispositivos: document.getElementById('notas-dispositivos'),
            
            // Botones
            guardarBtn: document.getElementById('guardar-respiratorio'),
            cancelarBtn: document.getElementById('cancelar-respiratorio')
        };
    }

    /**
     * Inicializa el módulo de evaluación respiratoria
     */
    function initialize() {
        if (isInitialized) {
            console.warn('El módulo respiratorio ya está inicializado');
            return;
        }

        console.log('Inicializando módulo de evaluación respiratoria...');
        
        try {
            // Inicializar elementos
            elements = initializeElements();
            
            if (!validateElements()) {
                console.error('No se pudieron encontrar todos los elementos necesarios para el módulo respiratorio');
                return;
            }
            
            // Añadir estilos para el feedback de evaluación
            addFeedbackStyles();
            
            // Añadir botón para generar gráfico
            addChartButton();
            
            // Configurar event listeners
            setupEventListeners();
            
            isInitialized = true;
            console.log('Módulo de evaluación respiratoria inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar el módulo respiratorio:', error);
            throw error;
        }
    }
    
    /**
     * Valida que todos los elementos necesarios existan en el DOM
     * @returns {boolean} True si todos los elementos existen
     */
    function validateElements() {
        // Verificar elementos críticos
        if (!elements.form || !elements.tab) {
            return false;
        }
        
        // Si falta alguno de los campos numéricos, no es crítico pero loguear
        if (!elements.cvf || !elements.pim || !elements.pem || !elements.saturacion) {
            console.warn('Algunos campos de capacidad ventilatoria no están disponibles');
        }
        
        // Verificar si los controles principales de dispositivos están disponibles
        if (!elements.vmniCheckbox || !elements.vmiCheckbox || 
            !elements.guardarBtn || !elements.cancelarBtn) {
            console.warn('Algunos controles de dispositivos no están disponibles');
        }
        
        return true;
    }
    
    /**
     * Configura los event listeners para el formulario
     */
    function setupEventListeners() {
        // Mostrar/ocultar detalles VMNI con animación
        if (elements.vmniCheckbox && elements.vmniDetails) {
            elements.vmniCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    elements.vmniDetails.style.display = 'block';
                    setTimeout(() => {
                        elements.vmniDetails.classList.add('active');
                    }, 10);
                } else {
                    elements.vmniDetails.classList.remove('active');
                    setTimeout(() => {
                        elements.vmniDetails.style.display = 'none';
                    }, 300);
                }
            });
        }
        
        // Mostrar/ocultar detalles VMI con animación
        if (elements.vmiCheckbox && elements.vmiDetails) {
            elements.vmiCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    elements.vmiDetails.style.display = 'block';
                    // Usar setTimeout para permitir que el display:block tome efecto primero
                    setTimeout(() => {
                        elements.vmiDetails.classList.add('active');
                    }, 10);
                } else {
                    elements.vmiDetails.classList.remove('active');
                    // Esperar a que termine la animación antes de ocultar
                    setTimeout(() => {
                        elements.vmiDetails.style.display = 'none';
                    }, 300);
                }
            });
        }
        
        // Vincular el botón de generar gráfico
        const generateChartBtn = document.getElementById('generar-grafico-btn');
        if (generateChartBtn) {
            generateChartBtn.addEventListener('click', function() {
                createRespiratoryChart();
                // Mostrar el contenedor del gráfico
                const chartContainer = document.getElementById('respiratory-chart-container');
                if (chartContainer) {
                    chartContainer.style.display = 'block';
                    setTimeout(() => {
                        chartContainer.classList.add('active');
                        // Desplazar suavemente hacia el gráfico
                        chartContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 10);
                }
            });
        }
        
        // Evento para guardar datos
        if (elements.guardarBtn) {
            elements.guardarBtn.addEventListener('click', saveRespiratoryData);
        }
        
        // Evento para cancelar/limpiar formulario con confirmación
        if (elements.cancelarBtn) {
            elements.cancelarBtn.addEventListener('click', function() {
                if (confirm('¿Está seguro que desea cancelar? Se perderán los cambios no guardados.')) {
                    resetForm();
                }
            });
        }
        
        // Configurar validación para campos numéricos
        setupInputValidations();
        
        // Añadir eventos para evaluar parámetros cuando cambien
        setupEvaluationListeners();
    }
    
    /**
     * Configura los event listeners para la evaluación de parámetros
     */
    function setupEvaluationListeners() {
        // Parámetros a monitorear
        const paramInputs = [elements.cvf, elements.pim, elements.pem, elements.saturacion];
        
        // Añadir evento de cambio a cada input
        paramInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', evaluateRespiratoryParameters);
                input.addEventListener('change', evaluateRespiratoryParameters);
                input.addEventListener('blur', evaluateRespiratoryParameters);
            }
        });
        
        // También evaluar cuando se cargue la pestaña
        if (elements.tab) {
            elements.tab.addEventListener('tabactivate', evaluateRespiratoryParameters);
        }
    }
    
    /**
     * Configura validaciones para los campos de entrada
     */
    function setupInputValidations() {
        // Validación para CVF (0-100%)
        if (elements.cvf) {
            elements.cvf.addEventListener('input', function() {
                let value = parseFloat(this.value);
                if (isNaN(value)) return;
                
                if (value < 0) this.value = 0;
                if (value > 100) this.value = 100;
                
                // Evaluar después de modificar
                evaluateRespiratoryParameters();
            });
        }
        
        // Validación para PIM (0-150 cmH2O)
        if (elements.pim) {
            elements.pim.addEventListener('input', function() {
                let value = parseFloat(this.value);
                if (isNaN(value)) return;
                
                if (value < 0) this.value = 0;
                if (value > 150) this.value = 150;
                
                // Evaluar después de modificar
                evaluateRespiratoryParameters();
            });
        }
        
        // Validación para PEM (0-150 cmH2O)
        if (elements.pem) {
            elements.pem.addEventListener('input', function() {
                let value = parseFloat(this.value);
                if (isNaN(value)) return;
                
                if (value < 0) this.value = 0;
                if (value > 150) this.value = 150;
                
                // Evaluar después de modificar
                evaluateRespiratoryParameters();
            });
        }
        
        // Validación para Saturación de Oxígeno (70-100%)
        if (elements.saturacion) {
            elements.saturacion.addEventListener('input', function() {
                let value = parseFloat(this.value);
                if (isNaN(value)) return;
                
                if (value < 70) this.value = 70;
                if (value > 100) this.value = 100;
                
                // Evaluar después de modificar
                evaluateRespiratoryParameters();
            });
        }
        
        // Validación para horas de uso VMNI (0-24 h/día)
        if (elements.horasVmni) {
            elements.horasVmni.addEventListener('input', function() {
                let value = parseFloat(this.value);
                if (isNaN(value)) return;
                
                if (value < 0) this.value = 0;
                if (value > 24) this.value = 24;
            });
        }
    }
    
    /**
     * Guarda los datos del formulario respiratorio
     */
    function saveRespiratoryData() {
        // Recopilar los datos del formulario
        respiratoryData = collectFormData();
        
        try {
            // Guardar en localStorage si está disponible
            if (localStorage) {
                localStorage.setItem('empa_respiratory_data', JSON.stringify(respiratoryData));
                console.log('Datos respiratorios guardados en localStorage');
            }
            
            // Mostrar mensaje de éxito
            alert('Los datos de evaluación respiratoria han sido guardados correctamente.');
            
            // Evaluar parámetros después de guardar
            evaluateRespiratoryParameters();
            
            return true;
        } catch (error) {
            console.error('Error al guardar datos respiratorios:', error);
            alert('No se pudieron guardar los datos. ' + error.message);
            return false;
        }
    }
    
    /**
     * Crea un gráfico visual con los parámetros respiratorios
     */
    function createRespiratoryChart() {
        console.log('Creando gráfico de parámetros respiratorios...');
        
        // Obtener el contenedor del gráfico
        const chartContainer = document.getElementById('respiratory-chart-container');
        if (!chartContainer) {
            console.error('No se encontró el contenedor del gráfico');
            return;
        }
        
        // Limpiar contenido existente
        chartContainer.innerHTML = '';
        
        // Crear el div para el gráfico
        const chartDiv = document.createElement('div');
        chartDiv.id = 'respiratory-chart';
        chartDiv.style.height = '250px';
        chartDiv.style.position = 'relative';
        chartDiv.style.marginTop = '20px';
        chartDiv.style.marginBottom = '30px';
        chartDiv.style.display = 'flex';
        chartDiv.style.justifyContent = 'space-around';
        chartDiv.style.alignItems = 'flex-end';
        chartDiv.style.padding = '20px';
        chartDiv.style.backgroundColor = '#fff';
        chartDiv.style.borderRadius = '8px';
        chartDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        
        chartContainer.appendChild(chartDiv);
        
        // Obtener valores para el gráfico
        const cvfValue = elements.cvf ? parseFloat(elements.cvf.value) || null : null;
        const pimValue = elements.pim ? parseFloat(elements.pim.value) || null : null;
        const pemValue = elements.pem ? parseFloat(elements.pem.value) || null : null;
        const satValue = elements.saturacion ? parseFloat(elements.saturacion.value) || null : null;
        
        // Verificar si hay suficientes datos para mostrar
        if (!cvfValue && !pimValue && !pemValue && !satValue) {
            const noDataMsg = document.createElement('p');
            noDataMsg.className = 'no-data';
            noDataMsg.textContent = 'No hay suficientes datos para mostrar el gráfico. Introduzca al menos un valor de capacidad ventilatoria.';
            noDataMsg.style.textAlign = 'center';
            noDataMsg.style.padding = '40px 20px';
            noDataMsg.style.color = '#666';
            noDataMsg.style.fontStyle = 'italic';
            chartDiv.appendChild(noDataMsg);
            return;
        }
        
        // Definir parámetros para mostrar en el gráfico
        const params = [
            { id: 'cvf', value: cvfValue, label: 'CVF', min: rangosReferencia.cvf.min, max: rangosReferencia.cvf.max, unidad: '%' },
            { id: 'pim', value: pimValue, label: 'PIM', min: rangosReferencia.pim.min, max: rangosReferencia.pim.max, unidad: 'cmH₂O' },
            { id: 'pem', value: pemValue, label: 'PEM', min: rangosReferencia.pem.min, max: rangosReferencia.pem.max, unidad: 'cmH₂O' },
            { id: 'sat', value: satValue, label: 'Sat O₂', min: rangosReferencia.saturacion.min, max: rangosReferencia.saturacion.max, unidad: '%' }
        ];
        
        // Filtrar solo los parámetros con valores
        const validParams = params.filter(p => p.value !== null && p.value !== undefined && !isNaN(p.value));
        
        // Crear barras para cada parámetro
        validParams.forEach((param, index) => {
            const barContainer = document.createElement('div');
            barContainer.className = 'chart-bar-container';
            barContainer.style.display = 'flex';
            barContainer.style.flexDirection = 'column';
            barContainer.style.alignItems = 'center';
            barContainer.style.width = `${90 / validParams.length}%`;
            
            // Determinar si el valor está dentro del rango normal
            const isNormal = param.value >= param.min && param.value <= param.max;
            
            // Crear barra
            const bar = document.createElement('div');
            bar.className = `chart-bar ${isNormal ? 'normal-bar' : 'altered-bar'}`;
            bar.style.width = '40px';
            bar.style.backgroundColor = isNormal ? '#4CAF50' : '#FF9800';
            bar.style.borderRadius = '4px 4px 0 0';
            bar.style.position = 'relative';
            bar.style.transition = 'height 0.8s ease-out';
            
            // Calcular altura de la barra
            let heightPercent;
            if (param.id === 'sat') {
                heightPercent = ((param.value - 70) / 30) * 100;
            } else if (param.id === 'cvf') {
                heightPercent = param.value;
            } else {
                const maxRef = Math.max(param.max * 1.2, 150);
                heightPercent = (param.value / maxRef) * 100;
            }
            
            // Limitar altura entre 5% y 95%
            heightPercent = Math.min(Math.max(heightPercent, 5), 95);
            
            // Aplicar altura con animación
            setTimeout(() => {
                bar.style.height = `${heightPercent}%`;
            }, 100);
            
            // Añadir valor en la parte superior
            const valueLabel = document.createElement('div');
            valueLabel.className = 'chart-value';
            valueLabel.textContent = `${param.value}${param.unidad}`;
            valueLabel.style.position = 'absolute';
            valueLabel.style.top = '-25px';
            valueLabel.style.width = '100%';
            valueLabel.style.textAlign = 'center';
            valueLabel.style.color = isNormal ? '#2C7A33' : '#E65100';
            valueLabel.style.fontWeight = 'bold';
            bar.appendChild(valueLabel);
            
            // Añadir etiqueta del parámetro
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = param.label;
            label.style.marginTop = '10px';
            label.style.fontWeight = 'bold';
            label.style.color = '#333';
            
            // Añadir rango de referencia
            const rangeLabel = document.createElement('div');
            rangeLabel.className = 'chart-range';
            rangeLabel.textContent = `(${param.min}-${param.max}${param.unidad})`;
            rangeLabel.style.fontSize = '12px';
            rangeLabel.style.color = '#666';
            rangeLabel.style.marginTop = '5px';
            
            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            barContainer.appendChild(rangeLabel);
            chartDiv.appendChild(barContainer);
        });
        
        // Añadir leyenda
        const legend = document.createElement('div');
        legend.className = 'chart-legend';
        legend.style.display = 'flex';
        legend.style.justifyContent = 'center';
        legend.style.gap = '20px';
        legend.style.marginTop = '20px';
        
        // Leyenda para valores normales
        const normalLegend = createLegendItem('#4CAF50', 'Valores normales');
        const alteredLegend = createLegendItem('#FF9800', 'Valores alterados');
        
        legend.appendChild(normalLegend);
        legend.appendChild(alteredLegend);
        chartContainer.appendChild(legend);
        
        console.log('Gráfico creado exitosamente');
    }
    
    function createLegendItem(color, text) {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '5px';
        
        const colorBox = document.createElement('div');
        colorBox.style.width = '12px';
        colorBox.style.height = '12px';
        colorBox.style.backgroundColor = color;
        colorBox.style.borderRadius = '2px';
        
        const label = document.createElement('span');
        label.textContent = text;
        label.style.fontSize = '12px';
        label.style.color = '#666';
        
        item.appendChild(colorBox);
        item.appendChild(label);
        
        return item;
    }
    
    /**
     * Recolecta los datos del formulario
     * @returns {Object} Datos de evaluación respiratoria
     */
    function collectFormData() {
        const data = {
            capacidad: {
                cvf: elements.cvf ? parseFloat(elements.cvf.value) || null : null,
                pim: elements.pim ? parseFloat(elements.pim.value) || null : null,
                pem: elements.pem ? parseFloat(elements.pem.value) || null : null,
                saturacion: elements.saturacion ? parseFloat(elements.saturacion.value) || null : null
            },
            sintomas: [],
            dispositivos: {
                vmni: {
                    enUso: elements.vmniCheckbox ? elements.vmniCheckbox.checked : false,
                    tipo: elements.tipoVmni ? elements.tipoVmni.value : null,
                    horasUso: elements.horasVmni ? parseFloat(elements.horasVmni.value) || null : null,
                    fechaInicio: elements.inicioVmni ? elements.inicioVmni.value : null,
                    periodos: []
                },
                vmi: {
                    enUso: elements.vmiCheckbox ? elements.vmiCheckbox.checked : false,
                    tipo: elements.tipoVmi ? elements.tipoVmi.value : null,
                    fechaInicio: elements.inicioVmi ? elements.inicioVmi.value : null,
                    dependencia: elements.dependenciaVmi ? elements.dependenciaVmi.value : null
                },
                otrosDispositivos: []
            },
            dispositivosIndicados: {
                tipos: [],
                motivo: elements.motivoNoUso ? elements.motivoNoUso.value : null,
                observaciones: elements.notasDispositivos ? elements.notasDispositivos.value : null
            }
        };
        
        // Recolectar síntomas seleccionados
        elements.sintomasCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                data.sintomas.push(checkbox.value);
            }
        });
        
        // Recolectar períodos de uso de VMNI
        elements.periodosVmni.forEach(checkbox => {
            if (checkbox.checked) {
                data.dispositivos.vmni.periodos.push(checkbox.value);
            }
        });
        
        // Recolectar otros dispositivos
        elements.otrosDispositivos.forEach(checkbox => {
            if (checkbox.checked) {
                data.dispositivos.otrosDispositivos.push(checkbox.value);
            }
        });
        
        // Recolectar dispositivos indicados
        elements.dispositivosIndicados.forEach(checkbox => {
            if (checkbox.checked) {
                data.dispositivosIndicados.tipos.push(checkbox.value);
            }
        });
        
        return data;
    }
    
    /**
     * Reinicia el formulario a su estado inicial
     */
    function resetForm() {
        // Limpiar campos de capacidad
        if (elements.cvf) elements.cvf.value = '';
        if (elements.pim) elements.pim.value = '';
        if (elements.pem) elements.pem.value = '';
        if (elements.saturacion) elements.saturacion.value = '';
        
        // Desmarcar síntomas
        elements.sintomasCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reiniciar VMNI
        if (elements.vmniCheckbox) {
            elements.vmniCheckbox.checked = false;
            if (elements.vmniDetails) {
                elements.vmniDetails.classList.remove('active');
                setTimeout(() => {
                    elements.vmniDetails.style.display = 'none';
                }, 300);
            }
            if (elements.tipoVmni) elements.tipoVmni.value = 'bipap';
            if (elements.horasVmni) elements.horasVmni.value = '';
            if (elements.inicioVmni) elements.inicioVmni.value = '';
        }
        
        // Desmarcar períodos VMNI
        elements.periodosVmni.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reiniciar VMI
        if (elements.vmiCheckbox) {
            elements.vmiCheckbox.checked = false;
            if (elements.vmiDetails) {
                elements.vmiDetails.classList.remove('active');
                setTimeout(() => {
                    elements.vmiDetails.style.display = 'none';
                }, 300);
            }
            if (elements.tipoVmi) elements.tipoVmi.value = 'traq-permanente';
            if (elements.inicioVmi) elements.inicioVmi.value = '';
            if (elements.dependenciaVmi) elements.dependenciaVmi.value = 'total';
        }
        
        // Desmarcar otros dispositivos
        elements.otrosDispositivos.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reiniciar dispositivos indicados
        elements.dispositivosIndicados.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        if (elements.motivoNoUso) elements.motivoNoUso.value = '';
        if (elements.notasDispositivos) elements.notasDispositivos.value = '';
        
        // Limpiar datos en memoria
        respiratoryData = {
            capacidad: { cvf: null, pim: null, pem: null, saturacion: null },
            sintomas: [],
            dispositivos: {
                vmni: { enUso: false, tipo: null, horasUso: null, fechaInicio: null, periodos: [] },
                vmi: { enUso: false, tipo: null, fechaInicio: null, dependencia: null },
                otrosDispositivos: []
            },
            dispositivosIndicados: { tipos: [], motivo: null, observaciones: null }
        };
        
        console.log('Formulario respiratorio reiniciado');
    }
    
    /**
     * Obtiene los datos de evaluación respiratoria
     * @returns {Object} Datos de evaluación respiratoria
     */
    function getRespiratoryData() {
        return respiratoryData;
    }
    
    /**
     * Evalúa los valores de capacidad ventilatoria y muestra un feedback visual
     * sobre qué valores están dentro del rango normal y cuáles están alterados
     */
    function evaluateRespiratoryParameters() {
        console.log('Evaluando parámetros respiratorios...');
        
        // Obtener el contenedor de feedback
        const feedbackContainer = document.getElementById('respiratory-feedback');
        if (!feedbackContainer) {
            console.error('No se encontró el contenedor de feedback');
            return;
        }
        
        // Limpiar contenido anterior
        feedbackContainer.innerHTML = '';
        
        // Mostrar el contenedor con animación
        feedbackContainer.style.display = 'block';
        setTimeout(() => feedbackContainer.classList.add('active'), 10);
        
        // Verificar si hay algún valor para evaluar
        const cvfValue = elements.cvf ? parseFloat(elements.cvf.value) : null;
        const pimValue = elements.pim ? parseFloat(elements.pim.value) : null;
        const pemValue = elements.pem ? parseFloat(elements.pem.value) : null;
        const satValue = elements.saturacion ? parseFloat(elements.saturacion.value) : null;
        
        console.log('Valores a evaluar:', {cvf: cvfValue, pim: pimValue, pem: pemValue, sat: satValue});
        
        if (!cvfValue && !pimValue && !pemValue && !satValue) {
            const mensaje = document.createElement('p');
            mensaje.textContent = 'Introduzca los valores de los parámetros para ver su evaluación.';
            feedbackContainer.appendChild(mensaje);
            return;
        }
        
        // Crear listas para valores normales y alterados
        const normalesList = document.createElement('div');
        normalesList.className = 'normal-parameters';
        normalesList.innerHTML = '<h5>Parámetros normales:</h5>';
        
        const alteradosList = document.createElement('div');
        alteradosList.className = 'altered-parameters';
        alteradosList.innerHTML = '<h5>Parámetros alterados:</h5>';
        
        // Número de parámetros normales y alterados
        let normalesCount = 0;
        let alteradosCount = 0;
        
        // Evaluar cada parámetro
        const parametros = [
            { valor: cvfValue, tipo: 'cvf', elemento: elements.cvf },
            { valor: pimValue, tipo: 'pim', elemento: elements.pim },
            { valor: pemValue, tipo: 'pem', elemento: elements.pem },
            { valor: satValue, tipo: 'saturacion', elemento: elements.saturacion }
        ];
        
        parametros.forEach(param => {
            if (param.valor !== null && !isNaN(param.valor)) {
                const rango = rangosReferencia[param.tipo];
                const esNormal = param.valor >= rango.min && param.valor <= rango.max;
                
                console.log(`Evaluando ${rango.nombre}: ${param.valor}${rango.unidad} - ¿Normal?: ${esNormal}`);
                
                // Crear elemento de resultado
                const resultItem = document.createElement('div');
                resultItem.className = esNormal ? 'normal-item' : 'altered-item';
                
                // Añadir ícono
                const icon = document.createElement('span');
                icon.className = 'status-icon ' + (esNormal ? 'normal' : 'altered');
                icon.innerHTML = esNormal ? '✓' : '⚠';
                resultItem.appendChild(icon);
                
                // Añadir texto
                const text = document.createElement('span');
                text.textContent = `${rango.nombre}: ${param.valor}${rango.unidad} `;
                
                // Añadir rango esperado
                const rangoText = document.createElement('small');
                rangoText.textContent = `(Rango normal: ${rango.min}-${rango.max}${rango.unidad})`;
                text.appendChild(rangoText);
                
                resultItem.appendChild(text);
                
                // Añadir a la lista correspondiente
                if (esNormal) {
                    normalesList.appendChild(resultItem);
                    normalesCount++;
                    
                    // Añadir clase visual al input
                    if (param.elemento) {
                        param.elemento.classList.remove('altered-input');
                        param.elemento.classList.add('normal-input');
                    }
                } else {
                    alteradosList.appendChild(resultItem);
                    alteradosCount++;
                    
                    // Añadir clase visual al input
                    if (param.elemento) {
                        param.elemento.classList.remove('normal-input');
                        param.elemento.classList.add('altered-input');
                    }
                }
            }
        });
        
        // Añadir listas al contenedor solo si tienen elementos
        if (normalesCount > 0) {
            feedbackContainer.appendChild(normalesList);
        }
        
        if (alteradosCount > 0) {
            feedbackContainer.appendChild(alteradosList);
        }
        
        // Añadir mensaje resumen
        const resumen = document.createElement('p');
        resumen.className = 'summary';
        
        if (alteradosCount === 0 && normalesCount > 0) {
            resumen.textContent = 'Todos los parámetros evaluados están dentro de rangos normales.';
            resumen.className += ' all-normal';
        } else if (alteradosCount > 0) {
            resumen.textContent = `Se han detectado ${alteradosCount} parámetro(s) alterado(s) que podrían requerir atención.`;
            resumen.className += ' some-altered';
        }
        
        feedbackContainer.appendChild(resumen);
        
        console.log('Evaluación completada con éxito');
    }
    
    // Agregar estilos CSS para el feedback
    function addFeedbackStyles() {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
            .respiratory-feedback-container {
                margin-top: 20px;
                margin-bottom: 20px;
                padding: 20px;
                border-radius: 8px;
                background-color: #f5f9ff;
                border: 2px solid #d1e3ff;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                font-family: Arial, sans-serif;
                max-width: 100%;
                overflow: hidden;
            }
            
            .respiratory-feedback-container h4 {
                margin-top: 0;
                color: #2c5282;
                border-bottom: 2px solid #d1e3ff;
                padding-bottom: 10px;
                font-size: 16px;
                text-align: center;
            }
            
            .respiratory-feedback-container h5 {
                margin: 15px 0 10px;
                font-size: 14px;
                color: #2d3748;
                font-weight: 600;
            }
            
            .normal-parameters, .altered-parameters {
                margin-bottom: 15px;
                padding: 8px;
                border-radius: 6px;
            }
            
            .normal-parameters {
                background-color: rgba(72, 187, 120, 0.05);
            }
            
            .altered-parameters {
                background-color: rgba(237, 137, 54, 0.05);
            }
            
            .normal-item, .altered-item {
                padding: 8px;
                display: flex;
                align-items: center;
                margin-bottom: 5px;
                border-radius: 4px;
            }
            
            .normal-item {
                background-color: rgba(72, 187, 120, 0.1);
            }
            
            .altered-item {
                background-color: rgba(237, 137, 54, 0.1);
            }
            
            .status-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                border-radius: 50%;
                margin-right: 10px;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .status-icon.normal {
                background-color: #48BB78;
                color: white;
            }
            
            .status-icon.altered {
                background-color: #ED8936;
                color: white;
            }
            
            .summary {
                margin-top: 15px;
                padding: 12px;
                border-radius: 6px;
                font-weight: 600;
                text-align: center;
                font-size: 14px;
            }
            
            .all-normal {
                background-color: rgba(72, 187, 120, 0.15);
                color: #276749;
                border: 1px solid rgba(72, 187, 120, 0.3);
            }
            
            .some-altered {
                background-color: rgba(237, 137, 54, 0.15);
                color: #C05621;
                border: 1px solid rgba(237, 137, 54, 0.3);
            }
            
            .normal-input {
                border-color: #48BB78 !important;
                background-color: rgba(72, 187, 120, 0.05) !important;
            }
            
            .altered-input {
                border-color: #ED8936 !important;
                background-color: rgba(237, 137, 54, 0.05) !important;
            }
            
            /* Hacer que el contenedor de feedback sea más visible */
            @keyframes highlight-feedback {
                0% { box-shadow: 0 0 0 rgba(66, 153, 225, 0.0); }
                50% { box-shadow: 0 0 20px rgba(66, 153, 225, 0.5); }
                100% { box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); }
            }
            
            /* Añadir animación al contenedor cuando se crea */
            #respiratory-feedback {
                animation: highlight-feedback 1.5s ease;
            }
        `;
        document.head.appendChild(styleEl);
    }
    
    /**
     * Función pública para forzar la evaluación de parámetros respiratorios
     * y la creación del gráfico desde la consola o desde otro módulo
     */
    function forceEvaluation() {
        console.log('Forzando evaluación de parámetros respiratorios...');
        evaluateRespiratoryParameters();
        createRespiratoryChart();
        return 'Evaluación completada';
    }
    
    /**
     * Añade el botón para generar el gráfico de visualización
     */
    function addChartButton() {
        console.log('Añadiendo botón para generar gráfico...');
        
        // Buscar la sección respiratoria
        const firstSection = document.querySelector('.respiratorio-section');
        if (!firstSection) {
            console.error('No se pudo encontrar la sección respiratoria para añadir el botón');
            return;
        }
        
        // Buscar fieldset de capacidad ventilatoria
        const fieldset = firstSection.querySelector('fieldset');
        
        if (!fieldset) {
            console.error('No se pudo encontrar un fieldset adecuado para añadir el botón');
            return;
        }
        
        // Verificar si el botón ya existe
        if (document.getElementById('generar-grafico-btn')) {
            console.log('El botón ya existe, no se añadirá uno nuevo');
            return;
        }
        
        // Crear el contenedor del botón
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'chart-button-container';
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginTop = '20px';
        buttonContainer.style.marginBottom = '10px';
        buttonContainer.style.padding = '10px';
        buttonContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
        buttonContainer.style.borderRadius = '8px';
        buttonContainer.style.border = '1px dashed #3498db';
        buttonContainer.style.clear = 'both';
        buttonContainer.style.overflow = 'visible';
        buttonContainer.style.zIndex = '20';
        buttonContainer.style.position = 'relative';
        
        // Crear el botón
        const chartButton = document.createElement('button');
        chartButton.type = 'button';
        chartButton.id = 'generar-grafico-btn';
        chartButton.className = 'primary-btn';
        chartButton.style.backgroundColor = '#3498db';
        chartButton.style.padding = '10px 20px';
        chartButton.style.borderRadius = '6px';
        chartButton.style.border = 'none';
        chartButton.style.color = 'white';
        chartButton.style.fontWeight = 'bold';
        chartButton.style.fontSize = '14px';
        chartButton.style.cursor = 'pointer';
        chartButton.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
        chartButton.style.transition = 'all 0.3s ease';
        chartButton.style.display = 'inline-flex';
        chartButton.style.alignItems = 'center';
        chartButton.style.justifyContent = 'center';
        chartButton.style.position = 'relative';
        chartButton.style.zIndex = '21';
        
        // Añadir ícono como texto con unicode
        const textContent = document.createTextNode('📊 Generar Gráfico de Parámetros');
        chartButton.appendChild(textContent);
        
        // Añadir texto informativo
        const infoText = document.createElement('p');
        infoText.style.margin = '10px 0 0 0';
        infoText.style.fontSize = '12px';
        infoText.style.color = '#555';
        infoText.style.fontStyle = 'italic';
        infoText.textContent = 'Haga clic para visualizar los valores de capacidad ventilatoria en un gráfico comparativo';
        
        // Añadir evento al botón
        chartButton.addEventListener('click', function() {
            createRespiratoryChart();
            // Desplazar hacia el gráfico
            const chartContainer = document.getElementById('respiratory-chart-container');
            if (chartContainer) {
                chartContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Añadir efecto de pulsación
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Añadir efectos hover
        chartButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#2980b9';
            this.style.boxShadow = '0 5px 12px rgba(0,0,0,0.3)';
            this.style.transform = 'translateY(-2px)';
        });
        
        chartButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#3498db';
            this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
            this.style.transform = 'translateY(0)';
        });
        
        // Añadir el botón al contenedor
        buttonContainer.appendChild(chartButton);
        buttonContainer.appendChild(infoText);
        
        // Añadir el contenedor después del fieldset
        fieldset.parentNode.insertBefore(buttonContainer, fieldset.nextSibling);
        
        console.log('Botón para generar gráfico añadido correctamente');
    }
    
    // API pública del módulo
    return {
        initialize,
        getRespiratoryData: () => respiratoryData,
        saveRespiratoryData,
        resetForm,
        evaluateRespiratoryParameters,
        addFeedbackStyles,
        forceEvaluation,
        createChart: createRespiratoryChart
    };
})();

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', EMPA_RESPIRATORY.initialize);
} else {
    EMPA_RESPIRATORY.initialize();
} 