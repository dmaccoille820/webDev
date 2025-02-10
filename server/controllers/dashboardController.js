import { getUserProjects } from "../models/dashboardModel.js";

const getDashboard = async (req, res) => {
  console.log(req.userId);

  const {user_id: userId} = req.userId || {};

  if (!userId) {
    console.log("No userID in dashboardController");
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    const projects = await getUserProjects(userId);
    console.log("Projects fetched successfully:", projects);
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

export { getDashboard };
