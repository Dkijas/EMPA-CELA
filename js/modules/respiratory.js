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
        
        setupEventListeners();
        
        // Intentar cargar datos guardados
        loadSavedData();
        
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
            });
        }
        
        // Validación para PIM (0-150 cmH2O)
        if (elements.pim) {
            elements.pim.addEventListener('input', function() {
                let value = parseFloat(this.value);
                if (isNaN(value)) return;
                
                if (value < 0) this.value = 0;
                if (value > 150) this.value = 150;
            });
        }
        
        // Validación para PEM (0-150 cmH2O)
        if (elements.pem) {
            elements.pem.addEventListener('input', function() {
                let value = parseFloat(this.value);
                if (isNaN(value)) return;
                
                if (value < 0) this.value = 0;
                if (value > 150) this.value = 150;
            });
        }
        
        // Validación para saturación O2 (70-100%)
        if (elements.saturacion) {
            elements.saturacion.addEventListener('input', function() {
                let value = parseFloat(this.value);
                if (isNaN(value)) return;
                
                if (value < 70) this.value = 70;
                if (value > 100) this.value = 100;
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
     * Guarda los datos de evaluación respiratoria
     */
    function saveRespiratoryData() {
        try {
            respiratoryData = collectFormData();
            
            // Guardar en localStorage para persistencia
            localStorage.setItem('empa_respiratory_data', JSON.stringify(respiratoryData));
            
            // Si existe EMPA.setRespiratoryData, utilizar esa función también
            if (typeof EMPA !== 'undefined' && typeof EMPA.setRespiratoryData === 'function') {
                EMPA.setRespiratoryData(respiratoryData);
            }
            
            alert('Datos de evaluación respiratoria guardados correctamente');
            console.log('Datos guardados:', respiratoryData);
        } catch (error) {
            console.error('Error al guardar datos respiratorios:', error);
            alert('Error al guardar: ' + error.message);
        }
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
     * Carga datos guardados previamente
     */
    function loadSavedData() {
        try {
            const savedData = localStorage.getItem('empa_respiratory_data');
            if (!savedData) {
                console.log('No hay datos guardados de evaluación respiratoria');
                return;
            }
            
            respiratoryData = JSON.parse(savedData);
            populateForm(respiratoryData);
            console.log('Datos respiratorios cargados:', respiratoryData);
        } catch (error) {
            console.error('Error al cargar datos respiratorios:', error);
        }
    }
    
    /**
     * Rellena el formulario con datos guardados
     * @param {Object} data Datos de evaluación respiratoria
     */
    function populateForm(data) {
        // Rellenar campos de capacidad
        if (elements.cvf && data.capacidad.cvf !== null) 
            elements.cvf.value = data.capacidad.cvf;
        if (elements.pim && data.capacidad.pim !== null) 
            elements.pim.value = data.capacidad.pim;
        if (elements.pem && data.capacidad.pem !== null) 
            elements.pem.value = data.capacidad.pem;
        if (elements.saturacion && data.capacidad.saturacion !== null) 
            elements.saturacion.value = data.capacidad.saturacion;
        
        // Marcar síntomas
        elements.sintomasCheckboxes.forEach(checkbox => {
            checkbox.checked = data.sintomas.includes(checkbox.value);
        });
        
        // Configurar VMNI
        if (elements.vmniCheckbox && data.dispositivos.vmni.enUso) {
            elements.vmniCheckbox.checked = true;
            if (elements.vmniDetails) {
                elements.vmniDetails.style.display = 'block';
                setTimeout(() => {
                    elements.vmniDetails.classList.add('active');
                }, 10);
            }
            
            if (elements.tipoVmni && data.dispositivos.vmni.tipo) 
                elements.tipoVmni.value = data.dispositivos.vmni.tipo;
            if (elements.horasVmni && data.dispositivos.vmni.horasUso !== null) 
                elements.horasVmni.value = data.dispositivos.vmni.horasUso;
            if (elements.inicioVmni && data.dispositivos.vmni.fechaInicio) 
                elements.inicioVmni.value = data.dispositivos.vmni.fechaInicio;
            
            // Marcar períodos
            elements.periodosVmni.forEach(checkbox => {
                checkbox.checked = data.dispositivos.vmni.periodos.includes(checkbox.value);
            });
        }
        
        // Configurar VMI
        if (elements.vmiCheckbox && data.dispositivos.vmi.enUso) {
            elements.vmiCheckbox.checked = true;
            if (elements.vmiDetails) {
                elements.vmiDetails.style.display = 'block';
                setTimeout(() => {
                    elements.vmiDetails.classList.add('active');
                }, 10);
            }
            
            if (elements.tipoVmi && data.dispositivos.vmi.tipo) 
                elements.tipoVmi.value = data.dispositivos.vmi.tipo;
            if (elements.inicioVmi && data.dispositivos.vmi.fechaInicio) 
                elements.inicioVmi.value = data.dispositivos.vmi.fechaInicio;
            if (elements.dependenciaVmi && data.dispositivos.vmi.dependencia) 
                elements.dependenciaVmi.value = data.dispositivos.vmi.dependencia;
        }
        
        // Marcar otros dispositivos
        elements.otrosDispositivos.forEach(checkbox => {
            checkbox.checked = data.dispositivos.otrosDispositivos.includes(checkbox.value);
        });
        
        // Configurar dispositivos indicados
        elements.dispositivosIndicados.forEach(checkbox => {
            checkbox.checked = data.dispositivosIndicados.tipos.includes(checkbox.value);
        });
        
        if (elements.motivoNoUso && data.dispositivosIndicados.motivo) 
            elements.motivoNoUso.value = data.dispositivosIndicados.motivo;
        if (elements.notasDispositivos && data.dispositivosIndicados.observaciones) 
            elements.notasDispositivos.value = data.dispositivosIndicados.observaciones;
    }
    
    /**
     * Obtiene los datos de evaluación respiratoria
     * @returns {Object} Datos de evaluación respiratoria
     */
    function getRespiratoryData() {
        return respiratoryData;
    }
    
    // API pública del módulo
    return {
        initialize: initialize,
        getRespiratoryData: getRespiratoryData,
        saveRespiratoryData: saveRespiratoryData,
        resetForm: resetForm
    };
})();

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', EMPA_RESPIRATORY.initialize);
} else {
    EMPA_RESPIRATORY.initialize();
} 