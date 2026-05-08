document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('employee-login-form');
    const toastElement = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    const showToast = (message, isError = false) => {
        toastMsg.textContent = message;
        toastElement.classList.remove('hidden');
        
        const icon = toastElement.querySelector('.material-symbols-outlined');
        if (isError) {
            icon.textContent = 'error';
            icon.classList.replace('text-emerald-400', 'text-rose-400'); // Enterprise colors
        } else {
            icon.textContent = 'check_circle';
            icon.classList.replace('text-rose-400', 'text-emerald-400');
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
            // Hit the Agent-specific login endpoint via the Gateway
            const response = await fetch('http://localhost:8080/api/agents/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                // Ensure the user actually has an agent role
                if (data.role === 'GUEST' || data.role === 'HOST') {
                    showToast('Unauthorized: This portal is strictly for internal staff.', true);
                    return;
                }

                // Save JWT and user data to localStorage
                localStorage.setItem('NEXTSTAY_JWT', data.accessToken);
                localStorage.setItem('NEXTSTAY_USER_ID', data.userId);
                localStorage.setItem('NEXTSTAY_ROLE', data.role);

                showToast('Authentication successful. Initializing secure workspace...', false);

                // Redirect to the internal operations dashboard
                setTimeout(() => {
                    window.location.href = '/admin-dashboard.html'; 
                }, 1500);

            } else {
                // This will also catch the "Agent account is deactivated" exception from AgentService
                showToast(data.message || 'Invalid corporate credentials or deactivated account.', true);
            }
        } catch (error) {
            console.error('Agent Login Error:', error);
            showToast('System offline. Please contact IT Support.', true);
        }
    });
});