import { getUserProjects } from "../models/dashboardModel.js";

const getDashboard = async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    const projects = await getUserProjects(userId);
    res.render("dashboard", {
      projects: projects,
      userId: userId,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

const getAllDashboards = async (req, res) => {
    console.log('getAllDashboards controller called');
    res.status(200).json({ message: "getAllDashboards called" }); // Replace with your actual logic
};

export { getDashboard, getAllDashboards };