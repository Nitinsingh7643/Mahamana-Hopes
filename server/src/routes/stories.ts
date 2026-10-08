import { Router, Response } from 'express';
import Story from '../models/Story';
import { protect, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get published stories (public)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const category = req.query.category as string;

    const query: any = { isPublished: true };
    if (category) query.category = category;

    const total = await Story.countDocuments(query);
    const stories = await Story.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      stories,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get featured stories
router.get('/featured', async (_req: AuthRequest, res: Response) => {
  try {
    const stories = await Story.find({ isPublished: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(3);
    res.json({ success: true, stories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get story by slug (public)
router.get('/slug/:slug', async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug, isPublished: true });
    if (!story) {
      res.status(404).json({ success: false, message: 'Story not found' });
      return;
    }
    res.json({ success: true, story });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all stories (admin - includes unpublished)
router.get('/admin/all', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const total = await Story.countDocuments();
    const stories = await Story.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      stories,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create story (admin)
router.post('/', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.create(req.body);
    res.status(201).json({ success: true, story });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update story (admin)
router.put('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!story) {
      res.status(404).json({ success: false, message: 'Story not found' });
      return;
    }
    res.json({ success: true, story });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete story (admin)
router.delete('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      res.status(404).json({ success: false, message: 'Story not found' });
      return;
    }
    res.json({ success: true, message: 'Story deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
