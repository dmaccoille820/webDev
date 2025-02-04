import { queryDatabase } from "../controllers/db.js";

export async function getUserProjects(userId) {
  try {
    const results = await queryDatabase(
      "SELECT * FROM Project WHERE user_id = ?",
      [userId]
    );
    return results;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw error;
  }
}