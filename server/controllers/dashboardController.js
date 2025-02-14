import { validateSession } from "../models/sessionModel.js";
import { getProjectsByUserID } from "../models/projectsModel.js";

const getDashboard = async (req, res) => {
  console.log("getDashboard called in dashboard Controller with req.body", req.body);
  const sessionId = req.body.sessionId;
  console.log("req.body", req.body);
  if (!sessionId) {
    console.log("No session found in dashboardController");
    return res.status(401).json({ message: "User not logged in" });
  }
  try {
    const sessionResult = await validateSession(sessionId); // Changed: Use validateSession directly
    if (!sessionResult) {
      console.log("Invalid session in dashboardController");
      return res.status(401).json({ message: "User not logged in" });
    }
    console.log("sessionResult.userId", sessionResult.userId);
    const projects = await getProjectsByUserID(sessionResult.userId);
    console.log("Projects fetched successfully:", projects);
    return res
      .status(200)
      .json({ ...projects, userId: sessionResult.userId });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

export { getDashboard };
