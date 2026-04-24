import { Router } from 'express';
import * as contactController from './contact.controller';
import { protect } from '../../shared/middleware/auth.middleware';

const router = Router();

router.use(protect); // Protect all contact routes

router.post('/', contactController.createContact);
router.get('/', contactController.getContacts);
router.post('/bulk', contactController.bulkUpload);

export default router;
