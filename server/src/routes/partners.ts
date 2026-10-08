import { Router, Response } from 'express';
import PartnerInquiry from '../models/PartnerInquiry';
import { protect, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Submit partnership inquiry (public)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const inquiry = await PartnerInquiry.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Thank you for your interest in partnering with us! We will review your inquiry.',
      data: { id: inquiry._id },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all inquiries (admin)
router.get('/', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const total = await PartnerInquiry.countDocuments();
    const inquiries = await PartnerInquiry.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      inquiries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update inquiry status (admin)
router.put('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const inquiry = await PartnerInquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inquiry) {
      res.status(404).json({ success: false, message: 'Inquiry not found' });
      return;
    }
    res.json({ success: true, inquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete inquiry (admin)
router.delete('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    await PartnerInquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
