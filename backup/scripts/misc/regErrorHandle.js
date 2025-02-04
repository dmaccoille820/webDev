function handleCheckError(response, data, usernameErrorDiv, emailErrorDiv) {
    if (response.status === 409) {
      // Check which field caused the conflict
      if (data.conflict === "username") {
        usernameErrorDiv.textContent = "Username already exists";
        usernameErrorDiv.classList.add("error");
      } else if (data.conflict === "email") {
        emailErrorDiv.textContent = "Email already exists";
        emailErrorDiv.classList.add("error");
      }
    } else {
      console.error(
        "Failed to check username/email availability. Status:",
        response.status
      );
    }
  }