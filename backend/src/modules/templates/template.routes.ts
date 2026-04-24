import { Router } from 'express';
import * as templateController from './template.controller';

const router = Router();

router.post('/', templateController.createTemplate);
router.get('/', templateController.getTemplates);

export default router;
