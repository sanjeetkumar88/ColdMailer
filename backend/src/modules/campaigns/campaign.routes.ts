import { Router } from 'express';
import * as campaignController from './campaign.controller';
import { protect } from '../../shared/middleware/auth.middleware';

const router = Router();

router.post('/', protect, campaignController.createCampaign);
router.get('/', protect, campaignController.getCampaigns);
router.get('/:id', protect, campaignController.getCampaignById);
router.post('/:id/launch', protect, campaignController.launchCampaign);
router.post('/:id/retry', protect, campaignController.retryCampaign);
router.delete('/:id', protect, campaignController.deleteCampaign);

export default router;
