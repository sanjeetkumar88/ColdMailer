import express from 'express';
import * as contactListController from './contact-list.controller';
import { protect } from '../../shared/middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/', contactListController.createList);
router.get('/', contactListController.getLists);
router.get('/:id', contactListController.getListById);
router.patch('/:id', contactListController.updateList);
router.delete('/:id', contactListController.deleteList);

export default router;
