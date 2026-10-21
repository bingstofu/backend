import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { authRouter } from "./routes/auth";
import { taskRouter } from "./routes/tasks";
import courseRoutes from './routes/courseRoutes';

export const app = express();

// Enable CORS for local dev and frontend deployment
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/courses', courseRoutes);


// Auto-connect to MongoDB on every serverless request
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Health Check Route
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

// Mount Routers
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `No route found for ${req.method} ${req.originalUrl}`,
  });
});

// Central Error Handling Middleware
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
      return;
    }

    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        message: `"${err.value}" is not a valid ID`,
      });
      return;
    }

    console.error("Server Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
);

export default app;