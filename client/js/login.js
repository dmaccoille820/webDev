const loginButton = document.getElementById("btn1"); //Assuming login button exists
let loginAttemptCount = 0;
let lockoutTimeout = null;
let timeoutId = null; // Initialize timeoutId to null

function displayError(element, message, button = null) {
  element.textContent = message;
  if (button){
    disableLoginButton(button)
  }
}

function clearError(element) {
  element.textContent = "";
}

function disableLoginButton(button) {
  button.disabled = true;
}
function enableLoginButton(button) {
  button.disabled = false;
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) {
      console.error("Login form not found.");
      return;
    }
  const username = document.getElementById('email');
  const password = document.getElementById('password');
  const loginNameError = document.getElementById("loginNameError"); //Assuming there is a error label
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

