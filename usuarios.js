document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('.panel input, .panel select');
  const createButton = document.querySelector('.panel button[type="button"]:first-of-type');
  const clearButton = document.querySelector('.panel button[type="button"]:last-of-type');
  const tableBody = document.querySelector('table tbody');
  
  let usuarios = [
    {
      id: 1,
      identificacion: '100000001',
      nombre: 'Administrador Acme',
      email: 'admin@acme.edu',
      cargo: 'Administrativo'
    }
  ];

  function cargarUsuarios() {
    const stored = localStorage.getItem('usuarios');
    if (stored) {
      usuarios = JSON.parse(stored);
    }
    renderizarTabla();
  }

  function guardarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  function renderizarTabla() {
    tableBody.innerHTML = '';
    
    usuarios.forEach((usuario, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${usuario.identificacion}</td>
        <td>${usuario.nombre}</td>
        <td>${usuario.email}</td>
        <td><span class="pill">${usuario.cargo}</span></td>
        <td><a href="#" onclick="editarUsuario(${index}); return false;">Editar</a> <a href="#" onclick="eliminarUsuario(${index}); return false;">Eliminar</a></td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelector('.panel-title-row span').textContent = `${usuarios.length} registro${usuarios.length !== 1 ? 's' : ''}`;
  }

  window.editarUsuario = function(index) {
    const usuario = usuarios[index];
    inputs[0].value = usuario.identificacion;
    inputs[1].value = usuario.nombre;
    inputs[2].value = usuario.email;
    inputs[3].value = usuario.telefono || '';
    inputs[4].value = usuario.cargo;
    inputs[5].value = usuario.password || '';
    
    createButton.textContent = 'Actualizar usuario';
    createButton.dataset.editIndex = index;
  };

  window.eliminarUsuario = function(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      usuarios.splice(index, 1);
      guardarUsuarios();
      renderizarTabla();
      limpiarFormulario();
    }
  };

  function limpiarFormulario() {
    inputs.forEach(input => input.value = '');
    createButton.textContent = 'Crear usuario';
    delete createButton.dataset.editIndex;
  }

  createButton.addEventListener('click', function() {
    const [identificacion, nombre, email, telefono, cargo, password] = Array.from(inputs).map(i => i.value.trim());

    if (!identificacion || !nombre || !email || !cargo || !password) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (!email.includes('@')) {
      alert('Por favor ingresa un email válido');
      return;
    }

    const isEdit = createButton.dataset.editIndex !== undefined;
    const editIndex = parseInt(createButton.dataset.editIndex);

    if (isEdit) {
      usuarios[editIndex] = { 
        id: usuarios[editIndex].id, 
        identificacion, 
        nombre, 
        email, 
        telefono, 
        cargo, 
        password 
      };
    } else {
      const newId = Math.max(...usuarios.map(u => u.id), 0) + 1;
      usuarios.push({ 
        id: newId, 
        identificacion, 
        nombre, 
        email, 
        telefono, 
        cargo, 
        password 
      });
    }

    guardarUsuarios();
    renderizarTabla();
    limpiarFormulario();
    alert(isEdit ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
  });

  clearButton.addEventListener('click', limpiarFormulario);

  cargarUsuarios();
});
