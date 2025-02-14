const validatePasswordServer = (password) => {
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

const validateUsernameServer = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
  return usernameRegex.test(username) ? null : "Username must be 3-16 characters long and can only contain letters, numbers, underscores, and hyphens.";
};

const validateEmailServer = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email) ? null : "Email is not valid.";
};

export { validatePasswordServer, validateUsernameServer, validateEmailServer };