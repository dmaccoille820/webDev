import { validatePasswordServer } from '../utils/validation.js';

export const validateRegistration = (req, res, next) => {
  const { name, username, email, password, confirmPassword } = req.body;
  const errors = {};

  if (!name || name.length < 3 || username.trim() === "") {
    errors.name = "Name must be at least 3 characters long.";
  }

  if (!username || username.trim() === "") {
    errors.username = "Username is required.";
  } else if (username.length < 8) {
    errors.username = "Username must be at least 8 characters long.";
  }

  if (!email || email.trim() === "") {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email is not valid.";
  }

  if (!password || password.trim() === "" || password.length < 8) {
    errors.password = "Longer Password is required: 8 charachters";
  } else {
    const passwordError = validatePasswordServer(password);
    if (passwordError) {
      errors.password = passwordError;
    }
  }
  if (!confirmPassword) {
    errors.confirmPassword = "Confirm Password is required.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  else {
    next();
  }
};
export const preventLoggedIn = (req, res, next) => {
  const sessionId = req.cookies?.sessionId;
  if (sessionId) {
    res.status(400).json({ message: "User is already logged in." });
    return;
  }
  next();
};
