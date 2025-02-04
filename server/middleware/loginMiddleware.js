import * as userModel from '../models/registerLoginModel.js';

export const sessionMiddleware = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      console.log('Session ID from Login Middleware: ', req.session.userId);
      const user = await userModel.findUserById(req.session.userId);
      if (user) {
        const userObject = {
            name: user.name,
            username: user.username,
            email: user.email,
          };
          req.user = userObject;
          next();
      } else {
        req.session.destroy(() => {
          console.log('Session destroyed');
          res.redirect('/login');
        });
      }
    } else {
      next();
    }
  } catch (error) {
    console.error('Error during session authentication:', error);
    res.redirect('/login');
  }
};

export const validateLoginInput = (req, res, next) => {
  const { usernameOrEmail, password } = req.body;
  const errors = {};

  if (!usernameOrEmail || usernameOrEmail.trim() === "") {
    errors.username = "Username/Email is required.";
  }
  if (!password || password.trim() === "") {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  } else {
    next();
  }
};


