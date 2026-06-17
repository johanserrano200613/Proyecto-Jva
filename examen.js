//funcion de examenes
const inputs = document.querySelectorAll("form input");
const textarea = document.querySelector("form textarea");

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

