document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission behavior

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.isAdmin) {
                        window.location.href = '/admin.html';
                    } else {
                        const selectedGender = document.querySelector('input[name="gender"]:checked').value;
                        if (selectedGender === 'male') {
                            window.location.href = '/mscores.html';
                        } else if (selectedGender === 'female') {
                            window.location.href = '/wscores.html';
                        }
                    }
                } else {
                    loginError.textContent = 'Invalid username or password.';
                }
            } catch (error) {
                console.error('Login error:', error);
                loginError.textContent = 'An error occurred during login. Please try again.';
            }
        });
    }
});
