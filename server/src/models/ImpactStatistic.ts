import mongoose, { Document, Schema } from 'mongoose';

export interface IImpactStatistic extends Document {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  category: 'general' | 'education' | 'healthcare' | 'environment';
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const impactStatisticSchema = new Schema<IImpactStatistic>(
  {
    label: { type: String, required: [true, 'Label is required'], trim: true },
    value: { type: Number, required: [true, 'Value is required'], min: 0 },
    suffix: { type: String, default: '+', trim: true },
    icon: { type: String, default: 'heart', trim: true },
    category: {
      type: String,
      enum: ['general', 'education', 'healthcare', 'environment'],
      default: 'general',
    },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

impactStatisticSchema.index({ category: 1, order: 1 });

export default mongoose.model<IImpactStatistic>('ImpactStatistic', impactStatisticSchema);
