import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import * as tasksController from '../controllers/tasksController.js';

const router = express.Router();
router.get("/api/dashboard", dashboardController.getDashboard);
router.get("/api/tasks/progress", tasksController.getTasksProgress);
router.get("/",dashboardController.getDashboard);


export default router;