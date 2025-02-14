////////////////////////////
//// General functions ////
///////////////////////////
window.clearInput = function(inputElement) {
  inputElement.value = "";
};
window.enableButton = function(button) {
    button.disabled = false;
    button.style.cursor = "pointer";
  };
  window.clearError = function(errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
    errorElement.parentElement.classList.remove("error");
  };
  
window.displayError = function(message, duration = 3000) {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '10px';
  errorDiv.style.left = '50%';
  errorDiv.style.transform = 'translateX(-50%)';
  errorDiv.style.backgroundColor = 'red';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '10px 20px';
  errorDiv.style.borderRadius = '5px';
  errorDiv.style.zIndex = '1000';
  document.body.appendChild(errorDiv);

  setTimeout(() => {
      document.body.removeChild(errorDiv);
  }, duration);
};

//import { displayError, clearError, clearInput, logToServer, disableButton, enableButton } from "./utils.js";

const registerButton = document.getElementById("btn2"); 


  
  /////////////////////////
  //// Check box logic ////
  /////////////////////////
  
  const loginPage = document.querySelector(".page.login-page");
  const registerPage = document.querySelector(".page.register-page");
  
  const checkbox = document.getElementById("check");
  if (checkbox.checked) {
    loginPage.style.display = "none";
    registerPage.style.display = "block";
  } else {
    loginPage.style.display = "block";
    registerPage.style.display = "none";
  }
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      loginPage.style.display = "none";
      registerPage.style.display = "block";
    } else {
      loginPage.style.display = "block";
      registerPage.style.display = "none";
    }
  });
  
  ////////////////////////
  //// Register Logic ////
  ////////////////////////
  
  document.addEventListener("DOMContentLoaded", function () {
  
    const registerForm = document.getElementById("registerForm");
    const nameInput = document.getElementById("registerName");
    const usernameInput = document.getElementById("registerUsername");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const confirmPasswordInput = document.getElementById("registerConfirmPassword");
    const nameError = document.getElementById("nameError");
    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const registrationSuccessMessage = document.getElementById("registrationSuccessMessage");
    if (registerForm) {
        // Clear errors on focus for fields
        nameInput.addEventListener("focus", () => clearError(nameError));
        usernameInput.addEventListener("focus", () => clearError(usernameError));
        emailInput.addEventListener("focus", () => clearError(emailError));
        passwordInput.addEventListener("focus", () => clearError(passwordError));
  
        confirmPasswordInput.addEventListener("focus", () => clearError(confirmPasswordError));
        registerForm.addEventListener('submit', handleRegistrationSubmit);
        if (document.getElementById("btn1")) {
            enableButton(document.getElementById("btn1"));
          }
         
    }
  
    // Check username and email availability
    async function checkUsernameAvailability(username, email) {
        const requestBody = JSON.stringify({ username, email });
        console.log("checkUsernameAvailability - Sending request to /check-username with body:", requestBody);
      const response = await fetch("/api/check-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: requestBody,
        });
        const data = await response.json();
        console.log("checkUsernameAvailability - response:", response);
  
        if (!response.ok) {
            const message = data.message || "An error occurred during the check. Please try again.";
            if (response.status === 409) {
                if (data.code === "USERNAME_TAKEN") {
                    displayError(usernameError, data.message);
                } else if (data.code === "EMAIL_TAKEN") {
                    displayError(emailError, data.message);
                }
            } else {
                displayError(usernameError, message);
            }
            return { error: message };
        }
        return null;
    }
  
    // Handle the registration submission
    async function handleRegistrationSubmit(event) {
        event.preventDefault();
  
        const name = nameInput.value;
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
  
        const availabilityError = await checkUsernameAvailability(username, email);
        if (availabilityError) return availabilityError;
  
        console.log("handleRegistrationSubmit - about to call /api/register");
  
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, username, email, password, confirmPassword }),
            });
            const errorData = await response.json();
  
            if (!response.ok) {
                const error = errorData.errors?.email || errorData.errors?.confirmPassword || "An error occurred during registration.";
                displayError(response.status === 409 ? emailError : usernameError, error);
                return { error };
            }
  
            // Registration Success
            
            registrationSuccessMessage.innerText = "Registration successful. Redirecting in 3";
            registrationSuccessMessage.style.color = "green";
            
  
            clearInput(passwordInput);
            clearInput(confirmPasswordInput);
            clearInput(usernameInput);
            clearInput(emailInput);
            clearInput(nameInput);
  
            clearError(nameError);
            clearError(usernameError);
            clearError(emailError);
            clearError(passwordError);
            clearError(confirmPasswordError);
            disableButton(registerButton);
            registrationSuccessMessage.style.display = "block";
          
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } catch (error) {
            console.error("Registration error:", error);
          
            displayError(
  
                usernameError,
                "An error occurred during registration. Username or email taken"
            );
        }
    }
    if (!registerForm) {
        console.error("Register form not found.");
    } else {
        registerForm.addEventListener("submit", handleRegistrationSubmit);
    }
  });
  