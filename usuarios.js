const usuarios = [
  {
    id: 1,
    nombre: "John Doe",
    email: "john.doe@acme.edu",
    rol: "estudiante"
  },
  {
    id: 2,
    nombre: "Jane Smith",
    email: "jane.smith@acme.edu",
    rol: "profesor"
  }
];
const usuariosContainer = document.getElementById('usuarios-container');
if(!usuariosContainer) {
  console.error('No se encontró el contenedor de usuarios.');
} else {
  usuarios.forEach(function(usuario) {
    const usuarioElement = document.createElement('div');
    usuarioElement.innerHTML = `
      <h3>${usuario.nombre}</h3>
      <p>Email: ${usuario.email}</p>
      <p>Rol: ${usuario.rol}</p>
    `;
    usuariosContainer.appendChild(usuarioElement);
  });
}
const logoutButton = document.getElementById('logout-button');
if(!logoutButton) {
  console.error('No se encontró el botón de cerrar sesión.');
} else {logoutButton.addEventListener('click', function() {
    window.location.href = 'login.html';
  });}
  