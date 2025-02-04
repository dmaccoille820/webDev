import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { sessionMiddleware } from '../middleware/sessionMiddleware.js';

const router = express.Router();

//router.use(sessionMiddleware); 

router.get('/', sessionMiddleware, dashboardController.getDashboard);


export default router;
