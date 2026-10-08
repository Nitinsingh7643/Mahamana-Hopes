import mongoose, { Document, Schema } from 'mongoose';

export interface IVolunteer extends Document {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  occupation: string;
  skills: string[];
  areasOfInterest: string[];
  availability: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  adminNotes?: string;
  user?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const volunteerSchema = new Schema<IVolunteer>(
  {
    fullName: { type: String, required: [true, 'Full name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [16, 'Must be at least 16 years old'],
    },
    occupation: { type: String, required: [true, 'Occupation is required'], trim: true },
    skills: [{ type: String, trim: true }],
    areasOfInterest: {
      type: [String],
      required: [true, 'At least one area of interest is required'],
      enum: [
        'Education',
        'Healthcare',
        'Environment',
        'Events',
        'Fundraising',
        'Social Media',
        'Technology',
        'Photography/Videography',
      ],
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
      enum: ['weekdays', 'weekends', 'both', 'flexible'],
    },
    motivation: {
      type: String,
      required: [true, 'Please share why you want to volunteer'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'active'],
      default: 'pending',
    },
    adminNotes: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

volunteerSchema.index({ status: 1 });
volunteerSchema.index({ email: 1 });
volunteerSchema.index({ createdAt: -1 });

export default mongoose.model<IVolunteer>('Volunteer', volunteerSchema);
