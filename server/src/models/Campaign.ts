import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ICampaign extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  category: 'education' | 'healthcare' | 'environment' | 'community';
  location: string;
  startDate: Date;
  endDate?: Date;
  goalAmount?: number;
  raisedAmount: number;
  volunteersRequired: number;
  volunteersJoined: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String, required: [true, 'Short description is required'], maxlength: 200 },
    image: { type: String, default: '' },
    category: {
      type: String,
      enum: ['education', 'healthcare', 'environment', 'community'],
      required: [true, 'Category is required'],
    },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date },
    goalAmount: { type: Number, min: 0 },
    raisedAmount: { type: Number, default: 0, min: 0 },
    volunteersRequired: { type: Number, default: 0, min: 0 },
    volunteersJoined: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

campaignSchema.index({ status: 1 });
campaignSchema.index({ category: 1 });
campaignSchema.index({ slug: 1 });
campaignSchema.index({ createdAt: -1 });

campaignSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model<ICampaign>('Campaign', campaignSchema);
