
import { queryDatabase } from "../controllers/db.js";

 const ValidateSession = async (sessionId, userId=null) => {
  try {
    console.log("ValidateSession called with sessionId:", sessionId, "and userId: ", userId);

    // If no sessionId, create a new session
    if (!sessionId) {
      console.log("Creating new session, no session id found");
      const createSessionResult = await queryDatabase(
        "CALL CreateSession(@p_sessionId, ?, @p_userId, @p_isValid)",
        [userId]
      );
      
      const results = await queryDatabase("SELECT @p_sessionId as sessionId");
      const newSessionId = results[0].sessionId;
      console.log("New session created, new session Id is: ", newSessionId);
      return { sessionId: newSessionId, userId: userId };
    }

    // If sessionId exists, validate it
    const validationResult = await queryDatabase(
      "CALL ValidateSession(?, @p_userId, @p_isValid)",
      [sessionId]
    );

    const results = await queryDatabase(
      "SELECT @p_userId as userId, @p_isValid as isValid"
    );

    const { userId: retrievedUserId, isValid } = results[0];

    if (!isValid || retrievedUserId !== userId) {
      console.log("Session not valid or user mismatch");
      return null;
    }
    console.log("Session valid");
    return { sessionId: sessionId, userId: retrievedUserId };
  } 
  catch (error) {
    console.error("ValidateSession: Error validating session:", error);
    throw error;
  }
};

      const updateSessionUser = async (sessionId, userId) => {
        try {
            console.log('updateSessionUser called with sessionId:', sessionId, 'and userId:', userId);
            await queryDatabase('CALL UpdateSessionUser(?, ?)', [sessionId, userId]);
            console.log('updateSessionUser: Session updated successfully.');
        }
        
         catch (error) {
            console.error('updateSessionUser: Error updating session:', error);
        }
    };
export{ValidateSession, updateSessionUser}