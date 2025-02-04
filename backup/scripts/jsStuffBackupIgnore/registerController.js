export const validatePasswordClient = (password) => {
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

export const validateEmailClient = (email) => {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
};

export const validateUsernameClient = (username) => {
  if (username.length < 8) {
    return "Username must be at least 8 characters long.";
  }
  return null;
};

export const handleCheckError = (response, data, usernameError, emailError) => {
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

export async function checkUsernameAvailability(username, email) {
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

export async function handleRegistrationSubmit(form, elements) {
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
    registrationMessage
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
export let registerForm;
export let nameInput;
export let usernameInput;
export let emailInput;
export let passwordInput;
export let confirmPasswordInput;
export let nameError;
export let usernameError;
export let emailError;
export let passwordError;
export let confirmPasswordError;
export let registrationMessage;
export function setConstants(constants) {
    registerForm = constants.registerForm;
    nameInput = constants.nameInput;
    usernameInput = constants.usernameInput;
    emailInput = constants.emailInput;
    passwordInput = constants.passwordInput;
    confirmPasswordInput = constants.confirmPasswordInput;
    nameError = constants.nameError;
    usernameError = constants.usernameError;
    emailError = constants.emailError;
    passwordError = constants.passwordError;
    confirmPasswordError = constants.confirmPasswordError;
    registrationMessage = constants.registrationMessage;
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
  function enableLoginButton(button) {
    button.disabled = false;
    button.style.cursor = "pointer";
  }
  let loginButton;
  export function setLoginButton(button){
    loginButton = button;
  }