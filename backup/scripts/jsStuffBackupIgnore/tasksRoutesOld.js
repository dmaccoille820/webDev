import express from 'express';
import * as tasksController from '../controllers/tasksController.js';
import {sessionMiddleware} from '../middleware/sessionMiddleware.js';

const router = express.Router();

router.use(sessionMiddleware); // Apply sessionMiddleware to all routes in this file

router.get('/', tasksController.getTasksByUserId); 
router.get('/all', tasksController.getAllTasks); 
router.post('/', tasksController.createTask);
router.delete('/:taskId', tasksController.deleteTask);
router.put('/:taskId', tasksController.updateTask);

export default router;
