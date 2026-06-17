//funcion de examenes
const inputs = document.querySelectorAll("input");
const textarea = document.querySelector("textarea");


let examenes = [];

function crearExamen() {

    const examen = {
        codigo: inputs[0].value,
        titulo: inputs[1].value,
        tiempo: inputs[2].value,
        aprobacion: inputs[3].value,
        descripcion: textarea.value,
        preguntas: []
    };

    console.log(examenes);
}

function eliminarExamen(index){

    examenes.splice(index,1);

    guardarLocalStorage();

    mostrarExamenes();
}


function editarExamen(index){

    indiceEditar = index;

    const examen = examenes[index];

    inputs[0].value = examen.codigo;
    inputs[1].value = examen.titulo;
    inputs[2].value = examen.tiempo;
    inputs[3].value = examen.aprobacion;
    textarea.value = examen.descripcion;
}

function actualizarExamen(){

    examenes[indiceEditar] = {

        codigo: inputs[0].value,
        titulo: inputs[1].value,
        tiempo: inputs[2].value,
        aprobacion: inputs[3].value,
        descripcion: textarea.value,
        preguntas: examenes[indiceEditar].preguntas
    };

    guardarLocalStorage();

    mostrarExamenes();
}

function crearPregunta(indiceExamen,texto){

    examenes[indiceExamen].preguntas.push({

        texto:texto,

        respuestas:[]
    });

    guardarLocalStorage();
}

function crearRespuesta(indiceExamen,indicePregunta,texto,esCorrecta){

    examenes[indiceExamen].preguntas[indicePregunta].respuestas.push({
        texto:texto,
        esCorrecta:esCorrecta
    });

    guardarLocalStorage();
}

function marcarCorrecta(
    indiceExamen,
    indicePregunta,
    indiceRespuesta
){

    const respuestas =
    examenes[indiceExamen]
    .preguntas[indicePregunta]
    .respuestas;

    respuestas.forEach(r => {

        r.correcta = false;
    });

    respuestas[indiceRespuesta]
    .correcta = true;

    guardarLocalStorage();
}

function guardarLocalStorage(){

    localStorage.setItem("examenes",JSON.stringify(examenes));
}

function cargarLocalStorage(){

    const examenesGuardados = localStorage.getItem("examenes");

    if(examenesGuardados){
        examenes = JSON.parse(examenesGuardados);
    }
}

function mostrarExamenes(){

    const contenedor = document.getElementById("contenedor-examenes");

    contenedor.innerHTML = "";

    examenes.forEach((examen,index) => {

        const examenCard = document.createElement("div");
        examenCard.classList.add("examen-card");

        const titulo = document.createElement("h3");
        titulo.textContent = examen.titulo;

        const tiempo = document.createElement("span");
        tiempo.textContent = examen.tiempo;

        const aprobacion = document.createElement("span");
        aprobacion.textContent = examen.aprobacion;

        const acciones = document.createElement("div");
        acciones.classList.add("acciones");

        const editar = document.createElement("button");
        editar.classList.add("secondary-button");
        editar.textContent = "Editar";
        editar.onclick = () => editarExamen(index);

        const eliminar = document.createElement("button");
        eliminar.classList.add("danger-button");
        eliminar.textContent = "Eliminar";
        eliminar.onclick = () => eliminarExamen(index);

        acciones.appendChild(editar);
        acciones.appendChild(eliminar);

        examenCard.appendChild(titulo);
        examenCard.appendChild(tiempo);
        examenCard.appendChild(aprobacion);
        examenCard.appendChild(acciones);

        contenedor.appendChild(examenCard);
    });
} 

cargarLocalStorage();
mostrarExamenes();  

//funcion de presentacion

const respuestasCorrectas = {
    q1: "const",
    q2: "forEach",
    q3: "localStorage",
    q4: "for",
    q5: "push",
    q6: "===",
    q7: "console.log()",
    q8: "let",
    q9: "pop()",
    q10: "function"
};

// funcion del temporizador del examen
let tiempo = 10 * 60; // 10 minutos

const timer = document.querySelector(".timer");

function actualizarReloj() {

    let minutos = Math.floor(tiempo / 60);
    let segundos = tiempo % 60;

   if (minutos < 10) {
    minutos = "0" + minutos;
} else {
    minutos = minutos;
}

if (segundos < 10) {
    segundos = "0" + segundos;
} else {
    segundos = segundos;
}
   
    timer.textContent = `${minutos}:${segundos}`;

    if (tiempo <= 0) {

        clearInterval(intervalo);

        finalizarExamen();
        return;
    }

    tiempo--;
    console.log(tiempo);
}

const intervalo = setInterval(actualizarReloj, 1000);

actualizarReloj();


// boton para terminar el examen
const botonTerminar =
document.querySelector(".finish-button");

botonTerminar.addEventListener("click", function(e){

    e.preventDefault();

    finalizarExamen();
});


// funcion para que calcule el resultado del examen
function finalizarExamen(){

    clearInterval(intervalo);

    let correctas = 0;

    for(let pregunta in respuestasCorrectas){

        const seleccionada =
        document.querySelector(
            `input[name="${pregunta}"]:checked`
        );

        if(!seleccionada) continue;

        const respuestaUsuario =
        seleccionada.parentElement.textContent.trim();

        if(
            respuestaUsuario ===
            respuestasCorrectas[pregunta]
        ){
            correctas++;
        }
    }

    const total =
    Object.keys(respuestasCorrectas).length;

    const porcentaje =
    (correctas / total) * 100;

    const aprobado =
    porcentaje >= 70;

    const resultado = {

        correctas,
        total,
        porcentaje: porcentaje.toFixed(2),
        aprobado
    };

    localStorage.setItem(
        "resultadoExamen",
        JSON.stringify(resultado)
    );

    window.location.href =
    "resultado.html";
}

//funcion de mostrar el resultado
function mostrarResultado() {
    const resultado = JSON.parse(localStorage.getItem("resultadoExamen"));
    console.log(resultado);
}

mostrarResultado();

const resultado = JSON.parse(
    localStorage.getItem(
        "resultadoExamen"
    )
);

console.log(resultado);
