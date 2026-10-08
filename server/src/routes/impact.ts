import { Router, Response } from 'express';
import ImpactStatistic from '../models/ImpactStatistic';
import { protect, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get visible impact stats (public)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const category = req.query.category as string;
    const query: any = { isVisible: true };
    if (category) query.category = category;

    const stats = await ImpactStatistic.find(query).sort({ order: 1 });
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all stats (admin)
router.get('/all', protect, authorize('admin'), async (_req: AuthRequest, res: Response) => {
  try {
    const stats = await ImpactStatistic.find().sort({ category: 1, order: 1 });
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create stat (admin)
router.post('/', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const stat = await ImpactStatistic.create(req.body);
    res.status(201).json({ success: true, stat });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update stat (admin)
router.put('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const stat = await ImpactStatistic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!stat) {
      res.status(404).json({ success: false, message: 'Statistic not found' });
      return;
    }
    res.json({ success: true, stat });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete stat (admin)
router.delete('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    await ImpactStatistic.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Statistic deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
