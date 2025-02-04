import express from 'express';
import * as tasksController from '../controllers/tasksController.js';

const router = express.Router();

router.get("/api/tasks", tasksController.getAllTasks);
router.post('/', async (req, res) => {
    try {
      const { taskName, taskDescription, taskDueDate, taskPriority, taskStatus } = req.body;
      const userId = req.userId.user_id
      await tasksController.createTask({ taskName, taskDescription, taskDueDate, taskPriority, taskStatus, userId });
      res.status(201).json({ message: "Task created successfully" });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  export async function getTasks(){ 
    try {
        const tasks = await tasksController.getAllTasks(); 
        return tasks;
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        return {message: "Internal server error retrieving tasks"};
    }
}
export default router;