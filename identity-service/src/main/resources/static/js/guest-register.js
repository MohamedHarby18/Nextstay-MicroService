document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('guest-register-form');
    const toastElement = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    // Function to show toast notifications
    const showToast = (message, isError = false) => {
        toastMsg.textContent = message;
        toastElement.classList.remove('hidden');
        
        // Change color based on success/error
        const icon = toastElement.querySelector('.material-symbols-outlined');
        if (isError) {
            icon.textContent = 'error';
            icon.classList.replace('text-green-400', 'text-red-400');
        } else {
            icon.textContent = 'check_circle';
            icon.classList.replace('text-red-400', 'text-green-400');
        }

        setTimeout(() => toastElement.classList.add('hidden'), 4000);
    };

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent page reload

        // Gather form data
        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Basic frontend validation
        if (password.length < 8) {
            showToast('Password must be at least 8 characters', true);
            return;
        }

        // Prepare the payload mapping exactly to RegisterRequest.java
        const payload = {
            name: name,
            email: email,
            password: password,
            role: 'GUEST'
        };

        try {
            // Note: We use port 8080 because the API Gateway handles the routing
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // HTTP 201 Created
                showToast('Registration successful! Redirecting to login...', false);
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'guest-login.html';
                }, 2000);
            } else if (response.status === 409) {
                // ConflictException from AuthService.java
                showToast('This email is already registered.', true);
            } else {
                // Handle generic bad requests
                const errorData = await response.json();
                showToast(errorData.message || 'Registration failed. Please try again.', true);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            showToast('Network error. Is the backend running?', true);
        }
    });
});