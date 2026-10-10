import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth";
import { taskRouter } from "./routes/tasks"; // 👈 Imports taskRouter

export const app = express();

app.use(cors());
app.use(express.json());

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
    message: `No route for ${req.method}${req.originalUrl}`,
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
        message: `"${err.value}" is not a valid id`,
      });
      return;
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
);