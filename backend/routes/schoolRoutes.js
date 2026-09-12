import { Router } from 'express';
import {
  getSchool,
  updateSchool
} from '../controllers/schoolController.js';

const router = Router();

router.get('/', getSchool);
router.put('/', updateSchool);

export default router;
