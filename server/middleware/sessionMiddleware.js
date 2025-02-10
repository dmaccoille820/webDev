import { validateSession } from "../models/sessionModel.js";

const sessionMiddleware = async (req, res, next) => {

  try {
    const sessionId = req.cookies?.sessionId;
    const currentPath = req.originalUrl;

    if (!currentPath.startsWith("/login") && !currentPath.startsWith("/register") && currentPath !== "/") {
        if (sessionId) {
            // Validate the session
            const sessionResult = await validateSession(req,sessionId);
            if (sessionResult && sessionResult.userId) {
                req.userId = { user_id: sessionResult.userId }; //set the user id here
            } else {
                res.clearCookie("sessionId");
                res.status(401).json({ message: "Unauthorized: Invalid session" });
                return; // Stop further execution
            }
        }else {
            
            res.status(401).json({ message: 'Unauthorized: Session cookie required' });
            return;

        }
      }
    next();
  } catch (error) {
    console.error("sessionMiddleware - Error:", error);
    next();
  }
};

export { sessionMiddleware };
