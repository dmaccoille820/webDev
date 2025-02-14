import { queryDatabase } from "../config/db.js";

export const getProjectsByUserID = async (userId) => {
  try {
    const result = await queryDatabase("CALL GetUserProjectsByUserId(?)", [userId]);
    return result;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects.");
  }
};
