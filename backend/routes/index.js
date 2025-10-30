import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Team1 API!' });
});

export default router;