import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller.js';

const router = Router();

router.use(authenticate); // every task route requires a valid token

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
