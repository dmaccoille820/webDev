import express from 'express';

const router = express.Router();

// Route to render the index page
router.get('/',  (req, res) => {
  const name = process.env.NAME || 'Dev';
  res.render('login', { name: name });
});

export default router;
