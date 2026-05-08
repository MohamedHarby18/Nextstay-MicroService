document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('host-login-form');
    const toastElement = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

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

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const payload = {
            email: email,
            password: password
        };

        try {
            // Hit the API Gateway which routes to Identity Service
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                // Verify this user is actually a Host or Admin (not a regular Guest)
                if (data.role === 'GUEST') {
                    showToast('Access denied: This portal is for Hosts only.', true);
                    return;
                }

                // Save JWT and user data to localStorage
                localStorage.setItem('NEXTSTAY_JWT', data.accessToken);
                localStorage.setItem('NEXTSTAY_USER_ID', data.userId);
                localStorage.setItem('NEXTSTAY_ROLE', data.role);

                showToast('Welcome to the Host Portal! Redirecting...', false);

                // Redirect to the Host Dashboard
                setTimeout(() => {
                    window.location.href = '/host-dashboard.html'; 
                }, 1500);

            } else {
                showToast(data.message || 'Invalid email or password.', true);
            }
        } catch (error) {
            console.error('Login Error:', error);
            showToast('Network error. Ensure the backend is running.', true);
        }
    });
});