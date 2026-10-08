import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IStory extends Document {
  title: string;
  slug: string;
  featuredImage: string;
  category: 'education' | 'healthcare' | 'environment' | 'community';
  author: string;
  content: string;
  excerpt: string;
  impactStats?: { label: string; value: string }[];
  location?: string;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true },
    featuredImage: { type: String, default: '' },
    category: {
      type: String,
      enum: ['education', 'healthcare', 'environment', 'community'],
      required: [true, 'Category is required'],
    },
    author: { type: String, required: [true, 'Author is required'], trim: true },
    content: { type: String, required: [true, 'Content is required'] },
    excerpt: { type: String, required: [true, 'Excerpt is required'], maxlength: 300 },
    impactStats: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    location: { type: String, trim: true },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

storySchema.index({ slug: 1 });
storySchema.index({ category: 1 });
storySchema.index({ isPublished: 1 });
storySchema.index({ createdAt: -1 });

storySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model<IStory>('Story', storySchema);
