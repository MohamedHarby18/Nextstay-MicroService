document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('host-register-form');
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

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim(); // Captured, but not sent yet!
        const password = document.getElementById('password').value;

        if (password.length < 8) {
            showToast('Password must be at least 8 characters', true);
            return;
        }

        // Payload matches RegisterRequest.java exactly
        const payload = {
            name: name,
            email: email,
            password: password,
            role: 'HOST' // Hardcoded for this specific page
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showToast('Host account created! Pending admin verification.', false);
                
                setTimeout(() => {
                    window.location.href = 'host-login.html';
                }, 2500);
            } else if (response.status === 409) {
                showToast('This email is already registered.', true);
            } else {
                const errorData = await response.json();
                showToast(errorData.message || 'Registration failed.', true);
            }
        } catch (error) {
            console.error('Registration Error:', error);
            showToast('Network error. Ensure the backend is running.', true);
        }
    });
});