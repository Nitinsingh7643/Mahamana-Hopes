import mongoose, { Document, Schema } from 'mongoose';

export interface IPartnerInquiry extends Document {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  partnershipType: 'csr' | 'event' | 'knowledge' | 'resource' | 'community';
  message: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const partnerInquirySchema = new Schema<IPartnerInquiry>(
  {
    organizationName: { type: String, required: [true, 'Organization name is required'], trim: true },
    contactPerson: { type: String, required: [true, 'Contact person is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    website: { type: String, trim: true },
    partnershipType: {
      type: String,
      enum: ['csr', 'event', 'knowledge', 'resource', 'community'],
      required: [true, 'Partnership type is required'],
    },
    message: { type: String, required: [true, 'Message is required'], trim: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

partnerInquirySchema.index({ status: 1 });
partnerInquirySchema.index({ createdAt: -1 });

export default mongoose.model<IPartnerInquiry>('PartnerInquiry', partnerInquirySchema);
