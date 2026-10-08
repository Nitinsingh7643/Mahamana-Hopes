import { Router, Response } from 'express';
import Volunteer from '../models/Volunteer';
import { protect, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Submit volunteer application (public)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Thank you! Your volunteer application has been submitted successfully.',
      volunteer: { id: volunteer._id, fullName: volunteer.fullName, status: volunteer.status },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all volunteers (admin)
router.get('/', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const query: any = {};
    if (status) query.status = status;

    const total = await Volunteer.countDocuments(query);
    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      volunteers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update volunteer status (admin)
router.put('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { status, adminNotes } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      res.status(404).json({ success: false, message: 'Volunteer not found' });
      return;
    }

    res.json({ success: true, volunteer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete volunteer (admin)
router.delete('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      res.status(404).json({ success: false, message: 'Volunteer not found' });
      return;
    }
    res.json({ success: true, message: 'Volunteer application deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get volunteer stats
router.get('/stats/summary', protect, authorize('admin'), async (_req: AuthRequest, res: Response) => {
  try {
    const stats = await Volunteer.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const byArea = await Volunteer.aggregate([
      { $unwind: '$areasOfInterest' },
      {
        $group: {
          _id: '$areasOfInterest',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, stats, byArea });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
