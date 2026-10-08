import { Router, Response } from 'express';
import Gallery from '../models/Gallery';
import { protect, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get gallery items (public)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const category = req.query.category as string;
    const query: any = {};
    if (category && category !== 'all') query.category = category;

    const items = await Gallery.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create gallery item (admin)
router.post('/', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update gallery item (admin)
router.put('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404).json({ success: false, message: 'Gallery item not found' });
      return;
    }
    res.json({ success: true, item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete gallery item (admin)
router.delete('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Gallery item not found' });
      return;
    }
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
