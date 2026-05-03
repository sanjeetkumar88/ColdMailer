import { Router, Request, Response } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary';
import { protect } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { Media } from './media.model';

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'coldmailer-attachments',
    resource_type: 'auto',
  } as any,
});

const upload = multer({ storage });

router.use(protect);

router.post('/upload', upload.array('files'), asyncHandler(async (req: any, res: Response) => {
  const files = (req as any).files as any[];
  
  const mediaRecords = await Promise.all(files.map(async (file) => {
    return await Media.create({
      userId: req.user.id,
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      format: file.mimetype.split('/')[1],
      size: file.size,
    });
  }));

  res.status(200).json({
    success: true,
    data: mediaRecords,
  });
}));

router.get('/', asyncHandler(async (req: any, res: Response) => {
  const media = await Media.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: media,
  });
}));

router.delete('/:id', asyncHandler(async (req: any, res: Response) => {
  const media = await Media.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media not found',
    });
  }

  // Optional: Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(media.publicId);
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error);
  }

  await Media.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Media deleted successfully',
  });
}));

export default router;
