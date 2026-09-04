# 📝 Plataforma de Exámenes — Acme School

Aplicación web desarrollada con tecnologías nativas del navegador para gestionar y presentar exámenes. El proyecto trabaja con **HTML, CSS, JavaScript, Web Components, localStorage y sessionStorage**, sin frameworks ni backend.

> Proyecto colaborativo de formación. Mi trabajo se enfocó especialmente en el módulo público de resolución de exámenes, temporizador, captura de respuestas y cálculo de resultados.

## 🎯 Objetivo

Construir una plataforma capaz de cubrir el ciclo básico de un examen:

- autenticación de usuarios autorizados;
- gestión de usuarios;
- creación y administración de exámenes;
- presentación pública de pruebas;
- temporizador y finalización automática;
- cálculo de resultados;
- almacenamiento local de la información;
- reportes básicos.

## 🛠️ Stack

- **HTML5**
- **CSS3**
- **JavaScript**
- **Web Components nativos**
- **localStorage**
- **sessionStorage**

## 🧩 Módulos principales

| Módulo | Archivo | Función |
|---|---|---|
| Catálogo público | `index.html` | Lista exámenes disponibles |
| Registro | `registro.html` | Captura datos del estudiante |
| Presentación | `presentacion.html` | Ejecuta el examen y temporizador |
| Resultado | `resultado.html` | Calcula y muestra resultado |
| Login | `login.html` | Acceso a módulos privados |
| Usuarios | `usuarios.html` | Gestión de usuarios |
| Exámenes | `examenes.html` | Gestión de pruebas y preguntas |
| Reportes | `reportes.html` | Métricas y resultados |
| Lógica | `script.js` | Comportamiento de la aplicación |
| Estilos | `style.css` | Diseño responsive compartido |

## 🔄 Flujo público

```text
Catálogo de exámenes
        │
        ▼
Registro del estudiante
        │
        ▼
Presentación del examen
   ├── temporizador
   ├── respuestas
   └── finalización automática
        │
        ▼
Cálculo del resultado
        │
        ▼
Persistencia en localStorage
```

## 💾 Persistencia

La aplicación comparte claves de almacenamiento entre módulos:

```js
const llaves = {
  examenes: "acme_exams",
  examenElegido: "acme_selected_exam",
  estudianteActual: "acme_current_student",
  resultadoActual: "acme_current_result",
  resultados: "acme_results",
  usuarios: "acme_users",
  sesion: "acme_session"
};
```

Esto permite mantener el flujo entre páginas sin un backend externo.

## ✅ Funcionalidades implementadas

- Catálogo público de exámenes.
- Registro de estudiante.
- Ejecución del examen con preguntas y respuestas.
- Temporizador en tiempo real.
- Finalización manual o automática por tiempo.
- Cálculo de porcentaje obtenido.
- Resultado aprobado/no aprobado.
- Persistencia de resultados en `localStorage`.
- Interfaz responsive.
- Componentes web nativos para organizar vistas y lógica.

## 👥 Trabajo colaborativo

El proyecto fue desarrollado por módulos. Mi responsabilidad principal fue el **flujo público de resolución de exámenes**, incluyendo:

- catálogo de exámenes;
- captura de datos del estudiante;
- presentación de preguntas;
- control del temporizador;
- almacenamiento de respuestas;
- cálculo y persistencia del resultado.

Esto permite presentar el proyecto de forma transparente: es un trabajo colaborativo y no se atribuye individualmente la totalidad de los módulos.

## ▶️ Cómo probarlo

1. Clona el repositorio.
2. Abre la carpeta en Visual Studio Code.
3. Usa Live Server o un servidor HTTP local.
4. Abre `index.html`.
5. Navega por el flujo público o ingresa al módulo privado desde `login.html`.

Ejemplo con Python:

```bash
python -m http.server 5500
```

Luego abre `http://localhost:5500`.

## ⚠️ Alcance técnico

Este proyecto utiliza almacenamiento del navegador como persistencia y **no implementa autenticación de producción ni backend real**. Su objetivo es demostrar manejo de JavaScript, DOM, componentes nativos, estado y flujo entre módulos.

## 🎯 Qué demuestra este proyecto

- Programación con JavaScript sin frameworks.
- Manipulación del DOM y eventos.
- Diseño de flujos de interfaz.
- Persistencia local.
- Web Components.
- Validaciones y lógica de negocio en frontend.
- Trabajo modular y colaboración mediante Git.

---

**Autor / colaborador:** Johan Serrano  
[GitHub](https://github.com/johanserrano200613) · [Email](mailto:johanserrano200613@gmail.com)
