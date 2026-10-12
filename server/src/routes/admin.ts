import { Router, Response } from 'express';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import Donation from '../models/Donation';
import Volunteer from '../models/Volunteer';
import Campaign from '../models/Campaign';
import ContactMessage from '../models/ContactMessage';
import ImpactStatistic from '../models/ImpactStatistic';
import User from '../models/User';
import PartnerInquiry from '../models/PartnerInquiry';

const router = Router();

// Dashboard overview
router.get('/dashboard', protect, authorize('admin'), async (_req: AuthRequest, res: Response) => {
  try {
    const [
      totalDonations,
      successfulDonations,
      totalVolunteers,
      pendingVolunteers,
      activeCampaigns,
      totalCampaigns,
      unreadMessages,
      totalUsers,
      pendingPartners,
    ] = await Promise.all([
      Donation.countDocuments(),
      Donation.aggregate([
        { $match: { status: 'successful' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Volunteer.countDocuments(),
      Volunteer.countDocuments({ status: 'pending' }),
      Campaign.countDocuments({ status: 'active' }),
      Campaign.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      User.countDocuments(),
      PartnerInquiry.countDocuments({ status: 'pending' }),
    ]);

    const recentDonations = await Donation.find({ status: 'successful' })
      .sort({ createdAt: -1 })
      .limit(5);
    const recentVolunteers = await Volunteer.find()
      .sort({ createdAt: -1 })
      .limit(5);
    const recentMessages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      dashboard: {
        totalDonations,
        totalAmountRaised: successfulDonations[0]?.total || 0,
        totalVolunteers,
        pendingVolunteers,
        activeCampaigns,
        totalCampaigns,
        unreadMessages,
        totalUsers,
        pendingPartners,
        recentDonations,
        recentVolunteers,
        recentMessages,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Manage users
router.get('/users', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const total = await User.countDocuments();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user role
router.put('/users/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    );
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create user (admin)
router.post('/users', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      return;
    }
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, message: 'User with this email already exists' });
      return;
    }
    const user = await User.create({ name, email, password, role: role || 'user' });
    res.status(201).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user (admin)
router.delete('/users/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?._id.toString() === req.params.id) {
      res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
      return;
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
