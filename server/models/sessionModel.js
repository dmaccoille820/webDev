import { queryDatabase } from "../config/db.js";

async function validateSession(sessionId) {
  if (!sessionId) {
    return null;
  }
  try {
    const [session] = await queryDatabase("CALL ValidateSession(?)", [
      sessionId,
    ]);
    if (session[0].userId === null) {
      return null;
    }
    return { sessionId: sessionId, userId: session[0].userId };
  } catch (error) {
    console.error("Error validating session:", error);
    return null;
  }
}

async function createNewSession(userId) {
  try {
    const [result] = await queryDatabase("CALL CreateSession(?,@p_session_id)", [userId]);
    console.log("result in createNewSession:", result);
    const sessionId = result[0].p_session_id; // Assuming the procedure returns the session ID
    console.log("sessionId in createNewSession:", sessionId);
    return sessionId;
  } catch (error) {
    console.error("Error creating new session:", error);
    throw error;
  }
}

async function updateSessionUser(sessionId, userId) {
  try {
    // Set the userId in Session storage
    console.log("sessionId in updateSessionUser:", sessionId);
    console.log("userId in updateSessionUser:", userId);
    await queryDatabase("CALL UpdateSessionUser(?, ?)", [sessionId, userId]);
  } catch (error) {
    console.error("Error updating session user:", error);
    throw error;
  }
}

export { validateSession, createNewSession, updateSessionUser };
