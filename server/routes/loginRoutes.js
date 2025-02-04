import express from "express";
import * as loginController from "../controllers/loginController.js";
import { updateSessionUser, ValidateSession } from "../models/sessionModel.js";
import { authenticateUser } from "../models/loginModel.js";

const router = express.Router();

router.post(
  "/",
  async (req, res, next) => {
    try {
      const { usernameOrEmail, password } = req.body;
      console.log(
        "loginRoutes.js - usernameOrEmail:",
        usernameOrEmail,
        "password:",
        password
      );
      const user = await authenticateUser(usernameOrEmail, password);
      let userId = user.user_id; //get the user id here
      console.log("loginRoutes.js - user:", user);
      if (user) {
        // Store the entire user object in the session
        req.session.user = user;

        if (!req.cookies || !req.cookies.sessionId) {
          try {
            console.log(
              "No SessionId found - attempting to create a new session."
            );

            let sessionResult = await ValidateSession(null); //now it only sends null

            if (sessionResult) {
              req.session.sessionId = sessionResult.sessionId;
              res.cookie("sessionId", req.session.sessionId, {
                httpOnly: true,
                secure: false,
                maxAge: 3600000,
              });
              await updateSessionUser(req.session.sessionId, userId); // update the session to add the user id
            }

            console.log("New Session created.", sessionResult);
          } catch (error) {
            console.error(
              "Error creating new session and adding user id:",
              error
            );
            res.status(500).json({
              message: "Internal server error creating session",
            });
            return;
          }
        } else {
          try {
            await updateSessionUser(req.cookies.sessionId, user.user_id);
            console.log(
              "Session Updated with User",
              req.cookies.sessionId,
              userId
            );
            req.userId = { user_id: userId }; // pass the userId to the next middleware, added this line
          } catch (error) {
            console.error("Error updating existing session user:", error);
            res.status(500).json({
              message: "Internal server error updating session",
            });
            return;
          }
        }
        req.userId = { user_id: userId }; // pass the userId to the next middleware, added this line
        next(); // Call next() here to proceed to the login controller
      } else {
        res.status(401).json({ message: "Invalid credentials." });
        console.log("User Not Authenticated");
        return;
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  loginController.loginUser
);

export default router;
