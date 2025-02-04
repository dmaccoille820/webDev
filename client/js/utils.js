function displayConfirmation(confirmationElement, message) {
  confirmationElement.textContent = message;
  confirmationElement.style.display = "block";
  confirmationElement.classList.add("success");
}
function clearError(errorElement) {
  errorElement.textContent = "";
  errorElement.style.display = "none";
  errorElement.parentElement.classList.remove("error");
  if (document.getElementById("btn1")) {
    enableLoginButton(document.getElementById("btn1"));
  }
}
function clearInput(inputElement) {
  inputElement.value = "";
}
function displayError(errorElement, message, button) {
  errorElement.textContent = message;
  errorElement.style.display = "block";
  errorElement.parentElement.classList.add("inputError");
  if (button) {
    disableLoginButton(button);
  }
}
function enableLoginButton(button) {
  button.disabled = false;
  button.style.cursor = "pointer";
}
function validateEmailClient(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}
function validatePasswordClient(password){
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

  
function validateUsernameClient(username) {
  if (username.length < 8 || containsSpecialCharacters(username)) {
    return "Username must be at least 8 characters long and cannot contain special characters.";
  }
  return null;
};
