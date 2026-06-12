const STORAGE_KEYS = {
  exams: "acme_exams",
  selectedExam: "acme_selected_exam",
  currentStudent: "acme_current_student",
  currentResult: "acme_current_result",
  results: "acme_results"
};

const demoExams = [
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

function seedExams() {
  if (!localStorage.getItem(STORAGE_KEYS.exams)) {
    localStorage.setItem(STORAGE_KEYS.exams, JSON.stringify(demoExams));
  }
}

function getExams() {
  seedExams();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.exams)) || [];
}

function getSelectedExam() {
  const selectedId = sessionStorage.getItem(STORAGE_KEYS.selectedExam);
  const exams = getExams();
  return exams.find((exam) => exam.id === selectedId) || exams[0];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

class ExamHubView extends HTMLElement {
  connectedCallback() {
    const exams = getExams();

    this.innerHTML = `
      <div class="hero-card">
        <span>Modulo publico</span>
        <h1>Selecciona un examen disponible</h1>
        <p>Elige una prueba, registra tus datos y responde dentro del tiempo establecido.</p>
      </div>

      <div class="exam-list">
        ${exams.map((exam) => `
          <article class="exam-card">
            <p class="code">${escapeHtml(exam.code)}</p>
            <h2>${escapeHtml(exam.title)}</h2>
            <p>${escapeHtml(exam.description)}</p>
            <div class="meta-row">
              <span>${exam.timeLimit} min</span>
              <span>${exam.approvalPercentage}% aprueba</span>
              <span>${exam.questions.length} preguntas</span>
            </div>
            <button class="primary-button" type="button" data-exam-id="${escapeHtml(exam.id)}">Presentar Examen</button>
          </article>
        `).join("")}
      </div>
    `;

    this.querySelectorAll("[data-exam-id]").forEach((button) => {
      button.addEventListener("click", () => {
        sessionStorage.setItem(STORAGE_KEYS.selectedExam, button.dataset.examId);
        sessionStorage.removeItem(STORAGE_KEYS.currentStudent);
        sessionStorage.removeItem(STORAGE_KEYS.currentResult);
        window.location.href = "registro.html";
      });
    });
  }
}

class StudentRegisterView extends HTMLElement {
  connectedCallback() {
    const exam = getSelectedExam();
    sessionStorage.setItem(STORAGE_KEYS.selectedExam, exam.id);

    this.innerHTML = `
      <form class="panel narrow-panel">
        <p class="code">${escapeHtml(exam.code)}</p>
        <h1>${escapeHtml(exam.title)}</h1>
        <p>Antes de iniciar, registra los datos que quedaran asociados a tus respuestas.</p>

        <label for="studentId">Numero de identificacion</label>
        <input id="studentId" type="text" inputmode="numeric" pattern="[0-9]{6,12}" minlength="6" maxlength="12" title="Ingresa solo numeros, entre 6 y 12 digitos." required>
        <small class="field-help">Solo numeros, entre 6 y 12 digitos.</small>

        <label for="studentName">Nombre completo</label>
        <input id="studentName" type="text" minlength="3" maxlength="80" pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,80}" title="Ingresa tu nombre completo usando solo letras y espacios." required>
        <small class="field-help">Escribe nombres y apellidos, solo letras.</small>

        <div class="form-actions">
          <button class="primary-button" type="submit">Iniciar examen</button>
          <a class="ghost-link" href="index.html">Volver</a>
        </div>
      </form>
    `;

    this.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const student = {
        id: form.querySelector("#studentId").value.trim(),
        fullName: form.querySelector("#studentName").value.trim(),
        examId: exam.id,
        startedAt: new Date().toISOString()
      };

      sessionStorage.setItem(STORAGE_KEYS.currentStudent, JSON.stringify(student));
      window.location.href = "presentacion.html";
    });
  }
}

class ExamRunnerView extends HTMLElement {
  constructor() {
    super();
    this.currentQuestion = 0;
    this.answers = {};
    this.remainingSeconds = 0;
    this.timer = null;
  }

  connectedCallback() {
    this.exam = getSelectedExam();
    this.student = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.currentStudent) || "null");

    if (!this.student) {
      window.location.href = "registro.html";
      return;
    }

    this.remainingSeconds = this.exam.timeLimit * 60;
    this.render();
    this.startTimer();
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }

  render() {
    const question = this.exam.questions[this.currentQuestion];
    const answeredCount = Object.keys(this.answers).length;

    this.innerHTML = `
      <div class="exam-heading">
        <div>
          <p class="code">${escapeHtml(this.exam.code)}</p>
          <h1>${escapeHtml(this.exam.title)}</h1>
          <p>${this.exam.questions.length} preguntas · Aprueba con ${this.exam.approvalPercentage}% · Estudiante: ${escapeHtml(this.student.fullName)}</p>
        </div>
        <strong class="timer" data-timer>${formatTime(this.remainingSeconds)}</strong>
      </div>

      <div class="runner-stats">
        <span>Pregunta ${this.currentQuestion + 1} de ${this.exam.questions.length}</span>
        <span>${answeredCount} respondidas</span>
        <span>${this.exam.timeLimit} min limite</span>
      </div>

      <form class="questions-form">
        <fieldset class="question-card">
          <legend>${this.currentQuestion + 1}. ${escapeHtml(question.text)}</legend>
          ${question.answers.map((answer) => `
            <label>
              <input type="radio" name="pregunta_${escapeHtml(question.id)}" value="${escapeHtml(answer.id)}" ${this.answers[question.id] === answer.id ? "checked" : ""}>
              ${escapeHtml(answer.text)}
            </label>
          `).join("")}
        </fieldset>

        <div class="runner-actions">
          <button class="plain-button" type="button" data-prev ${this.currentQuestion === 0 ? "disabled" : ""}>Anterior</button>
          <button class="secondary-button" type="button" data-next ${this.currentQuestion === this.exam.questions.length - 1 ? "disabled" : ""}>Siguiente</button>
          <button class="primary-button finish-button" type="submit">Terminar examen</button>
        </div>
      </form>
    `;

    this.querySelectorAll("input[type='radio']").forEach((input) => {
      input.addEventListener("change", () => {
        this.answers[question.id] = input.value;
        this.updateStatsOnly();
      });
    });

    this.querySelector("[data-prev]").addEventListener("click", () => {
      this.currentQuestion--;
      this.render();
    });

    this.querySelector("[data-next]").addEventListener("click", () => {
      this.currentQuestion++;
      this.render();
    });

    this.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      this.finishExam();
    });
  }

  updateStatsOnly() {
    const stats = this.querySelector(".runner-stats");
    if (stats) {
      stats.children[1].textContent = `${Object.keys(this.answers).length} respondidas`;
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.remainingSeconds--;
      const timerElement = this.querySelector("[data-timer]");

      if (timerElement) {
        timerElement.textContent = formatTime(Math.max(this.remainingSeconds, 0));
        timerElement.classList.toggle("timer-danger", this.remainingSeconds <= 60);
      }

      if (this.remainingSeconds <= 0) {
        this.finishExam(true);
      }
    }, 1000);
  }

  finishExam(timeExpired = false) {
    clearInterval(this.timer);

    const total = this.exam.questions.length;
    const correct = this.exam.questions.reduce((score, question) => {
      const selectedAnswer = this.answers[question.id];
      const correctAnswer = question.answers.find((answer) => answer.correct);
      return score + (selectedAnswer === correctAnswer.id ? 1 : 0);
    }, 0);
    const percentage = Math.round((correct / total) * 100);
    const approved = percentage >= this.exam.approvalPercentage;

    const result = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      examId: this.exam.id,
      examTitle: this.exam.title,
      studentId: this.student.id,
      studentName: this.student.fullName,
      correct,
      total,
      percentage,
      approved,
      timeExpired,
      answers: this.answers,
      finishedAt: new Date().toISOString()
    };

    const storedResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.results) || "[]");
    storedResults.push(result);
    localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(storedResults));
    sessionStorage.setItem(STORAGE_KEYS.currentResult, JSON.stringify(result));
    window.location.href = "resultado.html";
  }
}

class ExamResultView extends HTMLElement {
  connectedCallback() {
    const result = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.currentResult) || "null");

    if (!result) {
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
        <strong>${result.percentage}%</strong>
        <p>${result.correct} de ${result.total} respuestas acertadas.</p>
        <p class="result-meta">Estudiante: ${escapeHtml(result.studentName)} · ID: ${escapeHtml(result.studentId)}</p>
        <div class="status ${result.approved ? "pass" : "fail"}">${result.approved ? "Examen aprobado" : "Examen no aprobado"}</div>
        <a class="primary-button wide-button" href="index.html">Volver a examenes</a>
      </article>
    `;
  }
}

customElements.define("exam-hub-view", ExamHubView);
customElements.define("student-register-view", StudentRegisterView);
customElements.define("exam-runner-view", ExamRunnerView);
customElements.define("exam-result-view", ExamResultView);
