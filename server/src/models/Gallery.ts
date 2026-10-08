import mongoose, { Document, Schema } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  publicId?: string;
  category: 'education' | 'healthcare' | 'environment' | 'events' | 'volunteers' | 'community';
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGalleryItem>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: [true, 'Image URL is required'] },
    publicId: { type: String },
    category: {
      type: String,
      enum: ['education', 'healthcare', 'environment', 'events', 'volunteers', 'community'],
      required: [true, 'Category is required'],
    },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1 });
gallerySchema.index({ order: 1 });

export default mongoose.model<IGalleryItem>('Gallery', gallerySchema);
