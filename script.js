const llaves = {
  examenes: "acme_exams",
  examenElegido: "acme_selected_exam",
  estudianteActual: "acme_current_student",
  resultadoActual: "acme_current_result",
  resultados: "acme_results",
  usuarios: "acme_users",
  sesion: "acme_session"
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

const usuariosDePrueba = [
  {
    id: "100000001",
    fullName: "Administrador Acme",
    email: "admin@acme.edu",
    phone: "3001234567",
    role: "Administrativo",
    password: "Admin1234"
  }
];

let preguntasDelFormulario = [];

function normalizarUsuario(usuario, indice = 0) {
  return {
    id: String(usuario.id || usuario.identificacion || `usuario-${indice + 1}`),
    fullName: usuario.fullName || usuario.nombre || "Usuario sin nombre",
    email: usuario.email || "",
    phone: usuario.phone || usuario.telefono || "",
    role: usuario.role || usuario.cargo || "Docente",
    password: usuario.password || usuario.contrasena || "Usuario123"
  };
}

function normalizarExamen(examen, indice = 0) {
  const codigo = examen.code || examen.codigo || `EX-${indice + 1}`;
  const preguntas = examen.questions || examen.preguntas || [];

  return {
    id: String(examen.id || codigo),
    code: String(codigo),
    title: examen.title || examen.titulo || "Examen sin titulo",
    timeLimit: Number(examen.timeLimit || examen.tiempo || 10),
    approvalPercentage: Number(examen.approvalPercentage || examen.aprobacion || 70),
    description: examen.description || examen.descripcion || "Examen creado desde el modulo de gestion.",
    createdBy: examen.createdBy || examen.creadorId || "",
    creatorName: examen.creatorName || examen.creadorNombre || "Sin creador asignado",
    questions: preguntas.map((pregunta, indicePregunta) => {
      const respuestas = pregunta.answers || pregunta.respuestas || [];

      return {
        id: String(pregunta.id || `q${indicePregunta + 1}`),
        text: pregunta.text || pregunta.texto || `Pregunta ${indicePregunta + 1}`,
        answers: respuestas.map((respuesta, indiceRespuesta) => ({
          id: String(respuesta.id || `q${indicePregunta + 1}-a${indiceRespuesta + 1}`),
          text: respuesta.text || respuesta.texto || `Respuesta ${indiceRespuesta + 1}`,
          correct: Boolean(respuesta.correct || respuesta.correcta || respuesta.esCorrecta)
        }))
      };
    })
  };
}

function unirPorId(listaBase, listaNueva) {
  const mapa = new Map();

  [...listaBase, ...listaNueva].forEach((item) => {
    mapa.set(String(item.id), item);
  });

  return Array.from(mapa.values());
}

function migrarDatosAnteriores() {
  const usuariosAntiguos = JSON.parse(localStorage.getItem("usuarios") || "[]").map(normalizarUsuario);
  const examenesAntiguos = JSON.parse(localStorage.getItem("examenes") || "[]").map(normalizarExamen);
  const usuariosActuales = JSON.parse(localStorage.getItem(llaves.usuarios) || "[]").map(normalizarUsuario);
  const examenesActuales = JSON.parse(localStorage.getItem(llaves.examenes) || "[]").map(normalizarExamen);
  const usuariosUnidos = unirPorId(usuariosActuales, usuariosAntiguos);
  const examenesUnidos = unirPorId(examenesActuales, examenesAntiguos);

  if (usuariosUnidos.length) {
    localStorage.setItem(llaves.usuarios, JSON.stringify(usuariosUnidos));
  }

  if (examenesUnidos.length) {
    localStorage.setItem(llaves.examenes, JSON.stringify(examenesUnidos));
  }

  if (!sessionStorage.getItem(llaves.sesion) && localStorage.getItem("isLoggedIn") === "true") {
    const email = localStorage.getItem("userEmail");
    const usuario = usuariosUnidos.find((item) => item.email === email);

    if (usuario) {
      guardarSesion(usuario);
    }
  }
}

function crearDatosIniciales() {
  migrarDatosAnteriores();

  if (!localStorage.getItem(llaves.examenes)) {
    localStorage.setItem(llaves.examenes, JSON.stringify(examenesDePrueba));
  }

  if (!localStorage.getItem(llaves.usuarios)) {
    localStorage.setItem(llaves.usuarios, JSON.stringify(usuariosDePrueba));
  }
}

function obtenerExamenes() {
  crearDatosIniciales();
  return (JSON.parse(localStorage.getItem(llaves.examenes)) || []).map(normalizarExamen);
}

function guardarExamenes(examenes) {
  localStorage.setItem(llaves.examenes, JSON.stringify(examenes));
}

function obtenerUsuarios() {
  crearDatosIniciales();
  return (JSON.parse(localStorage.getItem(llaves.usuarios)) || []).map(normalizarUsuario);
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(llaves.usuarios, JSON.stringify(usuarios));
}

function obtenerSesion() {
  return JSON.parse(sessionStorage.getItem(llaves.sesion) || "null");
}

function guardarSesion(usuario) {
  sessionStorage.setItem(llaves.sesion, JSON.stringify({
    id: usuario.id,
    fullName: usuario.fullName,
    email: usuario.email,
    role: usuario.role
  }));
}

function cerrarSesion() {
  sessionStorage.removeItem(llaves.sesion);
  window.location.href = "login.html";
}

function protegerVistaPrivada() {
  const pagina = location.pathname.split("/").pop();
  const esPrivada = pagina === "usuarios.html" || pagina === "examenes.html";

  if (esPrivada && !obtenerSesion()) {
    window.location.href = "login.html";
  }
}

function obtenerExamenElegido() {
  const idExamen = sessionStorage.getItem(llaves.examenElegido);
  const examenes = obtenerExamenes();
  return examenes.find((examen) => examen.id === idExamen) || examenes[0];
}

function limpiarTexto(texto) {
  return String(texto ?? "")
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

function crearId(prefijo) {
  return `${prefijo}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function iniciarEventosGlobales() {
  document.querySelectorAll("[data-cerrar-sesion]").forEach((boton) => {
    boton.addEventListener("click", cerrarSesion);
  });
}

function iniciarLogin() {
  const formulario = document.querySelector("#formularioLogin");
  if (!formulario) return;

  const mensaje = document.querySelector("#mensajeLogin");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    const email = formulario.querySelector("#email").value.trim().toLowerCase();
    const password = formulario.querySelector("#password").value;
    const usuario = obtenerUsuarios().find((item) => item.email.toLowerCase() === email && item.password === password);

    if (!usuario) {
      mensaje.textContent = "Correo o contrasena incorrectos.";
      return;
    }

    guardarSesion(usuario);
    window.location.href = "usuarios.html";
  });
}

function iniciarUsuarios() {
  const formulario = document.querySelector("#formularioUsuario");
  const tabla = document.querySelector("#tablaUsuarios");
  if (!formulario || !tabla) return;

  const campoEditando = formulario.querySelector("#usuarioEditando");

  function limpiarFormulario() {
    formulario.reset();
    campoEditando.value = "";
    formulario.querySelector("button[type='submit']").textContent = "Crear usuario";
  }

  function pintarUsuarios() {
    const usuarios = obtenerUsuarios();
    const contador = tabla.closest(".table-panel").querySelector(".panel-title-row span");

    contador.textContent = `${usuarios.length} registro${usuarios.length === 1 ? "" : "s"}`;

    if (!usuarios.length) {
      tabla.innerHTML = `<tr><td colspan="5"><div class="empty-state">No hay usuarios registrados.</div></td></tr>`;
      return;
    }

    tabla.innerHTML = usuarios.map((usuario) => `
      <tr>
        <td>${limpiarTexto(usuario.id)}</td>
        <td>${limpiarTexto(usuario.fullName)}</td>
        <td>${limpiarTexto(usuario.email)}</td>
        <td><span class="pill">${limpiarTexto(usuario.role)}</span></td>
        <td>
          <button class="plain-button" type="button" data-editar-usuario="${limpiarTexto(usuario.id)}">Editar</button>
          <button class="plain-button" type="button" data-eliminar-usuario="${limpiarTexto(usuario.id)}">Eliminar</button>
        </td>
      </tr>
    `).join("");

    tabla.querySelectorAll("[data-editar-usuario]").forEach((boton) => {
      boton.addEventListener("click", () => {
        const usuario = obtenerUsuarios().find((item) => item.id === boton.dataset.editarUsuario);
        if (!usuario) return;

        campoEditando.value = usuario.id;
        formulario.querySelector("#userId").value = usuario.id;
        formulario.querySelector("#fullName").value = usuario.fullName;
        formulario.querySelector("#userEmail").value = usuario.email;
        formulario.querySelector("#phone").value = usuario.phone;
        formulario.querySelector("#role").value = usuario.role;
        formulario.querySelector("#userPassword").value = usuario.password;
        formulario.querySelector("button[type='submit']").textContent = "Actualizar usuario";
      });
    });

    tabla.querySelectorAll("[data-eliminar-usuario]").forEach((boton) => {
      boton.addEventListener("click", () => {
        const usuariosFiltrados = obtenerUsuarios().filter((usuario) => usuario.id !== boton.dataset.eliminarUsuario);
        guardarUsuarios(usuariosFiltrados);
        pintarUsuarios();
      });
    });
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    const usuario = {
      id: formulario.querySelector("#userId").value.trim(),
      fullName: formulario.querySelector("#fullName").value.trim(),
      email: formulario.querySelector("#userEmail").value.trim(),
      phone: formulario.querySelector("#phone").value.trim(),
      role: formulario.querySelector("#role").value,
      password: formulario.querySelector("#userPassword").value
    };
    const usuarios = obtenerUsuarios();
    const idOriginal = campoEditando.value;
    const existeOtro = usuarios.some((item) => item.id === usuario.id && item.id !== idOriginal);

    if (existeOtro) {
      formulario.querySelector("#userId").setCustomValidity("Ya existe un usuario con esta identificacion.");
      formulario.reportValidity();
      formulario.querySelector("#userId").setCustomValidity("");
      return;
    }

    const nuevosUsuarios = idOriginal
      ? usuarios.map((item) => item.id === idOriginal ? usuario : item)
      : [...usuarios, usuario];

    guardarUsuarios(nuevosUsuarios);
    limpiarFormulario();
    pintarUsuarios();
  });

  formulario.addEventListener("reset", () => {
    setTimeout(() => {
      campoEditando.value = "";
      formulario.querySelector("button[type='submit']").textContent = "Crear usuario";
    }, 0);
  });

  pintarUsuarios();
}

function crearPreguntaVacia() {
  return {
    id: crearId("q"),
    text: "",
    answers: [
      { id: crearId("a"), text: "", correct: true },
      { id: crearId("a"), text: "", correct: false }
    ]
  };
}

function iniciarExamenes() {
  const formulario = document.querySelector("#formularioExamen");
  const contenedorPreguntas = document.querySelector("#contenedorPreguntas");
  const tabla = document.querySelector("#tablaExamenes");
  const botonAgregarPregunta = document.querySelector("#agregarPregunta");
  if (!formulario || !contenedorPreguntas || !tabla || !botonAgregarPregunta) return;

  const campoEditando = formulario.querySelector("#examenEditando");

  function limpiarFormulario() {
    formulario.reset();
    campoEditando.value = "";
    preguntasDelFormulario = [crearPreguntaVacia()];
    formulario.querySelector("button[type='submit']").textContent = "Guardar examen";
    pintarPreguntas();
  }

  function pintarPreguntas() {
    contenedorPreguntas.innerHTML = preguntasDelFormulario.map((pregunta, indicePregunta) => `
      <div class="question-editor" data-pregunta="${indicePregunta}">
        <label for="pregunta_${indicePregunta}">Pregunta ${indicePregunta + 1}</label>
        <input id="pregunta_${indicePregunta}" type="text" minlength="8" maxlength="180" value="${limpiarTexto(pregunta.text)}" data-texto-pregunta="${indicePregunta}" required>

        ${pregunta.answers.map((respuesta, indiceRespuesta) => `
          <label class="answer-row">
            <input type="radio" name="correcta_${indicePregunta}" data-respuesta-correcta="${indicePregunta}:${indiceRespuesta}" ${respuesta.correct ? "checked" : ""} required>
            <input type="text" placeholder="Descripcion de la respuesta" minlength="2" maxlength="120" value="${limpiarTexto(respuesta.text)}" data-texto-respuesta="${indicePregunta}:${indiceRespuesta}" required>
            <button class="plain-button" type="button" data-quitar-respuesta="${indicePregunta}:${indiceRespuesta}">Quitar</button>
          </label>
        `).join("")}

        <div class="question-actions">
          <button class="secondary-button" type="button" data-agregar-respuesta="${indicePregunta}">Agregar respuesta</button>
          <button class="plain-button" type="button" data-quitar-pregunta="${indicePregunta}">Quitar pregunta</button>
        </div>
      </div>
    `).join("");

    contenedorPreguntas.querySelectorAll("[data-texto-pregunta]").forEach((campo) => {
      campo.addEventListener("input", () => {
        preguntasDelFormulario[Number(campo.dataset.textoPregunta)].text = campo.value;
      });
    });

    contenedorPreguntas.querySelectorAll("[data-texto-respuesta]").forEach((campo) => {
      campo.addEventListener("input", () => {
        const [indicePregunta, indiceRespuesta] = campo.dataset.textoRespuesta.split(":").map(Number);
        preguntasDelFormulario[indicePregunta].answers[indiceRespuesta].text = campo.value;
      });
    });

    contenedorPreguntas.querySelectorAll("[data-respuesta-correcta]").forEach((campo) => {
      campo.addEventListener("change", () => {
        const [indicePregunta, indiceRespuesta] = campo.dataset.respuestaCorrecta.split(":").map(Number);
        preguntasDelFormulario[indicePregunta].answers = preguntasDelFormulario[indicePregunta].answers.map((respuesta, index) => ({
          ...respuesta,
          correct: index === indiceRespuesta
        }));
        pintarPreguntas();
      });
    });

    contenedorPreguntas.querySelectorAll("[data-agregar-respuesta]").forEach((boton) => {
      boton.addEventListener("click", () => {
        const indicePregunta = Number(boton.dataset.agregarRespuesta);
        preguntasDelFormulario[indicePregunta].answers.push({ id: crearId("a"), text: "", correct: false });
        pintarPreguntas();
      });
    });

    contenedorPreguntas.querySelectorAll("[data-quitar-respuesta]").forEach((boton) => {
      boton.addEventListener("click", () => {
        const [indicePregunta, indiceRespuesta] = boton.dataset.quitarRespuesta.split(":").map(Number);
        const respuestas = preguntasDelFormulario[indicePregunta].answers;
        if (respuestas.length <= 2) return;
        respuestas.splice(indiceRespuesta, 1);
        if (!respuestas.some((respuesta) => respuesta.correct)) respuestas[0].correct = true;
        pintarPreguntas();
      });
    });

    contenedorPreguntas.querySelectorAll("[data-quitar-pregunta]").forEach((boton) => {
      boton.addEventListener("click", () => {
        if (preguntasDelFormulario.length <= 1) return;
        preguntasDelFormulario.splice(Number(boton.dataset.quitarPregunta), 1);
        pintarPreguntas();
      });
    });
  }

  function pintarExamenes() {
    const sesion = obtenerSesion();
    const examenes = obtenerExamenes().filter((examen) => {
      return !examen.createdBy || sesion?.role === "Administrativo" || examen.createdBy === sesion?.id;
    });
    const contador = tabla.closest(".table-panel").querySelector(".panel-title-row span");

    contador.textContent = `${examenes.length} registro${examenes.length === 1 ? "" : "s"}`;

    if (!examenes.length) {
      tabla.innerHTML = `<tr><td colspan="7"><div class="empty-state">No hay examenes registrados.</div></td></tr>`;
      return;
    }

    tabla.innerHTML = examenes.map((examen) => `
      <tr>
        <td>${limpiarTexto(examen.code)}</td>
        <td>${limpiarTexto(examen.title)}</td>
        <td>${examen.timeLimit} min</td>
        <td>${examen.approvalPercentage}%</td>
        <td>${examen.questions.length}</td>
        <td>${limpiarTexto(examen.creatorName)}</td>
        <td>
          <button class="plain-button" type="button" data-editar-examen="${limpiarTexto(examen.id)}">Editar</button>
          <button class="plain-button" type="button" data-eliminar-examen="${limpiarTexto(examen.id)}">Eliminar</button>
        </td>
      </tr>
    `).join("");

    tabla.querySelectorAll("[data-editar-examen]").forEach((boton) => {
      boton.addEventListener("click", () => {
        const examen = obtenerExamenes().find((item) => item.id === boton.dataset.editarExamen);
        if (!examen) return;

        campoEditando.value = examen.id;
        formulario.querySelector("#codigoExamen").value = examen.code;
        formulario.querySelector("#tituloExamen").value = examen.title;
        formulario.querySelector("#tiempoExamen").value = examen.timeLimit;
        formulario.querySelector("#porcentajeExamen").value = examen.approvalPercentage;
        formulario.querySelector("#descripcionExamen").value = examen.description;
        preguntasDelFormulario = JSON.parse(JSON.stringify(examen.questions));
        formulario.querySelector("button[type='submit']").textContent = "Actualizar examen";
        pintarPreguntas();
      });
    });

    tabla.querySelectorAll("[data-eliminar-examen]").forEach((boton) => {
      boton.addEventListener("click", () => {
        const examenesFiltrados = obtenerExamenes().filter((examen) => examen.id !== boton.dataset.eliminarExamen);
        guardarExamenes(examenesFiltrados);
        pintarExamenes();
      });
    });
  }

  botonAgregarPregunta.addEventListener("click", () => {
    preguntasDelFormulario.push(crearPreguntaVacia());
    pintarPreguntas();
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    const preguntasValidas = preguntasDelFormulario.every((pregunta) => {
      const respuestasLlenas = pregunta.answers.filter((respuesta) => respuesta.text.trim()).length >= 2;
      const correctas = pregunta.answers.filter((respuesta) => respuesta.correct).length;
      return pregunta.text.trim().length >= 8 && respuestasLlenas && correctas === 1;
    });

    if (!preguntasValidas) {
      alert("Cada pregunta debe tener texto, minimo dos respuestas y solo una correcta.");
      return;
    }

    const idOriginal = campoEditando.value;
    const codigo = formulario.querySelector("#codigoExamen").value.trim();
    const sesion = obtenerSesion();
    const examenes = obtenerExamenes();
    const examenAnterior = examenes.find((item) => item.id === idOriginal);
    const examen = {
      id: idOriginal || codigo,
      code: codigo,
      title: formulario.querySelector("#tituloExamen").value.trim(),
      timeLimit: Number(formulario.querySelector("#tiempoExamen").value),
      approvalPercentage: Number(formulario.querySelector("#porcentajeExamen").value),
      description: formulario.querySelector("#descripcionExamen").value.trim(),
      createdBy: examenAnterior?.createdBy || sesion?.id || "",
      creatorName: examenAnterior?.creatorName || sesion?.fullName || "Sin creador asignado",
      questions: preguntasDelFormulario.map((pregunta, indicePregunta) => ({
        id: pregunta.id || `q${indicePregunta + 1}`,
        text: pregunta.text.trim(),
        answers: pregunta.answers.map((respuesta, indiceRespuesta) => ({
          id: respuesta.id || `${pregunta.id}-a${indiceRespuesta + 1}`,
          text: respuesta.text.trim(),
          correct: respuesta.correct
        }))
      }))
    };
    const existeOtro = examenes.some((item) => item.code === examen.code && item.id !== idOriginal);

    if (existeOtro) {
      formulario.querySelector("#codigoExamen").setCustomValidity("Ya existe un examen con este codigo.");
      formulario.reportValidity();
      formulario.querySelector("#codigoExamen").setCustomValidity("");
      return;
    }

    const nuevosExamenes = idOriginal
      ? examenes.map((item) => item.id === idOriginal ? examen : item)
      : [...examenes, examen];

    guardarExamenes(nuevosExamenes);
    limpiarFormulario();
    pintarExamenes();
  });

  formulario.addEventListener("reset", () => {
    setTimeout(() => {
      campoEditando.value = "";
      preguntasDelFormulario = [crearPreguntaVacia()];
      formulario.querySelector("button[type='submit']").textContent = "Guardar examen";
      pintarPreguntas();
    }, 0);
  });

  limpiarFormulario();
  pintarExamenes();
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
    this.mostrarExamenCompleto();
    this.iniciarReloj();
  }

  disconnectedCallback() {
    clearInterval(this.reloj);
  }

  mostrarExamenCompleto() {
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
        <span>${this.examen.questions.length} preguntas</span>
        <span>${cantidadRespondidas} respondidas</span>
        <span>${this.examen.timeLimit} min limite</span>
      </div>

      <form class="questions-form">
        ${this.examen.questions.map((pregunta, indicePregunta) => `
          <fieldset class="question-card">
            <legend>${indicePregunta + 1}. ${limpiarTexto(pregunta.text)}</legend>
            ${pregunta.answers.map((respuesta) => `
              <label>
                <input type="radio" name="pregunta_${limpiarTexto(pregunta.id)}" value="${limpiarTexto(respuesta.id)}" ${this.respuestas[pregunta.id] === respuesta.id ? "checked" : ""}>
                ${limpiarTexto(respuesta.text)}
              </label>
            `).join("")}
          </fieldset>
        `).join("")}

        <div class="runner-actions">
          <button class="primary-button finish-button" type="submit">Terminar examen</button>
        </div>
      </form>
    `;

    this.querySelectorAll("input[type='radio']").forEach((opcion) => {
      opcion.addEventListener("change", () => {
        const idPregunta = opcion.name.replace("pregunta_", "");
        this.respuestas[idPregunta] = opcion.value;
        this.actualizarContadorRespondidas();
      });
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
    const detalle = this.examen.questions.map((pregunta) => {
      const respuestaElegida = this.respuestas[pregunta.id];
      const respuestaCorrecta = pregunta.answers.find((respuesta) => respuesta.correct);
      const opcionElegida = pregunta.answers.find((respuesta) => respuesta.id === respuestaElegida);

      return {
        questionId: pregunta.id,
        questionText: pregunta.text,
        selectedAnswerId: respuestaElegida || "",
        selectedAnswerText: opcionElegida?.text || "Sin responder",
        correctAnswerId: respuestaCorrecta?.id || "",
        correctAnswerText: respuestaCorrecta?.text || "Sin respuesta correcta",
        isCorrect: respuestaElegida === respuestaCorrecta?.id
      };
    });
    const respuestasCorrectas = detalle.filter((pregunta) => pregunta.isCorrect).length;
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
      detail: detalle,
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

    const detalle = resultado.detail || [];

    this.innerHTML = `
      <article class="result-card">
        <span>Resultado</span>
        <strong>${resultado.percentage}%</strong>
        <p>${resultado.correct} de ${resultado.total} respuestas acertadas.</p>
        <p class="result-meta">Estudiante: ${limpiarTexto(resultado.studentName)} - ID: ${limpiarTexto(resultado.studentId)}</p>
        <div class="status ${resultado.approved ? "pass" : "fail"}">${resultado.approved ? "Examen aprobado" : "Examen no aprobado"}</div>
        <div class="result-detail">
          <h2>Revision de respuestas</h2>
          ${detalle.map((pregunta, indice) => `
            <div class="result-question ${pregunta.isCorrect ? "is-correct" : "is-wrong"}">
              <h3>${indice + 1}. ${limpiarTexto(pregunta.questionText)}</h3>
              <p><strong>Tu respuesta:</strong> ${limpiarTexto(pregunta.selectedAnswerText)}</p>
              <p><strong>Respuesta correcta:</strong> ${limpiarTexto(pregunta.correctAnswerText)}</p>
            </div>
          `).join("")}
        </div>
        <a class="primary-button wide-button" href="index.html">Volver a examenes</a>
      </article>
    `;
  }
}

crearDatosIniciales();
protegerVistaPrivada();
iniciarEventosGlobales();
iniciarLogin();
iniciarUsuarios();
iniciarExamenes();

customElements.define("exam-hub-view", VistaCatalogoExamenes);
customElements.define("student-register-view", VistaRegistroEstudiante);
customElements.define("exam-runner-view", VistaResolverExamen);
customElements.define("exam-result-view", VistaResultadoExamen);
