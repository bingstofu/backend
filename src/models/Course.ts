import { Schema, model, Document } from 'mongoose';

export interface CourseDoc extends Document {
  code: string;
  title: string;
  description?: string;
  units: number;
}

const courseSchema = new Schema<CourseDoc>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    units: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Course = model<CourseDoc>('Course', courseSchema);