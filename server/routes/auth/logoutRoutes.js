import express from "express";
import { queryDatabase } from "../../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    try {
      const deleteQuery = "DELETE FROM sessions WHERE session_id = ?";
      await queryDatabase(deleteQuery, [sessionId]);

      res.clearCookie("sessionId", { httpOnly: true });

      res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Error during logout." });
    }
  } else {
    res.status(200).json({ message: "No active session to logout." });
  }
});

export default router;