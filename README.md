# Escala EMPA-CELA

## Descripción
La Escala EMPA-CELA (Evaluación Médica de Priorización de Atención - Clasificación de Emergencias y Listas de Atención) es una herramienta interactiva diseñada para ayudar a los profesionales de la salud a evaluar y priorizar la atención médica de pacientes en servicios de urgencias y emergencias.

## ⚠️ AVISO IMPORTANTE - EXENCIÓN DE RESPONSABILIDAD ⚠️
**Esta escala NO ha sido validada clínicamente.** No se asume responsabilidad de ningún tipo por su uso. Los resultados proporcionados por esta herramienta son meramente orientativos y no deben utilizarse como única herramienta para tomar decisiones clínicas. Consulte siempre con profesionales sanitarios cualificados. Los autores de esta escala no se hacen responsables de decisiones tomadas con base en los resultados obtenidos.

## Características
- Interfaz intuitiva y fácil de usar
- Evaluación de signos vitales (frecuencia cardíaca, presión arterial, temperatura)
- Evaluación del nivel de consciencia
- Evaluación del nivel de dolor
- Evaluación del tiempo de evolución
- Cálculo automático de prioridad de atención
- Impresión de resultados
- Diseño responsivo para usar en dispositivos móviles o de escritorio

## Funcionamiento
La escala se basa en la evaluación de los siguientes parámetros:
1. Signos vitales (frecuencia cardíaca, presión arterial, temperatura)
2. Nivel de consciencia 
3. Dolor
4. Tiempo de evolución

Cada parámetro se evalúa en una escala de 1 a 5, donde:
- 1 = Condición crítica (requiere atención inmediata)
- 5 = Condición estable (puede esperar)

El sistema calcula la suma de todos los valores seleccionados y asigna una prioridad:
- Prioridad 1 (Emergencia): Puntuación ≤ 5
- Prioridad 2 (Muy Urgente): Puntuación 6-10
- Prioridad 3 (Urgente): Puntuación 11-15
- Prioridad 4 (Normal): Puntuación 16-20
- Prioridad 5 (No Urgente): Puntuación > 20

## Instalación
No requiere instalación. El sistema funciona en cualquier navegador web moderno.

## Uso
1. Abra el archivo `index.html` en su navegador
2. Complete el formulario seleccionando los valores apropiados para cada parámetro
3. Haga clic en "Calcular Prioridad"
4. Revise el resultado mostrado
5. Si es necesario, imprima los resultados con el botón "Imprimir Resultados"
6. Para iniciar una nueva evaluación, haga clic en "Reiniciar Formulario"

## Estructura de Archivos
```
├── index.html         # Página principal
├── css/              
│   └── styles.css     # Estilos de la aplicación
├── js/               
│   └── script.js      # Funcionalidad JavaScript
├── img/               # Carpeta para imágenes (si se requieren)
└── README.md          # Este archivo
```

## Tecnologías Utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)

## Derechos de Autor
© 2025 Escala EMPA-CELA - Todos los derechos reservados.

Este proyecto está protegido por derechos de autor y se presenta a la comisión de derechos de autor como una herramienta original para la evaluación y priorización de atención médica.

## Contacto
Para más información sobre este proyecto, por favor contacte al desarrollador. 