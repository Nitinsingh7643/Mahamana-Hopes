import mongoose, { Document, Schema } from 'mongoose';

export interface IDonation extends Document {
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  purpose: 'education' | 'healthcare' | 'environment' | 'general';
  paymentId?: string;
  orderId?: string;
  signature?: string;
  status: 'pending' | 'successful' | 'failed' | 'refunded';
  isAnonymous: boolean;
  message?: string;
  receiptNumber?: string;
  user?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    donorName: { type: String, required: [true, 'Donor name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least ₹1'],
    },
    purpose: {
      type: String,
      enum: ['education', 'healthcare', 'environment', 'general'],
      default: 'general',
    },
    paymentId: { type: String },
    orderId: { type: String },
    signature: { type: String },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed', 'refunded'],
      default: 'pending',
    },
    isAnonymous: { type: Boolean, default: false },
    message: { type: String, trim: true },
    receiptNumber: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

donationSchema.index({ status: 1 });
donationSchema.index({ purpose: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ email: 1 });

export default mongoose.model<IDonation>('Donation', donationSchema);
