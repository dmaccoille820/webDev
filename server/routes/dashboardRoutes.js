import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

router.get("/", dashboardController.getAllDashboards);

export default router;