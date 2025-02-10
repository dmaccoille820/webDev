import TaskModel from "../models/taskModel.js";

const getAllTasks = (req, res) => {
    console.log("getAllTasks controller called");
    return new Promise(async (resolve, reject) => {
        try {
            if (!req.userId || !req.userId.user_id) {
                console.error("userId is missing");
                return res.status(401).json({ message: "Unauthorized: User ID is missing." });
            }
            const userId = req.userId.user_id;
            console.log("retrieving data for user:", userId);
            const tasks = await TaskModel.viewTasksByUserId(userId);
            console.log("tasks retrieved:", tasks);
            res.status(200).json(tasks);
            resolve();
        } catch (error) {
            console.error("Error in getAllTasks controller:", error);
            res.status(500).json({ message: "Internal server error" });
            reject(error);
        }
    });
};


/**
 * Create a new task.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>}
 */
const createTask = async (req, res) => {
  console.log("createTask controller called");
  try {
    const {
      taskName,
      taskDescription,
      taskDueDate,
      taskPriority,
      taskStatus,
      projectId
    } = req.body;
    const userId = req.userId.user_id;

    // Validation checks
    if (!taskName || !taskDescription || !taskDueDate || !taskPriority || !userId || !projectId || !taskStatus) {
        console.error("Missing fields on request", req.body);
        return res.status(400).json({ message: "Missing required fields." });
    }

    if (isNaN(Date.parse(taskDueDate))) {
        return res.status(400).json({ message: "taskDueDate must be a valid date" });
    }
    
    const newTask = await TaskModel.createTask(
        projectId,
        taskName,
        taskDescription,
        taskDueDate,
        taskPriority,
        taskStatus
    );
    console.log("New task created:",newTask);
    res.status(201).json({ message: "Task created successfully", task:newTask });
  } catch (error) {
    console.error("Error creating a task", error);
    res.status(500).json({ message: "Internal Server Error"});
  }
};

/**
 * Updates an existing task.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>}
 */
const updateTask = async (req, res) => {
    console.log("updateTask controller called");
    try {
      const { taskId } = req.params;
      const {
        taskName,
        taskDescription,
        taskDueDate,
        taskPriority,
        taskStatus,
        projectId
      } = req.body;
      if (!taskId || !taskName || !taskDescription || !taskDueDate || !taskPriority || !taskStatus) {
        console.error("Missing fields on request", req.body);
        return res.status(400).json({ message: "Missing required fields." });
      }
      const updatedTask = await TaskModel.updateTask(
        taskId,
        projectId,
        taskName,
        taskDescription,
        taskDueDate,
        taskPriority,
        taskStatus
      );
      console.log("Task updated:", updatedTask);
      res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
      console.error("Error updating a task", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  /**
   * Deletes an existing task.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @returns {Promise<void>}
   */
  const deleteTask = async (req, res) => {
    console.log("deleteTask controller called");
    try {
      const { taskId } = req.params;
      if (!taskId) {
        console.error("Missing taskId on request");
        return res.status(400).json({ message: "Missing required field: taskId." });
      }
      const deletedTask = await TaskModel.deleteTask(taskId);
      console.log("Task deleted:", deletedTask);
      res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
      console.error("Error deleting a task", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export { getAllTasks, createTask, updateTask, deleteTask };
