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
                        // Redirect admin to admin.html
                        window.location.href = '/admin.html';
                    } else {
                        // Redirect regular user to scores.html
                        window.location.href = '/scores.html';
                    }
                } else {
                    // Display error message for invalid credentials
                    loginError.textContent = 'Invalid username or password';
                }
            } catch (error) {
                console.error('Login error:', error);
                loginError.textContent = 'An error occurred during login. Please try again.';
            }
        });
    }
});
document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const selectedGender = document.querySelector('input[name="gender"]:checked').value;

    if (!username || !password) {
        alert('Please enter your credentials.');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            if (selectedGender === 'men') {
                window.location.href = 'mscores.html';
            } else if (selectedGender === 'women') {
                window.location.href = 'wscores.html';
            }
        } else {
            alert('Invalid username or password.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});
