import * as userModel from '../models/registerLoginModel.js';

export const sessionMiddleware = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      console.log('Session ID from Login Middleware: ', req.session.userId);
      const user = await userModel.findUserByUsernameOrEmail(req.session.userId);
      if (user) {
        req.session.username = user.username;

        const userObject = {
            name: user.name,
            username: user.username,
            email: user.email,
          };
          req.user = userObject;
        console.log('User object from Login Middleware:', userObject)
        return res.status(200).json({ user: userObject, username: user.username });
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


