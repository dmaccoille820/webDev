document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginAttempts = document.getElementById('loginAttempts');
    const loginError = document.getElementById('loginError');
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');
   
    let loginAttemptCount = 0;

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    window.location.href = '/dashboard';
                } else {
                    const errorData = await response.json();
                    loginAttemptCount++;
                    loginAttempts.textContent = `Login attempts: ${loginAttemptCount}`;
                    registerButton.style.display = 'block';
                    loginError.textContent = errorData.message || 'Invalid username or password.';

                    if (loginAttemptCount >= 3) {
                        loginButton.disabled = true;
                        loginButton.classList.add('disabled');
                        loginAttempts.textContent = 'Login disabled for 3 seconds.';

                        setTimeout(() => {
                            loginButton.disabled = false;
                            loginButton.classList.remove('disabled');
                            document.getElementById('loginUsername').value = '';
                            document.getElementById('loginPassword').value = '';
                            loginAttempts.textContent = '';
                            loginAttemptCount = 0;
                        }, 3000);
                    }
                }
            } catch (error) {
                console.error('Error during login:', error);
                loginError.textContent = 'An error occurred during login.';
            }
        });
    }
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            window.location.href = '/register';
        });
    }
});
