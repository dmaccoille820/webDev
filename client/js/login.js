//import { displayError, clearError, enableButton, disableButton } from "./utils.js";

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




function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function enableLoginButton(button) {
  button.disabled = false;
  button.style.cursor = "pointer";
}


async function handleLoginSubmit(event) {
  event.preventDefault();

  const loginForm = document.getElementById('loginForm');
  const loginUsernameInput = document.getElementById('loginUsername');
  const loginPasswordInput = document.getElementById('loginPassword');
  const loginNameError = document.getElementById("loginNameError");
  const loginButton = document.getElementById("btn1");
let lockoutLimit = 5;
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
    console.log("TrimmedUsername:", trimmedUsername, "TrimmedPassword:", trimmedPassword);

    const response = await fetch("/api/auth/login", {
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
      console.log("data from login.js", data);
      const username = data.username;
      console.log("username: ",username)
      const userId = data.user_id;
      console.log("userId from login.js", userId);
      sessionStorage.setItem("userId", userId);
      
      loginAttemptCount = 0;
      timeoutId = null; // Reset timeoutId
      clearTimeout(timeoutId);
      enableLoginButton(loginButton);
      console.log("Redirecting to /dashboard");
      
     window.location.href = "/dashboard.html";
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
        disableButton(loginButton);
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



const loginButton = document.getElementById("btn1"); // Assuming login button exists
const loginForm = document.getElementById("loginForm");
const username = document.getElementById("loginUsername");
const password = document.getElementById("loginPassword");
const loginNameError = document.getElementById("loginNameError");
const loginPasswordError = document.getElementById("loginPasswordError");
const API_URL = "/api/auth/login";
let loginAttemptCount = 0;
let lockoutTimeout = null;
let timeoutId = null; 


if (!loginForm) {
  console.error("Login form not found.");
} else {
  loginForm.addEventListener("submit", handleLoginSubmit);
}

