import { Router } from 'express';
import * as templateController from './template.controller';
import { protect } from '../../shared/middleware/auth.middleware';

const router = Router();

router.post('/', protect, templateController.createTemplate);
router.get('/', protect, templateController.getTemplates);

export default router;
