import { Router, Request, Response } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary';
import { protect } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mailflow-attachments',
    resource_type: 'auto',
  } as any,
});

const upload = multer({ storage });

router.post('/upload', protect, upload.array('files'), asyncHandler(async (req: Request, res: Response) => {
  const urls = ((req as any).files as any[]).map((file: any) => file.path);
  res.status(200).json({
    success: true,
    data: urls,
  });
}));

export default router;
