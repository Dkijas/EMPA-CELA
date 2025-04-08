# Escala EMPA-CELA

## Descripción
La Escala EMPA-CELA (Evaluación Médica de Priorización de Atención - Clasificación de Emergencias y Listas de Atención) es una herramienta interactiva diseñada para ayudar a los profesionales de la salud a evaluar y priorizar la atención médica de pacientes con Esclerosis Lateral Amiotrófica (ELA) en servicios de atención especializada.

## ⚠️ AVISO IMPORTANTE - EXENCIÓN DE RESPONSABILIDAD ⚠️
**Esta escala NO ha sido validada clínicamente.** No se asume responsabilidad de ningún tipo por su uso. Los resultados proporcionados por esta herramienta son meramente orientativos y no deben utilizarse como única herramienta para tomar decisiones clínicas. Consulte siempre con profesionales sanitarios cualificados.

## Características Principales
- Interfaz moderna e intuitiva con sistema de pestañas
- Evaluación multidimensional completa
- Visualización anatómica interactiva
- Seguimiento temporal de la evolución
- Evaluación respiratoria detallada
- Generación de informes en PDF (completo y simplificado)
- Almacenamiento local de datos
- Diseño responsivo para dispositivos móviles y escritorio

## Módulos del Sistema

### 1. Evaluación EMPA-CELA
Evaluación completa basada en los siguientes parámetros:
1. **Función motora** (0-7 puntos)
   - Movilidad funcional
   - Movilidad fina
   - Resistencia y fatiga
2. **Función bulbar** (0-6 puntos) 
   - Capacidad de habla y comunicación
   - Uso de dispositivos de comunicación
3. **Función cognitiva y conductual** (0-6 puntos)
   - Atención y concentración
   - Memoria
   - Lenguaje y fluidez verbal
4. **Apoyo y situación social** (0-6 puntos)
   - Apoyo familiar y sobrecarga del cuidador
   - Situación económica
   - Acceso y tramitación de ayudas estatales
5. **Comorbilidades y estado general** (0-5 puntos)
6. **Supervisión de enfermería** (0-3 puntos)
7. **Aceptación de cuidados** (0-4 puntos)

### 2. Anatomía de la Enfermedad
- Mapa anatómico interactivo
- Marcadores de afectación por zonas
- Registro de severidad (leve, moderada, grave)
- Seguimiento de evolución temporal
- Visualización gráfica de progresión

### 3. Soporte Respiratorio
- Evaluación de parámetros ventilatorios:
  - Capacidad Vital Forzada (CVF)
  - Presión Inspiratoria Máxima (PIM)
  - Presión Espiratoria Máxima (PEM)
  - Saturación de Oxígeno
- Visualización gráfica de parámetros
- Registro de dispositivos de soporte
- Seguimiento de evolución respiratoria

## Niveles de Prioridad
El sistema calcula la suma total (0-37 puntos) y asigna una prioridad:

| Nivel | Puntuación | Clasificación | Seguimiento Recomendado |
|-------|------------|---------------|------------------------|
| 1 | 15-37 | Cuidados paliativos intensivos | Cada 1-2 semanas |
| 2 | 11-14 | Atención intensiva especializada | Cada 2-3 semanas |
| 3 | 7-10 | Atención intermedia | Mensual |
| 4 | 4-6 | Atención preventiva | Cada 2-3 meses |
| 5 | 0-3 | Seguimiento general | Semestral |

## Recomendaciones por Nivel

### Prioridad 1 (15-37 puntos)
- Seguimiento médico frecuente (1-2 semanas)
- Evaluación para ventilación mecánica
- Soporte nutricional especializado
- Apoyo psicológico intensivo
- Coordinación con trabajo social

### Prioridad 2 (11-14 puntos)
- Seguimiento cada 2-3 semanas
- Evaluación multidisciplinar completa
- Ajuste de terapias físicas y respiratorias
- Evaluación de comunicación aumentativa
- Planificación anticipada de cuidados

### Prioridad 3 (7-10 puntos)
- Seguimiento mensual
- Terapia física y ocupacional regular
- Revisión de adaptaciones domiciliarias
- Entrenamiento a cuidadores
- Evaluación de necesidades sociales

### Prioridad 4 (4-6 puntos)
- Seguimiento cada 2-3 meses
- Educación preventiva
- Adaptaciones tempranas en el hogar
- Asesoramiento sobre recursos
- Programa de ejercicios personalizado

### Prioridad 5 (0-3 puntos)
- Seguimiento semestral
- Monitorización de síntomas iniciales
- Educación sobre la enfermedad
- Exploración de soporte comunitario
- Planificación de adaptaciones futuras

## Uso del Sistema
1. Acceda a la aplicación a través del navegador
2. Complete los datos del paciente
3. Realice la evaluación EMPA-CELA
4. Marque las áreas anatómicas afectadas
5. Registre los parámetros respiratorios
6. Calcule la prioridad de atención
7. Genere el informe en PDF según necesidad

## Estructura del Proyecto
```
EMPA-CELA/
├── index.html                # Página principal de la aplicación
├── LICENSE.txt              # Términos de licencia
├── css/
│   ├── styles.css          # Estilos globales
│   └── modules/
│       └── anatomy.css     # Estilos específicos de anatomía
├── js/
│   ├── main.js            # Inicialización de la aplicación
│   ├── utils/             # Utilidades generales
│   │   ├── state.js      # Gestión de estado global
│   │   ├── events.js     # Sistema de eventos
│   │   └── storage.js    # Manejo de almacenamiento local
│   └── modules/          # Módulos funcionales
│       ├── anatomy/      # Módulo de anatomía
│       ├── respiratory/  # Módulo respiratorio
│       ├── pdf/         # Módulo de generación de PDF
│       ├── core.js      # Funcionalidad principal
│       ├── tabs.js      # Sistema de pestañas
│       ├── calculation.js # Cálculos y puntuaciones
│       ├── progression.js # Visualización de evolución
│       ├── respiratory.js # Funcionalidad respiratoria
│       └── pdf.js       # Generación de informes
├── img/
│   └── anatomia-muscular.jpg # Imagen base para anatomía
└── Documentacion Clinica/    # Documentación médica y clínica
```

## Requisitos Técnicos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- Conexión a Internet para CDN (opcional)

## Notas de Desarrollo
- Desarrollado con JavaScript ES6+
- Uso de módulos para mejor organización
- Almacenamiento local para persistencia de datos
- Diseño responsivo con CSS Grid y Flexbox
- Generación de PDF con jsPDF
- Visualizaciones con HTML5 Canvas

## Contacto y Soporte
Para más información o soporte técnico:
- **Autor**: Víctor Ramón Aguilera Díaz
- **Email**: [victorramonaguileradiaz@gmail.com](mailto:victorramonaguileradiaz@gmail.com)

## Licencia
© 2025 Escala EMPA-CELA - Víctor Ramón Aguilera Díaz - Todos los derechos reservados. 