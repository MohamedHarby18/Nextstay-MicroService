document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('guest-login-form');
    const toastElement = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    // Reusable toast function
    const showToast = (message, isError = false) => {
        toastMsg.textContent = message;
        toastElement.classList.remove('hidden');
        
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

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Grab the credentials from the UI
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const payload = {
            email: email,
            password: password
        };

        try {
            // 2. Hit the API Gateway routing to the Identity Service
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                // 3. The Magic: Save the JWT and user data to localStorage
                localStorage.setItem('NEXTSTAY_JWT', data.accessToken);
                localStorage.setItem('NEXTSTAY_USER_ID', data.userId);
                localStorage.setItem('NEXTSTAY_ROLE', data.role);

                showToast('Welcome back! Logging you in...', false);

                // 4. Redirect to the main application (e.g., search or dashboard)
                setTimeout(() => {
                    // Update this URL to wherever your main NextStay app lives
                    window.location.href = '/dashboard.html'; 
                }, 1500);

            } else {
                // 401 Unauthorized or other errors
                showToast(data.message || 'Invalid email or password.', true);
            }
        } catch (error) {
            console.error('Login Error:', error);
            showToast('Network error. Ensure the backend is running.', true);
        }
    });
});