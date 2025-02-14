import express from 'express';
import * as tasksController from "../controllers/tasksController.js";

const router = express.Router();



// Define task-related routes

router.get("/", tasksController.getAllTasks);
router.post("/", tasksController.createTask);
router.put("/:taskId", tasksController.updateTask); 
router.delete("/:taskId", tasksController.deleteTask); 

export default router; 
