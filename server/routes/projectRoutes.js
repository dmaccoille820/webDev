import express from 'express';
import { getProjectsByUserID } from '../controllers/projectController.js';

const router = express.Router();

router.post('/projects', async (req, res) => {
  const { userId } = req.body;
  try {
    const projects = await getProjectsByUserID(userId);
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

export default router;
