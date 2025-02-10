import express from "express";
import * as loginController from "../../controllers/auth/loginController.js";
import { updateSessionUser, validateSession } from "../../models/sessionModel.js";
import { authenticateUser } from "../../models/loginModel.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await authenticateUser(usernameOrEmail, password);

    if (!user) {
      console.error("User Not Authenticated");
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const userId = user.user_id;
   
    const userName = user.name;

    console.log("User ID:", userId, "User name:", userName);

    let sessionResult;
    try {
      if (req.cookies && req.cookies.sessionId) {
        sessionResult = await validateSession(req, req.cookies.sessionId);
      }

      console.log("sessionResult inside try before updateSessionUser:",sessionResult);
      if (sessionResult) {
        if (sessionResult.userId === null) {
          sessionResult.userId = userId;
        }

        res.cookie("sessionId", sessionResult.sessionId, {
          httpOnly: true,
          secure: false,
          maxAge: 3600000,
          path: "/",
        });

        res.cookie("userName", userName, {
          httpOnly: false,
          secure: false,
          maxAge: 3600000,
          path: "/",
        });

        if (req.session) {
          req.session.name = userName;
        }
        if (req.session) {
          req.session.sessionId = sessionResult.sessionId;
          req.session.userId = sessionResult.userId;
        }

        console.log("updateSessionUser called with session id", sessionResult.sessionId, "and user id", userId);
        await updateSessionUser(sessionResult.sessionId, userId);
      }
    } catch (error) {
      console.error("loginRoutes.js - Error updating session:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    
    next();
  } catch (error) {
    console.error("loginRoutes.js - Error authenticating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}, loginController.loginUser);

export default router;
