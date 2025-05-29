document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (email === 'flavia@stackspot.com' && senha === '123') {
        window.location.href = 'index.html';
    } else {
        document.getElementById('loginError').textContent = 'E-mail e/ou senha inválidos.';
    }
});