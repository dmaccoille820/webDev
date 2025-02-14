import { validateSession, createNewSession } from '../models/sessionModel.js';

const sessionMiddleware = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId || null;
   console.log("sessionMiddleware - sessionId:", sessionId);

    if (sessionId) {
      // Validate the session
      const sessionResult = await validateSession(sessionId);
      if (sessionResult && sessionResult.userId) {
        req.userId = { user_id: sessionResult.userId }; // Set the user id here
      } else {
        res.clearCookie('sessionId');
        res.status(401).json({ message: 'Unauthorized: Invalid session' });
        return; // Stop further execution
      }
    } else {
      // No session ID found, but it's a protected path
      res.status(401).json({ message: 'Unauthorized: Session cookie required' });
      return;
    }
     //if there is a req.userId but no cookie, create a new session.
     if (req.userId && req.userId.user_id && !sessionId) {
      const userId = req.userId.user_id;
      const newSessionId = await createNewSession(userId);
      const sessionResult = { sessionId: newSessionId, userId: userId };
      res.cookie('sessionId', sessionResult.sessionId, {
        httpOnly: false,
        secure: false,
        maxAge: 3600000,
        path: '/',
      });
      req.userId = { user_id: sessionResult.userId }; 
    }
    next();
  } catch (error) {
    console.error("sessionMiddleware - Error:", error);
    next();
  }
};

export { sessionMiddleware };
