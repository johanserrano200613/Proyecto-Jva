const email = document.getElementById('email');
const password = document.getElementById('password');
if(!email || !password) {
  console.error('No se encontraron los elementos de entrada de correo electrónico o contraseña.');
}
else {email.addEventListener('input', validateEmail);
password.addEventListener('input', validatePassword);}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
if(!emailpattern || !passwordPattern) {
  console.error('No se pudieron definir los patrones de validación para correo electrónico o contraseña.');
}
else(emailPattern.test(email.value) ? email.classList.remove('invalid') : email.classList.add('invalid'));
if(!passwordPattern) {
  console.error('No se pudo definir el patrón de validación para la contraseña.');
}
else(passwordPattern.test(password.value) ? password.classList.remove('invalid') : password.classList.add('invalid'));
function validateEmail() {
  if(!emailPattern) {
    console.error('No se pudo definir el patrón de validación para el correo electrónico.');
    return;
  }
    if (emailPattern.test(email.value)) {
        email.classList.remove('invalid');
    } else {
        email.classList.add('invalid');
    }
}
function validatePassword() {
  if(!passwordPattern) {
    console.error('No se pudo definir el patrón de validación para la contraseña.');
    return;
  }
  if (passwordPattern.test(password.value)) {
    password.classList.remove('invalid');
  } else {
    password.classList.add('invalid');
  }
}
const loginButton = document.querySelector('.primary-button');
if(!loginButton) {
  console.error('No se encontró el botón de inicio de sesión.');
}
else {loginButton.addEventListener('click', function(event) {
  event.preventDefault();
    if (emailPattern.test(email.value) && passwordPattern.test(password.value)) {
        window.location.href = 'usuarios.html';
    } else {
        alert('Por favor, ingrese un correo electrónico y una contraseña válidos.');
    }
});}
const form = document.querySelector('form');
if(!form) {
  console.error('No se encontró el formulario de inicio de sesión.');
}
else {form.addEventListener('submit', function(event) {
  event.preventDefault();
    if (emailPattern.test(email.value) && passwordPattern.test(password.value)) {
        window.location.href = 'usuarios.html';
    } else {
        alert('Por favor, ingrese un correo electrónico y una contraseña válidos.');
    }
});}