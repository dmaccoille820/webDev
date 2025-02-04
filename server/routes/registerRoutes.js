import express from 'express';
import * as registerController from '../controllers/registerController.js';
import { validateRegistration } from '../middleware/registerMiddleware.js';


const router = express.Router();
router.post('/api/check-username', registerController.checkUsername);
router.post('/api/register', validateRegistration, registerController.registerUser);


export default router;
