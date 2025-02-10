import { queryDatabase } from "../config/db.js";

export async function getUserProjects(userId) {
  try {
    const rows = await queryDatabase("CALL GetUserProjectsByUserId(?)", [userId]);
    return rows;
  } catch (error) {
    console.error("Error getting all projects:", error);
    throw new Error("Failed to get all projects.");
  }
}
