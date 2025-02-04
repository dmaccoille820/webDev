import { ValidateSession } from "../models/sessionModel.js";

const sessionMiddleware = async (req, res, next) => {
  console.log("Session Middleware called");

  try {
    const sessionId = req.cookies?.sessionId;
    const currentPath = req.originalUrl;
    console.log(
      "Session Middleware: SessionId from cookies:",
      sessionId,
      "Current Path:",
      currentPath
    );

    // Check if user already exists in the session
    if (req.session.user) {
      console.log(
        "Session Middleware: User already logged in, setting req.userId from session"
      );
      req.userId = { user_id: req.session.user.user_id }; // Add user_id to req.userId from session
      console.log("Session Middleware: req.userId: ", req.userId);
    }
    // Check if the request is for API, logout, or user routes
    if (
      currentPath.startsWith("/api") ||
      currentPath.startsWith("/logout") ||
      currentPath.startsWith("/user")
    ) {
      console.log("Session Middleware: API, logout, or user route detected.");
      if (sessionId) {
        // Validate the session
        const sessionResult = await ValidateSession(sessionId, null); //we are no longer sending the user id
        if (sessionResult && sessionResult.userId) {
          console.log("Session Middleware: Session valid");
          req.userId = { user_id: sessionResult.userId }; //set the user id here
          // Set the session cookie
          res.cookie("sessionId", sessionId, {
            httpOnly: true,
            maxAge: 3600000,
          });
        } else if (sessionId) { //if there is a cookie and the session is not valid.
          console.log("Session Middleware: Session not valid");
          res.clearCookie("sessionId");
          console.log("Session Middleware: Cookie cleared (invalid session).");
        }
      } else {
        console.log(
          "Session Middleware: Session invalid or no session found."
        );
        if (req.session.user){
            req.userId = { user_id: req.session.user.user_id }; // Add user_id to req.userId from session
        }
      }
    }
    
    console.log("Session Middleware: req.userId: ", req.userId);
    console.log(
      "Session Middleware: End of session validation, continuing to next middleware."
    );
    next();
  } catch (error) {
    console.error("Session Middleware: Error:", error);
    next();
  }
};

export { sessionMiddleware };
