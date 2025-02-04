// server/controllers/tasksController.js
import TaskModel from "../models/taskModel.js";

/**
 * Renders the tasks page.
 * @param {*} req
 * @param {*} res
 */
const renderTasksPage = async (req, res) => {
  try {
    res.render('tasks'); // Renders the tasks.ejs template
  } catch (error) {
    console.error('Error rendering tasks page', error);
    res.status(500).send('Internal Server Error');
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
const createTask = async (req, res) => {
  try {
    const { taskName, taskDescription, taskDueDate, taskPriority, taskStatus } =
      req.body;

    const userId = req.user.user_id;
    const result = await TaskModel.createTask(
      taskName,
      taskDescription,
      taskDueDate,
      taskPriority,
      taskStatus,
      userId
    );

    if (result) {
      res.status(200).json({ message: "Task created successfully" });
    } else {
      res.status(400).json({ message: "Error creating the task" });
    }
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task" });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
const getAllTasks = async (req, res) => {
  try {
    const rows = await TaskModel.getAllTasks();
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    res.status(500).json({ message: "Error fetching all tasks" });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
const getTasksByUserId = async (req, res) => {
  try {
      if (!req.user || !req.user.user_id) {
          console.error("Error: user object or userId not found in request.");
          return res.status(401).json({ message: "Unauthorized: User not authenticated or user ID missing." });
        }

      const userId = req.user.user_id;
      console.log('userId in getTasksByUserId: ', userId);
     
    

    const rows = await TaskModel.viewTasksByUserId(userId);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching tasks for user:", error);
    res.status(500).json({ message: "Internal Server Error: Failed to retrieve tasks for the user." });

  }
};
/**
 * Updates a task
 * @param {*} req 
 * @param {*} res 
 */
const updateTask = async (req, res) => {
  try {
    const { taskId, taskName, taskDescription, taskDueDate, taskPriority, taskStatus } = req.body;
    const result = await TaskModel.updateTask(taskId, taskName, taskDescription, taskDueDate, taskPriority, taskStatus);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Task updated successfully" });
    } else {
      res.status(404).json({ message: "Task not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
};
/**
 * Deletes a task
 * @param {*} req 
 * @param {*} res 
 */
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const result = await TaskModel.deleteTask(taskId);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
};

export { createTask, getAllTasks, getTasksByUserId, renderTasksPage, updateTask, deleteTask };
