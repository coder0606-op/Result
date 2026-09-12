import { Router } from 'express';
import {
  getStudentMarks,
  updateStudentMarks
} from '../controllers/marksController.js';

const router = Router();

router.get('/student/:studentId', getStudentMarks);
router.put('/student/:studentId', updateStudentMarks);

export default router;
