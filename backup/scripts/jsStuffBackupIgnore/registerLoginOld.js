const redirectUrl = "/tasks";
let loginAttemptCount = 0;
let lockoutTimeout = null;
let timeoutId = null; // Initialize timeoutId to null
const loginAttempts = document.getElementById("loginAttempts");
const loginButton = document.getElementById("btn1");
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
const registrationMessage = document.getElementById("registrationSuccessMessage");

// Validation Functions
const validatePasswordClient = (password) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character (!@#$%^&*).";
  }
  return null;
};

const validateEmailClient = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateUsernameClient = (username) => {
  if (username.length < 8) {
    return "Username must be at least 8 characters long.";
  }
  return null;
};

// Error Handling
const handleCheckError = (response, data, usernameError, emailError) => {
  if (response.status === 409 && data.message) {
    if (data.code === "USERNAME_TAKEN") {
      displayError(usernameError, data.message);
    } else if (data.code === "EMAIL_TAKEN") {
      displayError(emailError, data.message);
    }
    console.log("checkUsernameAvailability - Returning false due to taken username or email.");
  } else {
    displayError(
      usernameError,
      "An error occurred during the check. Please try again."
    );
    console.log("checkUsernameAvailability - Returning false due to error during check.");
  }
};
//checkUsernameAvailability
async function checkUsernameAvailability(username, email) {
  console.log("checkUsernameAvailability - Starting check for:", username, email);
  const requestBody = JSON.stringify({ username, email });
  console.log("checkUsernameAvailability - Sending request to /check-username with body:", requestBody);

  const response = await fetch("/api/check-username", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: requestBody,
  });
  console.log("checkUsernameAvailability - Raw response received:", response);
  
  const data = await response.json();
  console.log("checkUsernameAvailability - Parsed data:", data);

  if (!response.ok) {
    handleCheckError(response, data, usernameError, emailError);
    return false;
  }
  console.log("checkUsernameAvailability - Username/email availability:", data.available);
  return data.available;
}

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  if (registerForm) {
    // Clear errors on focus for fields
    nameInput.addEventListener("focus", () => clearError(nameError));
    usernameInput.addEventListener("focus", () => clearError(usernameError));
    emailInput.addEventListener("focus", () => clearError(emailError));
    passwordInput.addEventListener("focus", () => clearError(passwordError));
    confirmPasswordInput.addEventListener("focus", () =>
      clearError(confirmPasswordError)
    );

    // Handle the registration submission
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      handleRegistrationSubmit(registerForm, {
        nameInput,
        usernameInput,
        emailInput,
        passwordInput,
        confirmPasswordInput,
        nameError,
        usernameError,
        emailError,
        passwordError,
        confirmPasswordError,
      });
    });
  }
});

// handleRegistrationSubmit
async function handleRegistrationSubmit(form, elements) {
  console.log("handleRegistrationSubmit - entered");
  console.log("registration attempted awaiting checkUsernameAvailability");

  const {
    nameInput,
    usernameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput,
    nameError,
    usernameError,
    emailError,
    passwordError,
    confirmPasswordError,
  } = elements;
  
  console.log("handleRegistrationSubmit - form elements values",
  {
      name: nameInput.value,
      username: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      confirmPassword: confirmPasswordInput.value
    }
  )

  const passwordErrorText = validatePasswordClient(passwordInput.value);
  const usernameErrorText = validateUsernameClient(usernameInput.value);
  const emailErrorText = !validateEmailClient(emailInput.value) ? "Email is not valid." : null;
  console.log("handleRegistrationSubmit - error strings",
  {
      passwordError: passwordErrorText,
      usernameError: usernameErrorText,
      emailError: emailErrorText,
    }
  );

  // Early exit if there are any errors
  if (usernameErrorText) {
    displayError(usernameError, usernameErrorText);
    return;
  }
  if (emailErrorText) {
    displayError(emailError, emailErrorText);
    return;
  }
  if (passwordErrorText) {
    displayError(passwordError, passwordErrorText);
    return;
  }
  if (passwordInput.value !== confirmPasswordInput.value) {
    displayError(confirmPasswordError, "Passwords do not match.");
    return;
  }

  // Check username/email availability
  const availability = await checkUsernameAvailability(
    usernameInput.value,
    emailInput.value
  );
  console.log("handleRegistrationSubmit - availability value:", availability);
  if (!availability) {
    return;
  }

  console.log("handleRegistrationSubmit - about to call /api/register");
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput.value,
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.errors) {
        if (errorData.errors.email) {
          displayError(emailError, errorData.errors.email);
        } else if (errorData.errors.confirmPassword) {
          displayError(confirmPasswordError, errorData.errors.confirmPassword);
        } else {
          displayError(usernameError, "An error occured during registration.");
        }
      }
      return;
    }

    // Registration Success
    displayConfirmation(
      registrationMessage,
      "Registration successful. You will be redirected to login in 3 seconds"
    );
    nameInput.value = "";
    usernameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
    clearError(nameError);
    clearError(usernameError);
    clearError(emailError);
    clearError(passwordError);
    clearError(confirmPasswordError);

    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
    
  } catch (error) {
    console.error("Registration error:", error);
    displayError(
      usernameError,
      "An error occured during registration. Username or email taken"
    );
  }
}

const loginForm = document.getElementById("loginForm");
const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword");
const loginNameError = document.getElementById("loginNameError");
const loginPasswordError = document.getElementById("loginPasswordError");

// Clear errors on focus for login fields
loginUsernameInput.addEventListener("focus", () => clearError(loginNameError));
loginPasswordInput.addEventListener("focus", () => clearError(loginNameError));
loginUsernameInput.addEventListener("focus", () => clearError(loginAttempts));
loginPasswordInput.addEventListener("focus", () => clearError(loginAttempts));

// Handle the login submission
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleLoginSubmit(loginForm, {
    username: loginUsernameInput,
    password: loginPasswordInput,
    loginNameError,
  });
});

async function handleLoginSubmit(form, elements) {
  const { username, password, loginNameError } = elements;
  const lockoutLimit = 3;

  if (lockoutTimeout && new Date() < lockoutTimeout) {
    const timeLeft = Math.ceil((lockoutTimeout - new Date()) / 1000);
    displayError(
      loginNameError,
      `Too many login attempts. Please try again in ${timeLeft} seconds.`,
      loginButton
    );
    return;
  }
  try {
    const trimmedUsername = username.value.trim();
    const trimmedPassword = password.value.trim();
    console.log("Username:", trimmedUsername, "Password:", trimmedPassword);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernameOrEmail: trimmedUsername,
        password: trimmedPassword,
      }),
    });
    if (response.ok) {
      console.log("login success");
      const data = await response.json();
      loginAttemptCount = 0;
      timeoutId = null; // Reset timeoutId
      clearTimeout(timeoutId);
      enableLoginButton(loginButton);
      window.location.href = "/tasks";
    } else {
      loginAttemptCount++;

      if (loginAttemptCount >= lockoutLimit) {
        const lockoutDuration = 4; // 4 seconds
        lockoutTimeout = new Date(new Date().getTime() + lockoutDuration * 1000);
        let countDown = lockoutDuration;
        displayError(
          loginNameError,
          `Too many login attempts. Please try again in ${countDown} seconds.`
        );
        loginButton.style.cursor = "not-allowed";
        disableLoginButton(loginButton);
        timeoutId = setInterval(() => {
          countDown--;
          if (countDown >= 0) {
            displayError(
              loginNameError,
              `Too many login attempts. Please try again in ${countDown} seconds.`
            );
          }
        }, 1000);
        setTimeout(() => {
          loginAttemptCount = 0;
          lockoutTimeout = null;
          loginButton.style.cursor = "pointer";
          enableLoginButton(loginButton);
          clearError(loginNameError);
        }, lockoutDuration * 1000);
      } else {
        if (!response.ok) {
          const errorData = await response.json();
          displayError(
            loginNameError,
            errorData.message || "Invalid username/email or password."
          );
        }
      }
    }
  } catch (error) {
    console.error("Error during login:", error);
    displayError(loginNameError, "An error occurred during login.");
  }
}

function handleCheckResult(result, usernameError, emailError) {
  if (result === 0) {
    displayError(usernameError, "Username or email already in use");
  } else {
    console.log("Database clear for entry");
  }
}

function displayError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.style.display = "block";
  errorElement.parentElement.classList.add("inputError");
}

function displayConfirmation(confirmationElement, message) {
  confirmationElement.textContent = message;
  confirmationElement.style.display = "block";
  confirmationElement.classList.add("success");
}

function clearError(errorElement) {
  errorElement.textContent = "";
  errorElement.style.display = "none";
  errorElement.parentElement.classList.remove("error");
  if (loginButton) {
    enableLoginButton(loginButton);
  }
}

function disableLoginButton(button) {
  button.disabled = true;
  button.style.cursor = "not-allowed";
}
function enableLoginButton(button) {
  button.disabled = false;
  button.style.cursor = "pointer";
}
const checkbox = document.getElementById("check");
const loginPage = document.querySelector(".page.login-page");
const registerPage = document.querySelector(".page.register-page");
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
