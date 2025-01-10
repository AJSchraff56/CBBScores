document.addEventListener('DOMContentLoaded', () => {
    const userTableBody = document.getElementById('userTableBody');
    const addUserForm = document.getElementById('addUserForm');
    const logoutButton = document.getElementById('logoutButton');

    // Fetch users and populate the table
    async function fetchUsers() {
        try {
            const response = await fetch('/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json();
            populateUserTable(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Populate the user table
    function populateUserTable(users) {
        userTableBody.innerHTML = ''; // Clear the table
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                    <button class="remove-user-button" data-username="${user.username}">Remove</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-user-button');
        removeButtons.forEach(button => {
            button.addEventListener('click', handleRemoveUser);
        });
    }

    // Handle removing a user
    async function handleRemoveUser(event) {
        const username = event.target.dataset.username;
        try {
            const response = await fetch(`/users/${username}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to remove user');
            fetchUsers(); // Refresh the table
        } catch (error) {
            console.error('Error removing user:', error);
        }
    }

    // Handle adding a new user
    addUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;

        try {
            const response = await fetch('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) throw new Error('Failed to add user');
            fetchUsers(); // Refresh the table
        } catch (error) {
            console.error('Error adding user:', error);
        }
    });

    // Handle logout
    logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', { method: 'POST' });
            if (response.ok) {
                window.location.href = '/';
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });

    // Initial fetch of users
    fetchUsers();
});
