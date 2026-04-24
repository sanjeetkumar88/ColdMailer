import { Router } from 'express';
import * as campaignController from './campaign.controller';

const router = Router();

router.post('/', campaignController.createCampaign);
router.get('/', campaignController.getCampaigns);
router.post('/:id/launch', campaignController.launchCampaign);

export default router;
