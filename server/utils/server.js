import express from 'express';

const router = express.Router();

router.post('/log-client', (req, res) => {
  const { message } = req.body;
  console.log('Client Log:', message);
  res.status(200).send();
});

export default router;