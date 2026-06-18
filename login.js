document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginButton = document.querySelector('.primary-button');
  const form = document.querySelector('.login-panel');

  loginButton.addEventListener('click', function(e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (!email.includes('@')) {
      alert('Por favor ingresa un email válido');
      return;
    }

    if (email === 'admin@acme.edu' && password === 'Admin123') {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'usuarios.html';
    } else {
      alert('Email o contraseña incorrectos');
      passwordInput.value = '';
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
  });

  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      loginButton.click();
    }
  });
});
