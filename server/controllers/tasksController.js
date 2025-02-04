import TaskModel from "../models/taskModel.js";

const getAllTasks = async (req, res) => {
  console.log("getAllTasks controller called");

  try {
    if (!req.userId || !req.userId.user_id) {
        console.error('userId is missing');
      return res.status(401).json({ message: "Unauthorized: User ID is missing." });
    }
    const userId = req.userId.user_id;
    console.log("retrieving data for user:", userId);
    const tasks = await TaskModel.viewTasksByUserId(userId);
    console.log('tasks retrieved:', tasks);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getAllTasks controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllTasks };