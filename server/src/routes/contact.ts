import { Router, Response } from 'express';
import ContactMessage from '../models/ContactMessage';
import { protect, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Submit contact message (public)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const message = await ContactMessage.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! We will get back to you soon.',
      data: { id: message._id },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all messages (admin)
router.get('/', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const isRead = req.query.isRead;

    const query: any = {};
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const total = await ContactMessage.countDocuments(query);
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      messages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark as read (admin)
router.put('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    res.json({ success: true, message: message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete message (admin)
router.delete('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
