// Gestor de formularios para anatomía
class FormManager {
    constructor(formElement) {
        this.form = formElement;
        this.fields = this.getFormFields();
        this.setupValidation();
        this.setupEventListeners();
    }

    // Obtener referencias a los campos del formulario
    getFormFields() {
        return {
            severity: this.form.querySelector('#area-severity'),
            evolution: this.form.querySelector('#area-evolution'),
            startDate: this.form.querySelector('#area-start-date'),
            impact: this.form.querySelector('#area-impact'),
            interventions: this.form.querySelector('#area-interventions'),
            saveButton: this.form.querySelector('#btn-save-area'),
            cancelButton: this.form.querySelector('#btn-cancel-area')
        };
    }

    // Configurar validación de formulario
    setupValidation() {
        this.form.addEventListener('input', () => {
            const isValid = this.validateForm();
            this.fields.saveButton.disabled = !isValid;
        });
    }

    // Configurar eventos del formulario
    setupEventListeners() {
        this.fields.saveButton.addEventListener('click', () => this.handleSubmit());
        this.fields.cancelButton.addEventListener('click', () => this.handleCancel());
    }

    // Validar formulario
    validateForm() {
        const requiredFields = ['severity', 'evolution', 'startDate', 'impact'];
        return requiredFields.every(field => 
            this.fields[field] && this.fields[field].value.trim() !== ''
        );
    }

    // Manejar envío del formulario
    handleSubmit() {
        if (!this.validateForm()) return;

        const formData = {
            severity: this.fields.severity.value,
            evolution: this.fields.evolution.value,
            startDate: this.fields.startDate.value,
            impact: this.fields.impact.value,
            interventions: Array.from(this.fields.interventions.selectedOptions).map(opt => opt.value)
        };

        EventBus.emit('form:submitted', formData);
        this.hideForm();
    }

    // Manejar cancelación
    handleCancel() {
        EventBus.emit('form:cancelled');
        this.hideForm();
    }

    // Mostrar formulario
    showForm(data = null) {
        if (data) {
            this.populateForm(data);
        } else {
            this.resetForm();
        }
        
        this.form.style.display = 'block';
        this.form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        EventBus.emit('form:shown');
    }

    // Ocultar formulario
    hideForm() {
        this.form.style.display = 'none';
        this.resetForm();
        EventBus.emit('form:hidden');
    }

    // Poblar formulario con datos
    populateForm(data) {
        Object.entries(data).forEach(([field, value]) => {
            if (this.fields[field]) {
                if (field === 'interventions' && Array.isArray(value)) {
                    Array.from(this.fields[field].options).forEach(option => {
                        option.selected = value.includes(option.value);
                    });
                } else {
                    this.fields[field].value = value;
                }
            }
        });
    }

    // Resetear formulario
    resetForm() {
        this.form.reset();
        this.fields.startDate.valueAsDate = new Date();
        this.fields.saveButton.disabled = false;
    }

    // Verificar si el formulario está visible
    isVisible() {
        return this.form.style.display === 'block';
    }
}

// Exportar el FormManager
window.FormManager = FormManager; 