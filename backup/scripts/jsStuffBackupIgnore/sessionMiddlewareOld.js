import { queryDatabase } from "../controllers/db.js";
import { findUserById } from "../models/registerLoginModel.js"; // Import findUserById from the correct location


export const sessionMiddleware = async (req, res, next) => {
  let sessionId = req.cookies.sessionId;
  let userId = null;
  let isValid = 0; // Default to invalid

  console.log("Session Middleware: Start of session validation process.");

  try {
    if (sessionId) {
      console.log("Session Middleware: SessionId found in cookies.");
      console.log(
        "Session Middleware: Before first database call - ValidateSession."
      );
      // First call to the database: ValidateSession
      await queryDatabase(
        "CALL ValidateSession(?, @p_userId, @p_isValid)",
        [sessionId]
      );
      console.log(
        "Session Middleware: After first database call - ValidateSession."
      );

      console.log(
        "Session Middleware: Before second database call - Fetching session variables."
      );
      // Second call to the database: Fetch session variables
      const sessionResult = await queryDatabase(
        "SELECT @p_userId AS userId, @p_isValid AS isValid",
        []
      );
      console.log(
        "Session Middleware: After second database call - Fetched session variables."
      );
      console.log("Session Middleware: Session Variables:");
      userId = sessionResult[0].userId;
      isValid = sessionResult[0].isValid;
    }

    // If the session is valid
    if (isValid === 1) {
      console.log(
        "Session Middleware: isValid is 1, session is valid."
      );
      if (userId) {
        console.log(
          "Session Middleware: userId is present, fetching user details."
        );
        const userResult = await findUserById(userId);
        if (userResult && userResult.length > 0) {
          req.user = {
            user_id: userId,
            name: userResult[0].name,
            username: userResult[0].username,
            email: userResult[0].email,
            password: userResult[0].password,
          };
        } else {
          console.log(
            "Session Middleware: User not found, setting req.user to null."
          );
          req.user = null;
        }
      } else {
        console.log(
          "Session Middleware: userId not found in db, setting req.user to null."
        );
        req.user = null;
      }
    } else {
      console.log(
        "Session Middleware: Session invalid or no session found."
      );
      // Check if it's a login attempt (or other specific route)
      if (!req.path.startsWith('/login')) {
        console.log(
            "Session Middleware: Not a login attempt, setting req.user to null and clearing cookie."
        );
        req.user = null;
        sessionId = null;
      } else {
        console.log(
            "Session Middleware: Login attempt detected, preparing for session creation."
        );
        // Proceed to login logic
      }
    }
    console.log("Session Middleware: After try block completed");
  } catch (error) {
    console.error("Error in session middleware:", error);
    console.log("Session Middleware: Error in session middleware, setting req.user to null.");
    // Handle the error appropriately, maybe set a default state or redirect
    req.user = null;
  }

  console.log("Session Middleware: Checking session validity before setting cookie.");

  if (isValid === 1) {
      console.log("Session Middleware: Session is valid (isValid = 1), setting cookie.");
      // Set the session cookie
      res.cookie("sessionId", sessionId, {
          httpOnly: true,
          maxAge: 3600 * 1000, // 1 hour in milliseconds
      });
  } else if (isValid === 2){
    console.log(
      "Session Middleware: Login attempt detected, setting cookie."
    );
    res.cookie("sessionId", sessionId, {
        httpOnly: true,
        maxAge: 3600 * 1000, // 1 hour in milliseconds
    });
  }
  else if (sessionId){
    console.log("Session Middleware: Clearing cookie.");
    res.clearCookie('sessionId');
  } else{
    console.log("Session Middleware: No session and not in login. No cookie.");
  }

  console.log(
    "Session Middleware: End of session validation, continuing to next middleware."
  );
  if (isValid !== 1 && isValid !== 2) {
      console.log('Session not valid')
    }
  console.log("Session Middleware: Before calling next().");
  next();
  console.log("Session Middleware: After calling next().");
};
