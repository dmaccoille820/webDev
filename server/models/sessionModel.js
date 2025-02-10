import { queryDatabase } from "../config/db.js";

 async function validateSession(req, sessionId, userId) {
  console.log("validateSession called with sessionId:", sessionId);
    try {
    if (!sessionId) {
      console.log(
        "validateSession: sessionId is null, creating a new session"
      );
      const sql = "CALL CreateSession(@p_session_id, ?);";
      const result = await queryDatabase(sql, [userId]);
      console.log("CreateSession: CreateSession result:", result);
      sessionId = result[0][0].p_session_id; //get the session id from the query
      console.log("New session created", sessionId);
      return { sessionId: sessionId, userId: userId };
    } else {
      const sessionResult = await queryDatabase("CALL ValidateSession(?)", [
          sessionId,
      ]);
      console.log("ValidateSession: ValidateSession result:", sessionResult);
      if (sessionResult[0].length === 0) {
          console.log("Session not valid");
          return { sessionId: sessionId, userId: null };
      }
      const dbUserId = sessionResult[0][0].userId;

        if (dbUserId !== userId && userId !== undefined) {
            console.log("validateSession: userId mismatch, updating session");
            await updateSessionUser(sessionId, userId);
            console.log("Session updated with new userId");
             return { sessionId: sessionId, userId: userId };
        } else {
           console.log("Session valid - ValidateSession userId:", dbUserId);
            return { sessionId: sessionId, userId: dbUserId };
        }
    }
  } catch (error) {
    console.error("Error validating or creating session:", error);
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

export { validateSession, updateSessionUser }