import type { Types } from "mongoose";

// Base User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

// User Document Type for MongoDB
export type UserDoc = Omit<User, "id"> & {
  password?: string;
};

// Task Interface
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

// Request Body for Creating Tasks
export type NewTaskBody = Pick<Task, "title" | "category" | "priority">;