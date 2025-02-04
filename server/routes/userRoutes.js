import express from 'express';
import * as loginController from '../controllers/loginController.js';

const router = express.Router();

router.get("/", loginController.getUserData);

export default router;