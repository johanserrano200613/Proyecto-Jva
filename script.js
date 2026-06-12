const llaves = {
  examenes: "acme_exams",
  examenElegido: "acme_selected_exam",
  estudianteActual: "acme_current_student",
  resultadoActual: "acme_current_result",
  resultados: "acme_results"
};

const examenesDePrueba = [
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
          { id: "q1-a1", text: "const", correct: true },
          { id: "q1-a2", text: "var", correct: false },
          { id: "q1-a3", text: "let", correct: false }
        ]
      },
      {
        id: "q2",
        text: "Que metodo permite recorrer un arreglo sin crear uno nuevo?",
        answers: [
          { id: "q2-a1", text: "forEach", correct: true },
          { id: "q2-a2", text: "map", correct: false },
          { id: "q2-a3", text: "filter", correct: false }
        ]
      },
      {
        id: "q3",
        text: "Que API del navegador guarda datos persistentes simples?",
        answers: [
          { id: "q3-a1", text: "localStorage", correct: true },
          { id: "q3-a2", text: "fetch", correct: false },
          { id: "q3-a3", text: "documentQuery", correct: false }
        ]
      }
    ]
  }
];

function crearExamenesDePrueba() {
  const yaHayExamenes = localStorage.getItem(llaves.examenes);

  if (!yaHayExamenes) {
    localStorage.setItem(llaves.examenes, JSON.stringify(examenesDePrueba));
  }
}

function obtenerExamenes() {
  crearExamenesDePrueba();
  return JSON.parse(localStorage.getItem(llaves.examenes)) || [];
}

function obtenerExamenElegido() {
  const idExamen = sessionStorage.getItem(llaves.examenElegido);
  const examenes = obtenerExamenes();
  return examenes.find((examen) => examen.id === idExamen) || examenes[0];
}

function limpiarTexto(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function convertirTiempo(segundosTotales) {
  const minutos = Math.floor(segundosTotales / 60).toString().padStart(2, "0");
  const segundos = (segundosTotales % 60).toString().padStart(2, "0");
  return `${minutos}:${segundos}`;
}

class VistaCatalogoExamenes extends HTMLElement {
  connectedCallback() {
    const examenes = obtenerExamenes();

    this.innerHTML = `
      <div class="hero-card">
        <span>Modulo publico</span>
        <h1>Selecciona un examen disponible</h1>
        <p>Elige una prueba, registra tus datos y responde dentro del tiempo establecido.</p>
      </div>

      <div class="exam-list">
        ${examenes.map((examen) => `
          <article class="exam-card">
            <p class="code">${limpiarTexto(examen.code)}</p>
            <h2>${limpiarTexto(examen.title)}</h2>
            <p>${limpiarTexto(examen.description)}</p>
            <div class="meta-row">
              <span>${examen.timeLimit} min</span>
              <span>${examen.approvalPercentage}% aprueba</span>
              <span>${examen.questions.length} preguntas</span>
            </div>
            <button class="primary-button" type="button" data-examen="${limpiarTexto(examen.id)}">Presentar Examen</button>
          </article>
        `).join("")}
      </div>
    `;

    this.querySelectorAll("[data-examen]").forEach((boton) => {
      boton.addEventListener("click", () => {
        sessionStorage.setItem(llaves.examenElegido, boton.dataset.examen);
        sessionStorage.removeItem(llaves.estudianteActual);
        sessionStorage.removeItem(llaves.resultadoActual);
        window.location.href = "registro.html";
      });
    });
  }
}

class VistaRegistroEstudiante extends HTMLElement {
  connectedCallback() {
    const examen = obtenerExamenElegido();
    sessionStorage.setItem(llaves.examenElegido, examen.id);

    this.innerHTML = `
      <form class="panel narrow-panel">
        <p class="code">${limpiarTexto(examen.code)}</p>
        <h1>${limpiarTexto(examen.title)}</h1>
        <p>Antes de iniciar, registra los datos que quedaran asociados a tus respuestas.</p>

        <label for="identificacion">Numero de identificacion</label>
        <input id="identificacion" type="text" inputmode="numeric" pattern="[0-9]{6,12}" minlength="6" maxlength="12" title="Ingresa solo numeros, entre 6 y 12 digitos." required>
        <small class="field-help">Solo numeros, entre 6 y 12 digitos.</small>

        <label for="nombreCompleto">Nombre completo</label>
        <input id="nombreCompleto" type="text" minlength="3" maxlength="80" pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,80}" title="Ingresa tu nombre completo usando solo letras y espacios." required>
        <small class="field-help">Escribe nombres y apellidos, solo letras.</small>

        <div class="form-actions">
          <button class="primary-button" type="submit">Iniciar examen</button>
          <a class="ghost-link" href="index.html">Volver</a>
        </div>
      </form>
    `;

    this.querySelector("form").addEventListener("submit", (evento) => {
      evento.preventDefault();
      const formulario = evento.currentTarget;

      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
      }

      const estudiante = {
        id: formulario.querySelector("#identificacion").value.trim(),
        fullName: formulario.querySelector("#nombreCompleto").value.trim(),
        examId: examen.id,
        startedAt: new Date().toISOString()
      };

      sessionStorage.setItem(llaves.estudianteActual, JSON.stringify(estudiante));
      window.location.href = "presentacion.html";
    });
  }
}

class VistaResolverExamen extends HTMLElement {
  constructor() {
    super();
    this.preguntaActual = 0;
    this.respuestas = {};
    this.segundosRestantes = 0;
    this.reloj = null;
  }

  connectedCallback() {
    this.examen = obtenerExamenElegido();
    this.estudiante = JSON.parse(sessionStorage.getItem(llaves.estudianteActual) || "null");

    if (!this.estudiante) {
      window.location.href = "registro.html";
      return;
    }

    this.segundosRestantes = this.examen.timeLimit * 60;
    this.mostrarPregunta();
    this.iniciarReloj();
  }

  disconnectedCallback() {
    clearInterval(this.reloj);
  }

  mostrarPregunta() {
    const pregunta = this.examen.questions[this.preguntaActual];
    const cantidadRespondidas = Object.keys(this.respuestas).length;

    this.innerHTML = `
      <div class="exam-heading">
        <div>
          <p class="code">${limpiarTexto(this.examen.code)}</p>
          <h1>${limpiarTexto(this.examen.title)}</h1>
          <p>${this.examen.questions.length} preguntas - Aprueba con ${this.examen.approvalPercentage}% - Estudiante: ${limpiarTexto(this.estudiante.fullName)}</p>
        </div>
        <strong class="timer" data-reloj>${convertirTiempo(this.segundosRestantes)}</strong>
      </div>

      <div class="runner-stats">
        <span>Pregunta ${this.preguntaActual + 1} de ${this.examen.questions.length}</span>
        <span>${cantidadRespondidas} respondidas</span>
        <span>${this.examen.timeLimit} min limite</span>
      </div>

      <form class="questions-form">
        <fieldset class="question-card">
          <legend>${this.preguntaActual + 1}. ${limpiarTexto(pregunta.text)}</legend>
          ${pregunta.answers.map((respuesta) => `
            <label>
              <input type="radio" name="pregunta_${limpiarTexto(pregunta.id)}" value="${limpiarTexto(respuesta.id)}" ${this.respuestas[pregunta.id] === respuesta.id ? "checked" : ""}>
              ${limpiarTexto(respuesta.text)}
            </label>
          `).join("")}
        </fieldset>

        <div class="runner-actions">
          <button class="plain-button" type="button" data-anterior ${this.preguntaActual === 0 ? "disabled" : ""}>Anterior</button>
          <button class="secondary-button" type="button" data-siguiente ${this.preguntaActual === this.examen.questions.length - 1 ? "disabled" : ""}>Siguiente</button>
          <button class="primary-button finish-button" type="submit">Terminar examen</button>
        </div>
      </form>
    `;

    this.querySelectorAll("input[type='radio']").forEach((opcion) => {
      opcion.addEventListener("change", () => {
        this.respuestas[pregunta.id] = opcion.value;
        this.actualizarContadorRespondidas();
      });
    });

    this.querySelector("[data-anterior]").addEventListener("click", () => {
      this.preguntaActual--;
      this.mostrarPregunta();
    });

    this.querySelector("[data-siguiente]").addEventListener("click", () => {
      this.preguntaActual++;
      this.mostrarPregunta();
    });

    this.querySelector("form").addEventListener("submit", (evento) => {
      evento.preventDefault();
      this.terminarExamen();
    });
  }

  actualizarContadorRespondidas() {
    const estadisticas = this.querySelector(".runner-stats");

    if (estadisticas) {
      estadisticas.children[1].textContent = `${Object.keys(this.respuestas).length} respondidas`;
    }
  }

  iniciarReloj() {
    this.reloj = setInterval(() => {
      this.segundosRestantes--;
      const textoReloj = this.querySelector("[data-reloj]");

      if (textoReloj) {
        textoReloj.textContent = convertirTiempo(Math.max(this.segundosRestantes, 0));
        textoReloj.classList.toggle("timer-danger", this.segundosRestantes <= 60);
      }

      if (this.segundosRestantes <= 0) {
        this.terminarExamen(true);
      }
    }, 1000);
  }

  terminarExamen(tiempoAgotado = false) {
    clearInterval(this.reloj);

    const totalPreguntas = this.examen.questions.length;
    const respuestasCorrectas = this.examen.questions.reduce((total, pregunta) => {
      const respuestaElegida = this.respuestas[pregunta.id];
      const respuestaCorrecta = pregunta.answers.find((respuesta) => respuesta.correct);
      return total + (respuestaElegida === respuestaCorrecta.id ? 1 : 0);
    }, 0);
    const porcentaje = Math.round((respuestasCorrectas / totalPreguntas) * 100);
    const aprobado = porcentaje >= this.examen.approvalPercentage;

    const resultado = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      examId: this.examen.id,
      examTitle: this.examen.title,
      studentId: this.estudiante.id,
      studentName: this.estudiante.fullName,
      correct: respuestasCorrectas,
      total: totalPreguntas,
      percentage: porcentaje,
      approved: aprobado,
      timeExpired: tiempoAgotado,
      answers: this.respuestas,
      finishedAt: new Date().toISOString()
    };

    const resultadosGuardados = JSON.parse(localStorage.getItem(llaves.resultados) || "[]");
    resultadosGuardados.push(resultado);
    localStorage.setItem(llaves.resultados, JSON.stringify(resultadosGuardados));
    sessionStorage.setItem(llaves.resultadoActual, JSON.stringify(resultado));
    window.location.href = "resultado.html";
  }
}

class VistaResultadoExamen extends HTMLElement {
  connectedCallback() {
    const resultado = JSON.parse(sessionStorage.getItem(llaves.resultadoActual) || "null");

    if (!resultado) {
      this.innerHTML = `
        <article class="result-card">
          <span>Resultado</span>
          <strong>--</strong>
          <p>No hay un resultado activo para mostrar.</p>
          <a class="primary-button wide-button" href="index.html">Volver a examenes</a>
        </article>
      `;
      return;
    }

    this.innerHTML = `
      <article class="result-card">
        <span>Resultado</span>
        <strong>${resultado.percentage}%</strong>
        <p>${resultado.correct} de ${resultado.total} respuestas acertadas.</p>
        <p class="result-meta">Estudiante: ${limpiarTexto(resultado.studentName)} - ID: ${limpiarTexto(resultado.studentId)}</p>
        <div class="status ${resultado.approved ? "pass" : "fail"}">${resultado.approved ? "Examen aprobado" : "Examen no aprobado"}</div>
        <a class="primary-button wide-button" href="index.html">Volver a examenes</a>
      </article>
    `;
  }
}

customElements.define("exam-hub-view", VistaCatalogoExamenes);
customElements.define("student-register-view", VistaRegistroEstudiante);
customElements.define("exam-runner-view", VistaResolverExamen);
customElements.define("exam-result-view", VistaResultadoExamen);
