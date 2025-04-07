/**
 * Módulo para el manejo de la evaluación respiratoria
 * @module EMPA_RESPIRATORY
 */
const EMPA_RESPIRATORY = (function() {
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
    const elements = {
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

    /**
     * Inicializa el módulo de evaluación respiratoria
     */
    function initialize() {
        console.log('Inicializando módulo de evaluación respiratoria...');
        
        if (!validateElements()) {
            console.error('No se pudieron encontrar todos los elementos necesarios para el módulo respiratorio');
            return;
        }
        
        // Añadir estilos para el feedback de evaluación
        addFeedbackStyles();
        
        // Añadir botón para generar gráfico
        addChartButton();
        
        setupEventListeners();
        
        // Intentar cargar datos guardados
        const datosGuardados = loadSavedData();
        
        // Evaluar parámetros inmediatamente después de inicializar
        setTimeout(evaluateRespiratoryParameters, 500);
        
        console.log('Módulo de evaluación respiratoria inicializado');
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
                    // Usar setTimeout para permitir que el display:block tome efecto primero
                    setTimeout(() => {
                        elements.vmniDetails.classList.add('active');
                    }, 10);
                } else {
                    elements.vmniDetails.classList.remove('active');
                    // Esperar a que termine la animación antes de ocultar
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
        
        // Buscar o crear contenedor para el gráfico
        let chartContainer = document.getElementById('respiratory-chart-container');
        if (chartContainer) {
            // Si ya existe un contenedor, eliminarlo para crear uno nuevo
            chartContainer.remove();
            chartContainer = null;
        }
        
        // Buscar la sección donde insertar el gráfico
        const firstSection = document.querySelector('.respiratorio-section');
        if (!firstSection) {
            console.error('No se encontró un contenedor adecuado para el gráfico');
            return;
        }
        
        // Crear contenedor para el gráfico
        chartContainer = document.createElement('div');
        chartContainer.id = 'respiratory-chart-container';
        chartContainer.className = 'respiratory-chart-container';
        chartContainer.style.marginTop = '30px';
        chartContainer.style.marginBottom = '30px';
        chartContainer.style.padding = '20px';
        chartContainer.style.borderRadius = '8px';
        chartContainer.style.backgroundColor = '#f5f9ff';
        chartContainer.style.border = '2px solid #d1e3ff';
        chartContainer.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
        chartContainer.style.position = 'relative';
        chartContainer.style.zIndex = '10';
        chartContainer.style.clear = 'both';
        chartContainer.style.overflow = 'visible';
        
        // Añadir título
        const chartTitle = document.createElement('h4');
        chartTitle.textContent = 'Visualización de parámetros respiratorios';
        chartTitle.style.marginTop = '0';
        chartTitle.style.marginBottom = '20px';
        chartTitle.style.color = '#2c5282';
        chartTitle.style.borderBottom = '2px solid #d1e3ff';
        chartTitle.style.paddingBottom = '10px';
        chartTitle.style.fontSize = '16px';
        chartTitle.style.textAlign = 'center';
        chartContainer.appendChild(chartTitle);
        
        // Crear el div para el gráfico
        const chartDiv = document.createElement('div');
        chartDiv.id = 'respiratory-chart';
        chartDiv.className = 'respiratory-chart';
        chartContainer.appendChild(chartDiv);
        
        // Insertar antes del contenedor de feedback si existe
        const feedbackContainer = document.getElementById('respiratory-feedback');
        if (feedbackContainer) {
            firstSection.insertBefore(chartContainer, feedbackContainer);
        } else {
            // Insertar después del botón
            const buttonContainer = document.querySelector('.chart-button-container');
            if (buttonContainer) {
                buttonContainer.parentNode.insertBefore(chartContainer, buttonContainer.nextSibling);
            } else {
                firstSection.appendChild(chartContainer);
            }
        }
        
        // Obtener valores para el gráfico
        // Si no tenemos datos guardados, intentar obtenerlos del formulario directamente
        let cvfValue, pimValue, pemValue, satValue;
        
        if (respiratoryData && respiratoryData.capacidad) {
            cvfValue = respiratoryData.capacidad.cvf;
            pimValue = respiratoryData.capacidad.pim;
            pemValue = respiratoryData.capacidad.pem;
            satValue = respiratoryData.capacidad.saturacion;
        } else {
            // Recolectar valores directamente del formulario
            cvfValue = elements.cvf ? parseFloat(elements.cvf.value) || null : null;
            pimValue = elements.pim ? parseFloat(elements.pim.value) || null : null;
            pemValue = elements.pem ? parseFloat(elements.pem.value) || null : null;
            satValue = elements.saturacion ? parseFloat(elements.saturacion.value) || null : null;
        }
        
        // Verificar si hay suficientes datos para mostrar
        if (!cvfValue && !pimValue && !pemValue && !satValue) {
            const noDataMsg = document.createElement('p');
            noDataMsg.className = 'no-data';
            noDataMsg.textContent = 'No hay suficientes datos para mostrar el gráfico. Introduzca al menos un valor de capacidad ventilatoria.';
            noDataMsg.style.textAlign = 'center';
            noDataMsg.style.padding = '40px 20px';
            noDataMsg.style.color = '#666';
            noDataMsg.style.fontStyle = 'italic';
            chartContainer.appendChild(noDataMsg);
            return;
        }
        
        // Crear contenido del gráfico
        const chart = document.getElementById('respiratory-chart');
        chart.innerHTML = ''; // Limpiar contenido existente
        
        // Estilos base para el gráfico
        chart.style.height = '250px';
        chart.style.position = 'relative';
        chart.style.marginTop = '20px';
        chart.style.marginBottom = '30px';
        chart.style.display = 'flex';
        chart.style.borderBottom = '2px solid #ccc';
        chart.style.paddingBottom = '30px';
        chart.style.backgroundImage = 'linear-gradient(180deg, rgba(200,200,200,0.1) 1px, transparent 1px)';
        chart.style.backgroundSize = '100% 10%';
        chart.style.backgroundPosition = '0 0';
        chart.style.overflow = 'visible';
        
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
            // Calcular ancho de cada barra
            const barWidth = 100 / validParams.length;
            
            // Crear contenedor para la barra
            const barContainer = document.createElement('div');
            barContainer.className = 'chart-bar-container';
            barContainer.style.width = `${barWidth}%`;
            barContainer.style.height = '100%';
            barContainer.style.position = 'relative';
            barContainer.style.display = 'flex';
            barContainer.style.flexDirection = 'column';
            barContainer.style.alignItems = 'center';
            barContainer.style.padding = '0 10px';
            barContainer.style.overflow = 'visible';
            
            // Determinar si el valor está dentro del rango normal
            const isNormal = param.value >= param.min && param.value <= param.max;
            
            // Crear barra
            const bar = document.createElement('div');
            bar.className = `chart-bar ${isNormal ? 'normal-bar' : 'altered-bar'}`;
            bar.style.width = '60px';
            bar.style.position = 'absolute';
            bar.style.bottom = '0';
            bar.style.backgroundColor = isNormal ? '#4CAF50' : '#FF9800';
            bar.style.borderRadius = '4px 4px 0 0';
            bar.style.transition = 'height 0.8s ease-out';
            bar.style.display = 'flex';
            bar.style.justifyContent = 'center';
            bar.style.alignItems = 'flex-start';
            bar.style.overflow = 'visible';
            bar.style.zIndex = '5';
            
            // Animar altura de la barra (de 0 a valor actual)
            setTimeout(() => {
                // Normalizar el valor a un porcentaje para la altura (máximo 100%)
                // Para saturación, considerar un mínimo de 70%
                let heightPercent;
                if (param.id === 'sat') {
                    // Escalar de 70-100 a 0-100
                    heightPercent = ((param.value - 70) / 30) * 100;
                } else if (param.id === 'cvf') {
                    // Para CVF, el valor ya es un porcentaje
                    heightPercent = param.value;
                } else {
                    // Para PIM y PEM, usar el rango normal como referencia
                    const maxRef = Math.max(param.max * 1.2, 150); // 20% más que el máximo normal o 150
                    heightPercent = (param.value / maxRef) * 100;
                }
                
                // Limitar a 95% para dejar espacio para el valor
                heightPercent = Math.min(heightPercent, 95);
                
                // Altura mínima visible
                heightPercent = Math.max(heightPercent, 5);
                
                bar.style.height = `${heightPercent}%`;
            }, 100);
            
            // Añadir valor en la parte superior de la barra
            const valueLabel = document.createElement('div');
            valueLabel.className = 'chart-value-label';
            valueLabel.textContent = `${param.value}${param.unidad}`;
            valueLabel.style.position = 'absolute';
            valueLabel.style.top = '-25px';
            valueLabel.style.fontWeight = 'bold';
            valueLabel.style.color = isNormal ? '#2C7A33' : '#E65100';
            valueLabel.style.zIndex = '6';
            valueLabel.style.textAlign = 'center';
            valueLabel.style.width = '100%';
            valueLabel.style.overflow = 'visible';
            bar.appendChild(valueLabel);
            
            // Añadir etiqueta del parámetro
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = param.label;
            label.style.position = 'absolute';
            label.style.bottom = '-25px';
            label.style.fontWeight = 'bold';
            label.style.color = '#333';
            label.style.width = '100%';
            label.style.textAlign = 'center';
            label.style.zIndex = '6';
            
            // Añadir elementos al contenedor
            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            chart.appendChild(barContainer);
        });
        
        // Añadir leyenda al gráfico
        const legend = document.createElement('div');
        legend.className = 'chart-legend';
        legend.style.display = 'flex';
        legend.style.justifyContent = 'center';
        legend.style.gap = '20px';
        legend.style.marginTop = '30px';
        legend.style.fontSize = '12px';
        
        // Añadir leyenda para valores normales
        const normalLegend = document.createElement('div');
        normalLegend.style.display = 'flex';
        normalLegend.style.alignItems = 'center';
        
        const normalColor = document.createElement('span');
        normalColor.style.display = 'inline-block';
        normalColor.style.width = '15px';
        normalColor.style.height = '15px';
        normalColor.style.backgroundColor = '#4CAF50';
        normalColor.style.marginRight = '5px';
        normalColor.style.borderRadius = '2px';
        
        normalLegend.appendChild(normalColor);
        normalLegend.appendChild(document.createTextNode('Valores normales'));
        
        // Añadir leyenda para valores alterados
        const alteredLegend = document.createElement('div');
        alteredLegend.style.display = 'flex';
        alteredLegend.style.alignItems = 'center';
        
        const alteredColor = document.createElement('span');
        alteredColor.style.display = 'inline-block';
        alteredColor.style.width = '15px';
        alteredColor.style.height = '15px';
        alteredColor.style.backgroundColor = '#FF9800';
        alteredColor.style.marginRight = '5px';
        alteredColor.style.borderRadius = '2px';
        
        alteredLegend.appendChild(alteredColor);
        alteredLegend.appendChild(document.createTextNode('Valores alterados'));
        
        // Añadir ambas leyendas
        legend.appendChild(normalLegend);
        legend.appendChild(alteredLegend);
        
        // Añadir leyenda al contenedor
        chartContainer.appendChild(legend);
        
        console.log('Gráfico de parámetros respiratorios creado con éxito');
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
     * Carga datos guardados en localStorage
     * @returns {Object|null} Los datos cargados o null si no hay datos
     */
    function loadSavedData() {
        try {
            if (localStorage && localStorage.getItem('empa_respiratory_data')) {
                const savedData = JSON.parse(localStorage.getItem('empa_respiratory_data'));
                
                if (savedData) {
                    console.log('Datos respiratorios cargados desde localStorage');
                    respiratoryData = savedData;
                    populateForm(savedData);
                    return savedData;
                }
            }
        } catch (error) {
            console.error('Error al cargar datos guardados:', error);
        }
        
        console.log('No se encontraron datos respiratorios guardados');
        return null;
    }
    
    /**
     * Rellena el formulario con los datos guardados
     * @param {Object} data - Datos a cargar en el formulario
     */
    function populateForm(data) {
        if (!data) return;
        
        // Restaurar capacidad ventilatoria
        if (data.capacidad) {
            if (elements.cvf && data.capacidad.cvf !== null) {
                elements.cvf.value = data.capacidad.cvf;
            }
            
            if (elements.pim && data.capacidad.pim !== null) {
                elements.pim.value = data.capacidad.pim;
            }
            
            if (elements.pem && data.capacidad.pem !== null) {
                elements.pem.value = data.capacidad.pem;
            }
            
            if (elements.saturacion && data.capacidad.saturacion !== null) {
                elements.saturacion.value = data.capacidad.saturacion;
            }
        }
        
        // Restaurar síntomas respiratorios
        if (data.sintomas && Array.isArray(data.sintomas)) {
            elements.sintomasCheckboxes.forEach(checkbox => {
                checkbox.checked = data.sintomas.includes(checkbox.value);
            });
        }
        
        // Restaurar dispositivos VMNI
        if (data.dispositivos && data.dispositivos.vmni) {
            if (elements.vmniCheckbox) {
                elements.vmniCheckbox.checked = data.dispositivos.vmni.enUso;
                
                // Disparar evento change para que se muestre/oculte la sección
                const event = new Event('change');
                elements.vmniCheckbox.dispatchEvent(event);
            }
            
            // Restaurar detalles VMNI si está en uso
            if (data.dispositivos.vmni.enUso) {
                if (elements.tipoVmni && data.dispositivos.vmni.tipo) {
                    elements.tipoVmni.value = data.dispositivos.vmni.tipo;
                }
                
                if (elements.horasVmni && data.dispositivos.vmni.horasUso !== null) {
                    elements.horasVmni.value = data.dispositivos.vmni.horasUso;
                }
                
                if (elements.inicioVmni && data.dispositivos.vmni.fechaInicio) {
                    elements.inicioVmni.value = data.dispositivos.vmni.fechaInicio;
                }
                
                // Restaurar períodos
                if (elements.periodosVmni && data.dispositivos.vmni.periodos) {
                    elements.periodosVmni.forEach(checkbox => {
                        checkbox.checked = data.dispositivos.vmni.periodos.includes(checkbox.value);
                    });
                }
            }
        }
        
        // Restaurar dispositivos VMI
        if (data.dispositivos && data.dispositivos.vmi) {
            if (elements.vmiCheckbox) {
                elements.vmiCheckbox.checked = data.dispositivos.vmi.enUso;
                
                // Disparar evento change para que se muestre/oculte la sección
                const event = new Event('change');
                elements.vmiCheckbox.dispatchEvent(event);
            }
            
            // Restaurar detalles VMI si está en uso
            if (data.dispositivos.vmi.enUso) {
                if (elements.tipoVmi && data.dispositivos.vmi.tipo) {
                    elements.tipoVmi.value = data.dispositivos.vmi.tipo;
                }
                
                if (elements.inicioVmi && data.dispositivos.vmi.fechaInicio) {
                    elements.inicioVmi.value = data.dispositivos.vmi.fechaInicio;
                }
                
                if (elements.dependenciaVmi && data.dispositivos.vmi.dependencia) {
                    elements.dependenciaVmi.value = data.dispositivos.vmi.dependencia;
                }
            }
        }
        
        // Restaurar otros dispositivos
        if (data.dispositivos && data.dispositivos.otrosDispositivos) {
            elements.otrosDispositivos.forEach(checkbox => {
                checkbox.checked = data.dispositivos.otrosDispositivos.includes(checkbox.value);
            });
        }
        
        // Restaurar dispositivos indicados
        if (data.dispositivosIndicados) {
            if (data.dispositivosIndicados.tipos) {
                elements.dispositivosIndicados.forEach(checkbox => {
                    checkbox.checked = data.dispositivosIndicados.tipos.includes(checkbox.value);
                });
            }
            
            if (elements.motivoNoUso && data.dispositivosIndicados.motivo) {
                elements.motivoNoUso.value = data.dispositivosIndicados.motivo;
            }
            
            if (elements.notasDispositivos && data.dispositivosIndicados.observaciones) {
                elements.notasDispositivos.value = data.dispositivosIndicados.observaciones;
            }
        }
        
        // Evaluar datos después de cargar
        setTimeout(evaluateRespiratoryParameters, 100);
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
        
        // Obtener el primer fieldset dentro de la primera sección respiratoria
        const firstSection = document.querySelector('.respiratorio-section');
        const targetFieldset = firstSection ? firstSection.querySelector('fieldset') : null;
        
        // Contenedor para mostrar resultados
        let feedbackContainer = document.getElementById('respiratory-feedback');
        if (!feedbackContainer) {
            // Crear contenedor si no existe
            feedbackContainer = document.createElement('div');
            feedbackContainer.id = 'respiratory-feedback';
            feedbackContainer.className = 'respiratory-feedback-container';
            
            // Insertar después del primer fieldset o como último hijo si no se encuentra
            if (targetFieldset) {
                targetFieldset.parentNode.insertBefore(feedbackContainer, targetFieldset.nextSibling);
            } else if (firstSection) {
                firstSection.appendChild(feedbackContainer);
            } else {
                // Buscar otra alternativa si no encontramos el contenedor adecuado
                const respiratorioTab = document.getElementById('respiratorio-tab');
                if (respiratorioTab) {
                    respiratorioTab.appendChild(feedbackContainer);
                } else {
                    console.error('No se encontró un contenedor adecuado para el feedback');
                    return;
                }
            }
        }
        
        // Asegurar visibilidad del contenedor
        feedbackContainer.style.display = 'block';
        
        // Limpiar contenido anterior
        feedbackContainer.innerHTML = '';
        
        // Crear cabecera de resultados
        const header = document.createElement('h4');
        header.textContent = 'Evaluación de parámetros respiratorios';
        feedbackContainer.appendChild(header);
        
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
        
        console.log('Botón para generar gráfico añadido');
    }
    
    // API pública del módulo
    return {
        initialize: initialize,
        getRespiratoryData: getRespiratoryData,
        saveRespiratoryData: saveRespiratoryData,
        resetForm: resetForm,
        evaluateRespiratoryParameters: evaluateRespiratoryParameters,
        addFeedbackStyles: addFeedbackStyles,
        forceEvaluation: forceEvaluation,
        createChart: createRespiratoryChart
    };
})();

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', EMPA_RESPIRATORY.initialize);
} else {
    EMPA_RESPIRATORY.initialize();
} 