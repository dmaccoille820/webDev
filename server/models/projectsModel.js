import { queryDatabase } from "../config/db.js";


  export const getProjectsByUserID = async function getProjectsByUserID(userID)
    {
        try {
        const result = await queryDatabase("CALL GetUserProjectsTasksByUserId(?)", [userId] );
          return result;
    } catch (error) {
        console.error("Error creating task:", error);
      throw new Error("Failed to create task.");
    }
}
