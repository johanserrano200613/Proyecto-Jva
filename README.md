# Plataforma de Examenes - Acme School

Proyecto web para que la escuela Acme pueda administrar usuarios, crear examenes y permitir que los estudiantes presenten pruebas desde una vista publica.

El proyecto se desarrolla con tecnologias basicas del navegador:

- HTML
- CSS
- JavaScript
- localStorage / sessionStorage
- Web Components nativos

No se usan frameworks ni backend.

## Objetivo Del Proyecto

Construir una plataforma web donde:

- Los administradores o docentes puedan iniciar sesion.
- Los usuarios autorizados puedan gestionar usuarios.
- Los usuarios autorizados puedan crear examenes, preguntas y respuestas.
- Los estudiantes puedan presentar examenes sin iniciar sesion.
- El sistema calcule automaticamente el resultado del examen.
- Los datos se guarden en el navegador usando localStorage.

## Modulos Principales

### 1. Login

Vista inicial para acceder a los modulos privados.

Debe permitir:

- Ingresar correo electronico.
- Ingresar contrasena.
- Validar credenciales.
- Guardar sesion activa.
- Proteger las vistas privadas.

Archivo relacionado:

- `login.html`

### 2. Gestion De Usuarios

Modulo privado para administrar los usuarios que pueden entrar a la plataforma.

Datos del usuario:

- Numero de identificacion.
- Nombre completo.
- Email.
- Telefono.
- Cargo: Administrativo o Docente.
- Contrasena.

Debe permitir:

- Crear usuarios.
- Editar usuarios.
- Eliminar usuarios.
- Listar usuarios registrados.

Archivo relacionado:

- `usuarios.html`

### 3. Gestion De Examenes Y Preguntas

Modulo privado para crear y administrar examenes.

Datos del examen:

- Codigo.
- Titulo.
- Tiempo limite en minutos.
- Porcentaje de aprobacion.
- Descripcion.
- Preguntas.
- Respuestas.

Reglas importantes:

- Cada examen puede tener varias preguntas.
- Cada pregunta puede tener varias respuestas.
- Cada pregunta solo puede tener una respuesta correcta.
- Los examenes deben guardarse en localStorage.

Archivo relacionado:

- `examenes.html`

### 4. Resolucion Publica De Examenes

Modulo publico para que un estudiante pueda presentar un examen sin iniciar sesion.

Flujo esperado:

1. El estudiante ve la lista de examenes disponibles.
2. Selecciona un examen.
3. Ingresa numero de identificacion y nombre completo.
4. Presenta el examen.
5. El sistema muestra un temporizador en tiempo real.
6. El estudiante selecciona una respuesta por pregunta.
7. El estudiante termina el examen o el sistema lo finaliza cuando el tiempo llega a cero.
8. El sistema calcula el porcentaje obtenido.
9. El sistema muestra si aprobo o no aprobo.
10. El resultado se guarda en localStorage.

Archivos relacionados:

- `index.html`
- `registro.html`
- `presentacion.html`
- `resultado.html`

## Estructura De Archivos

```text
Proyecto-Jva/
├── index.html          # Catalogo publico de examenes
├── registro.html       # Registro del estudiante antes del examen
├── presentacion.html   # Pantalla para presentar el examen
├── resultado.html      # Resultado final del examen
├── login.html          # Inicio de sesion
├── usuarios.html       # Gestion de usuarios
├── examenes.html       # Gestion de examenes y preguntas
├── style.css           # Estilos generales del proyecto
└── README.md           # Documentacion del proyecto
```

En la rama `johan` tambien se encuentra el archivo:

```text
script.js              # Logica del modulo publico de resolucion de examenes
```

## Llaves Compartidas De Almacenamiento

Para integrar los modulos, todos deben usar las mismas llaves en localStorage y sessionStorage.

```js
const llaves = {
  examenes: "acme_exams",
  examenElegido: "acme_selected_exam",
  estudianteActual: "acme_current_student",
  resultadoActual: "acme_current_result",
  resultados: "acme_results"
};
```

### Llave Principal De Examenes

El modulo de Gestion de Examenes debe guardar los examenes en:

```js
localStorage.setItem("acme_exams", JSON.stringify(examenes));
```

El modulo de Resolucion Publica los debe leer desde:

```js
JSON.parse(localStorage.getItem("acme_exams"));
```

## Estructura De Datos Del Examen

Cada examen debe tener esta estructura:

```js
{
  id: "JS-101",
  code: "JS-101",
  title: "Fundamentos de JavaScript",
  timeLimit: 10,
  approvalPercentage: 70,
  description: "Evalua conceptos basicos de variables, funciones, arreglos y DOM.",
  questions: [
    {
      id: "q1",
      text: "Que palabra se usa para declarar una constante?",
      answers: [
        {
          id: "q1-a1",
          text: "const",
          correct: true
        },
        {
          id: "q1-a2",
          text: "var",
          correct: false
        }
      ]
    }
  ]
}
```

## Campos Del Examen

| Campo | Descripcion |
| --- | --- |
| `id` | Identificador unico del examen. |
| `code` | Codigo visible del examen. |
| `title` | Titulo del examen. |
| `timeLimit` | Tiempo limite en minutos. |
| `approvalPercentage` | Porcentaje minimo para aprobar. |
| `description` | Descripcion del examen. |
| `questions` | Lista de preguntas del examen. |

## Campos De Cada Pregunta

```js
{
  id: "q1",
  text: "Texto de la pregunta",
  answers: []
}
```

| Campo | Descripcion |
| --- | --- |
| `id` | Identificador unico de la pregunta. |
| `text` | Enunciado de la pregunta. |
| `answers` | Lista de respuestas posibles. |

## Campos De Cada Respuesta

```js
{
  id: "q1-a1",
  text: "Texto de la respuesta",
  correct: true
}
```

| Campo | Descripcion |
| --- | --- |
| `id` | Identificador unico de la respuesta. |
| `text` | Texto de la respuesta. |
| `correct` | Indica si es la respuesta correcta. |

Importante: cada pregunta debe tener solo una respuesta con `correct: true`.

## Estructura Del Resultado

Los resultados deben guardarse en:

```js
"acme_results"
```

Estructura del resultado:

```js
{
  id: "resultado-unico",
  examId: "JS-101",
  examTitle: "Fundamentos de JavaScript",
  studentId: "100000001",
  studentName: "Nombre Completo",
  correct: 2,
  total: 3,
  percentage: 67,
  approved: false,
  timeExpired: false,
  answers: {
    q1: "q1-a1",
    q2: "q2-a2"
  },
  finishedAt: "2026-06-12T00:00:00.000Z"
}
```

## Division Del Equipo

### Integrante 1: Login Y Usuarios

Responsabilidades:

- Crear la logica del login.
- Validar usuarios.
- Guardar sesion.
- Cerrar sesion.
- Proteger vistas privadas.
- Crear, editar y eliminar usuarios.

Archivos principales:

- `login.html`
- `usuarios.html`

### Integrante 2: Gestion De Examenes Y Preguntas

Responsabilidades:

- Crear el componente principal de gestion de examenes.
- Mostrar tabla de examenes creados.
- Crear formulario de examen.
- Agregar preguntas dinamicamente.
- Agregar respuestas dinamicamente.
- Validar una unica respuesta correcta por pregunta.
- Guardar los examenes en `acme_exams`.

Archivo principal:

- `examenes.html`

### Integrante 3: Resolucion Publica De Examenes

Responsabilidades:

- Mostrar catalogo publico.
- Pedir datos del estudiante.
- Mostrar examen activo.
- Controlar temporizador.
- Guardar respuestas.
- Calcular resultado.
- Mostrar aprobado o no aprobado.
- Guardar resultados en `acme_results`.

Archivos principales:

- `index.html`
- `registro.html`
- `presentacion.html`
- `resultado.html`
- `script.js`

## Validaciones Recomendadas

### Usuarios

- Identificacion: solo numeros, entre 6 y 12 digitos.
- Nombre completo: solo letras y espacios.
- Email: formato de correo.
- Telefono: solo numeros, entre 7 y 15 digitos.
- Contrasena: minimo 8 caracteres, una mayuscula, una minuscula y un numero.
- Cargo: Administrativo o Docente.

### Examenes

- Codigo: obligatorio y unico.
- Titulo: obligatorio.
- Tiempo: numero mayor a 0.
- Porcentaje de aprobacion: numero entre 0 y 100.
- Descripcion: obligatoria.
- Preguntas: minimo una pregunta.
- Respuestas: minimo dos respuestas por pregunta.
- Correcta: solo una respuesta correcta por pregunta.

### Presentacion Del Examen

- El estudiante debe ingresar identificacion y nombre completo.
- Solo puede seleccionar una respuesta por pregunta.
- El examen termina si el estudiante presiona Terminar.
- El examen termina automaticamente si el tiempo llega a cero.

## Ramas Del Repositorio

### main

Rama principal del proyecto. Contiene las vistas base separadas y la documentacion general.

### johan

Rama de trabajo del Integrante 3. Contiene la logica del modulo publico de resolucion de examenes.

## Como Probar El Proyecto

1. Clonar el repositorio.
2. Abrir la carpeta en Visual Studio Code.
3. Abrir `index.html` en el navegador.
4. Navegar por las vistas:
   - `index.html`
   - `registro.html`
   - `presentacion.html`
   - `resultado.html`
   - `login.html`
   - `usuarios.html`
   - `examenes.html`

Recomendado: usar Live Server en Visual Studio Code.

## Requisitos Del Proyecto

- Diseno responsive.
- Interfaz clara e intuitiva.
- Persistencia de datos con localStorage.
- Uso de JavaScript modular o componentes.
- Uso de Web Components.
- Flujo completo desde creacion hasta finalizacion del examen.
- README con documentacion general del proyecto.

## Estado Actual

El proyecto cuenta con:

- Vistas HTML separadas.
- Estilos generales compartidos.
- Documentacion general.
- Rama `johan` con logica del modulo publico de resolucion de examenes.

Pendientes globales:

- Integrar la logica completa del login.
- Integrar la logica completa de gestion de usuarios.
- Integrar la logica completa de gestion de examenes y preguntas.
- Unificar y probar el flujo completo con todos los modulos.

## Autor

Proyecto desarrollado como entrega individual/equipo para la plataforma de examenes de Acme School.
