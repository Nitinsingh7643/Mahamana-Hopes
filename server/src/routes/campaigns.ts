import { Router, Response } from 'express';
import Campaign from '../models/Campaign';
import { protect, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all campaigns (public)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const category = req.query.category as string;
    const status = req.query.status as string;

    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const total = await Campaign.countDocuments(query);
    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      campaigns,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get featured campaigns
router.get('/featured', async (_req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({ isFeatured: true, status: { $in: ['active', 'upcoming'] } })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json({ success: true, campaigns });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single campaign by slug
router.get('/slug/:slug', async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findOne({ slug: req.params.slug });
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }
    res.json({ success: true, campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single campaign by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }
    res.json({ success: true, campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create campaign (admin)
router.post('/', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json({ success: true, campaign });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update campaign (admin)
router.put('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }
    res.json({ success: true, campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete campaign (admin)
router.delete('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
