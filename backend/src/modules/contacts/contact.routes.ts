import { Router } from 'express';
import * as contactController from './contact.controller';
import { protect } from '../../shared/middleware/auth.middleware';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.use(protect); // Protect all contact routes

router.post('/', contactController.createContact);
router.get('/', contactController.getContacts);
router.post('/bulk-upload', upload.single('file'), contactController.bulkUpload);
router.patch('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

export default router;
