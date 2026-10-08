import { Router, Response } from 'express';
import Donation from '../models/Donation';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();

// Create donation order (Razorpay)
router.post('/create-order', async (req: AuthRequest, res: Response) => {
  try {
    const { donorName, email, phone, amount, purpose, isAnonymous, message } = req.body;

    if (!donorName || !email || !phone || !amount) {
      res.status(400).json({ success: false, message: 'Please fill all required fields' });
      return;
    }

    // Create a mock order for development (replace with Razorpay in production)
    const orderId = 'order_' + crypto.randomBytes(12).toString('hex');

    const donation = await Donation.create({
      donorName,
      email,
      phone,
      amount,
      purpose: purpose || 'general',
      orderId,
      isAnonymous: isAnonymous || false,
      message,
      status: 'pending',
      receiptNumber: 'MHF-' + Date.now(),
    });

    res.status(201).json({
      success: true,
      order: {
        id: orderId,
        amount: amount * 100,
        currency: 'INR',
      },
      donation: donation._id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify payment
router.post('/verify', async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, paymentId, signature, donationId } = req.body;

    // In production, verify signature with Razorpay:
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    //   .update(orderId + '|' + paymentId).digest('hex');

    const donation = await Donation.findByIdAndUpdate(
      donationId,
      {
        paymentId,
        signature,
        status: 'successful',
      },
      { new: true }
    );

    if (!donation) {
      res.status(404).json({ success: false, message: 'Donation not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      donation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all donations (admin)
router.get('/', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const purpose = req.query.purpose as string;

    const query: any = {};
    if (status) query.status = status;
    if (purpose) query.purpose = purpose;

    const total = await Donation.countDocuments(query);
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      donations,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single donation
router.get('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      res.status(404).json({ success: false, message: 'Donation not found' });
      return;
    }
    res.json({ success: true, donation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get donation stats (admin)
router.get('/stats/summary', protect, authorize('admin'), async (_req: AuthRequest, res: Response) => {
  try {
    const stats = await Donation.aggregate([
      { $match: { status: 'successful' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 },
          avgDonation: { $avg: '$amount' },
        },
      },
    ]);

    const byPurpose = await Donation.aggregate([
      { $match: { status: 'successful' } },
      {
        $group: {
          _id: '$purpose',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyTrend = await Donation.aggregate([
      { $match: { status: 'successful' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      stats: stats[0] || { totalAmount: 0, totalDonations: 0, avgDonation: 0 },
      byPurpose,
      monthlyTrend,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
