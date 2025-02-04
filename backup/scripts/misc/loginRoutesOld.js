
import express from "express";
import * as loginController from "../controllers/loginController.js";
import * as userModel from "../models/registerLoginModel.js";
import { ValidateSession } from "../models/registerLoginModel.js";

const router = express.Router(); // Moved router definition here

console.log("Login route called");

router.post(
  "/login",
  async (req, res, next) => {
    try {      
      const { usernameOrEmail, password } = req.body;
        const userId = await userModel.authenticateUser(usernameOrEmail, password);        
        if (userId) { 
          req.user = userId;
          console.log("User Authenticated:", userId.user_id);
          if (!req.cookies || !req.cookies.sessionId) {
            try {
              console.log(
                "No SessionId found - attempting to create a new session."
              );

              const sessionResult = await ValidateSession(null, userId.user_id, 2);
                if(sessionResult){
                    req.session = sessionResult;
                }

              console.log("New Session created.", sessionResult);

              
            } catch (error) {
              console.error(
                "Error creating new session and adding user id:", error);
              res.status(500).json({ message: "Internal server error creating session" });
              return; 
            }
          }else {
            try {
              await userModel.updateSessionUser(req.cookies.sessionId, userId.user_id);
              console.log("Session Updated with User", req.cookies.sessionId, userId.user_id);
            } catch (error) {
              console.error("Error updating existing session user:", error);
              res.status(500).json({ message: "Internal server error updating session" });
              return;
            }
          }
          next();
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
