import type { Types } from "mongoose";

// Base User Interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

// User Document Type (stored in MongoDB)
export type UserDoc = Omit<User, "id"> & {
  password: string;
};

// Custom Resource Interface (e.g., Task)
export interface Task {
  id: string;
  userId: string;
  title: string;
  category: "work" | "personal" | "study";
  priority: number;
  completed: boolean;
  createdAt?: Date;
}

// Task Document Type for Mongoose
export type TaskDoc = Omit<Task, "id" | "userId"> & {
  userId: Types.ObjectId;
};

// Type for incoming POST payload
export type NewTaskBody = Pick<Task, "title" | "category" | "priority">;