window.displayConfirmation = function(confirmationElement, message) {
  confirmationElement.textContent = message;
  confirmationElement.style.display = "block";
  confirmationElement.classList.add("success");
};
window.clearError = function(errorElement) {
  errorElement.textContent = "";
  errorElement.style.display = "none";
  errorElement.parentElement.classList.remove("error");
};
window.clearInput = function(inputElement) {
  inputElement.value = "";
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
window.enableButton = function(button) {
  button.disabled = false;
  button.style.cursor = "pointer";
};
window.disableButton = function(button) {
  button.disabled = true;
  button.style.cursor = "not-allowed";
};
window.validateEmailClient = function(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email) ? null : "Email is not valid.";
};
window.validatePasswordClient = function(password){
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[@$!%*?&]/.test(password)) {
    return "Password must contain at least one special character (@$!%*?&).";
  }
  return null;
};  
window.validateUsernameClient = function(username) {
  if (!/^[a-zA-Z0-9_-]{3,16}$/.test(username)) {
    return "Username must be 3-16 characters long and can only contain letters, numbers, underscores, and hyphens.";
  }
  return null;
};
window.getCookie = function(name) {
  console.log("Cookie name:", name);
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
};
window.getCookieValue = function(name) {
  console.log("Cookie name:", name);
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
    console.error(`No ${name} found in cookies.`);
    throw new Error(`No ${name} found in cookies`);
};
