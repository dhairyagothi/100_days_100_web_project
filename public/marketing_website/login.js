(function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Show / hide password
    const toggleBtn = document.getElementById('togglePw');
    const pwInput = document.getElementById('password');
    if (toggleBtn && pwInput) {
        toggleBtn.addEventListener('click', function () {
            const isHidden = pwInput.type === 'password';
            pwInput.type = isHidden ? 'text' : 'password';
            toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
        });
    }

    // Validation helpers
    function showError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (message) {
            input.classList.add('is-invalid');
            error.textContent = message;
        } else {
            input.classList.remove('is-invalid');
            error.textContent = '';
        }
        return !message;
    }

    function validateEmail() {
        const val = document.getElementById('email').value.trim();
        if (!val) return showError('email', 'emailError', 'Email is required.');
        if (!emailRegex.test(val)) return showError('email', 'emailError', 'Enter a valid email address.');
        return showError('email', 'emailError', '');
    }

    function validatePassword() {
        const val = document.getElementById('password').value;
        if (!val) return showError('password', 'passwordError', 'Password is required.');
        if (val.length < 6) return showError('password', 'passwordError', 'Minimum 6 characters.');
        return showError('password', 'passwordError', '');
    }

    // Blur validation
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('password').addEventListener('blur', validatePassword);

    // Submit
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        document.getElementById('successMsg').style.display = 'none';

        const emailOk = validateEmail();
        const passwordOk = validatePassword();

        if (!emailOk || !passwordOk) return;

        // Demo success — replace with real fetch() to your backend
        document.getElementById('successMsg').style.display = 'block';
        this.reset();
        pwInput.type = 'password';
        toggleBtn.textContent = 'Show';
    });
})();
