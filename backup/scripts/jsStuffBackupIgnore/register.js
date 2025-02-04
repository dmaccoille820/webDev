document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const nameInput = document.getElementById('registerName');
    const usernameInput = document.getElementById('registerUsername');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    const nameError = document.getElementById('nameError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let valid = true;

        // Clear previous error messages
        clearError(nameError);
        clearError(passwordError);
        clearError(confirmPasswordError);

        // Validate name
        validateField(nameInput, nameError, 'Name must not be empty.');

        // Validate username
        validateField(usernameInput, document.getElementById('usernameError'), 'Username must be at least 8 characters long.', 8);
        // Validate email
        validateField(emailInput, document.getElementById('emailError'), 'Please enter a valid email address.', null, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);

        // Validate password strength
        const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        validateField(passwordInput, passwordError, 'Password must contain at least one number, one uppercase letter, and one special character (!@#$%^&*).', null, passwordPattern);

        // Validate password match
        if (passwordInput.value !== confirmPasswordInput.value) {          
            displayError(confirmPasswordError, 'Passwords do not match.');
            valid = false;          
        } else {
            clearError(confirmPasswordError);
        }

        // Submit the form if all validations pass
        if (valid) {
            registrationForm.submit();
        }
    });

    function validateField(inputField, errorElement, errorMessage, minLength = null, pattern = null) {
        let isValid = true;
    
        if (minLength && inputField.value.length < minLength) {
            isValid = false;
        } else if (pattern && !pattern.test(inputField.value)) {
            isValid = false;
        } else if (inputField.value.trim() === '') {
            isValid = false;
        }
    
        if (!isValid) {
            displayError(errorElement, errorMessage);
        } else {
            clearError(errorElement);
        }
    }    

    function displayError(errorElement, message) {
        errorElement.textContent = message;
    }
    
    function clearError(errorElement) {
        errorElement.textContent = '';
    }
});

