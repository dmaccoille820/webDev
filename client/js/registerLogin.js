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
          
          registrationSuccessMessage.innerText="Registration successful. Redirecting in 3";
          

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
});

////////////////////////
//// Register Logic ////
////////////////////////


document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginUsernameInput = document.getElementById("loginUsername");
  const loginPasswordInput = document.getElementById("loginPassword");
  const loginNameError = document.getElementById("loginNameError");
  const loginPasswordError = document.getElementById("loginPasswordError");
  const loginAttempts = document.getElementById("loginAttempts");
  const loginButton = document.getElementById("btn1"); 

  enableLoginButton(loginButton);

  // Clear errors on focus for login fields
  loginUsernameInput.addEventListener("focus", () => clearError(loginNameError));
  loginPasswordInput.addEventListener("focus", () => clearError(loginNameError));
  loginUsernameInput.addEventListener("focus", () => clearError(loginPasswordError));
  loginPasswordInput.addEventListener("focus", () => clearError(loginPasswordError));
  loginUsernameInput.addEventListener("focus", () => clearError(loginAttempts));
  loginPasswordInput.addEventListener("focus", () => clearError(loginAttempts));

  // Handle the login submission
  loginForm.addEventListener("submit", handleLoginSubmit);
});

let loginAttemptCount = 0;
let lockoutTimeout = null;
let timeoutId = null;
const lockoutLimit = 3; // Define your lockout limit here

async function handleLoginSubmit(event) {
  event.preventDefault();

  const loginForm = document.getElementById('loginForm');
  const loginUsernameInput = document.getElementById('loginUsername');
  const loginPasswordInput = document.getElementById('loginPassword');
  const loginNameError = document.getElementById("loginNameError");
  const loginButton = document.getElementById("btn1");

  if (!loginForm) {
      console.error("Login form not found.");
      return;
  }

  if (lockoutTimeout && new Date() < lockoutTimeout) {
    const timeLeft = Math.ceil((lockoutTimeout - new Date()) / 1000);
    displayError(
      loginNameError,
      `Too many login attempts. Please try again in ${timeLeft} seconds.`
    );
    return;
  }

  try {
    const trimmedUsername = loginUsernameInput.value.trim();
    const trimmedPassword = loginPasswordInput.value.trim();
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
      console.log("Login success");
      const data = await response.json();
      loginAttemptCount = 0;
      timeoutId = null; // Reset timeoutId
      clearTimeout(timeoutId);
      enableLoginButton(loginButton);
      console.log("Redirecting to /tasks");
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
          enableLoginButton(loginButton);
          clearError(loginNameError);
        }, lockoutDuration * 1000);
      } else {
        const errorData = await response.json();
        displayError(
          loginNameError,
          errorData.message || "Invalid username/email or password."
        );
      }
    }
  } catch (error) {
    console.error("Error during login:", error);
    displayError(loginNameError, "An error occurred during login.");
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
