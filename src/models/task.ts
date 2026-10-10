import { Schema, model } from "mongoose";
import type { TaskDoc } from "../types/index.js";

const taskSchema = new Schema<TaskDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Rule 1: Required
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    // Rule 2: Enum / Match
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["work", "personal", "study"],
        message: "Category must be work, personal, or study",
      },
    },
    // Rule 3: Min / Max numerical range
    priority: {
      type: Number,
      required: [true, "Priority is required"],
      min: [1, "Priority must be at least 1"],
      max: [5, "Priority cannot exceed 5"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

taskSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const TaskModel = model<TaskDoc>("Task", taskSchema);