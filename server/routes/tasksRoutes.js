import express from 'express';
import { getAllTasks, createTask, updateTask, deleteTask } from '../controllers/tasksController.js';

const router = express.Router();

// Define task-related routes
router.get("/", getAllTasks);
router.post("/", createTask);
router.put("/:taskId", updateTask); // Use taskId as a parameter
router.delete("/:taskId", deleteTask); // Use taskId as a parameter

export default router;
