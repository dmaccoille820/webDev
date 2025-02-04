import express from "express";
import { queryDatabase } from "../controllers/db.js";

const router = express.Router();

router.post("/api/logout", async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    try {
      // Delete the session from the database
      const deleteQuery = "DELETE FROM sessions WHERE session_id = ?";
      await queryDatabase(deleteQuery, [sessionId]);

      // Clear the session cookie
      res.clearCookie("sessionId", { httpOnly: true });

      console.log("Logged out successfully.");
      res.redirect("/"); // Use res.redirect and only this
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Error during logout." });
    }
  } else {
    // No session to delete
    res.status(200).json({ message: "No active session to logout." });
  }
});

export default router;
