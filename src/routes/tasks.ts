import { Router, type Request, type Response, type NextFunction } from "express";
import { TaskModel } from "../models/task";
import { requireAuth } from "../middleware/auth";
import type { NewTaskBody } from "../types";

export const taskRouter = Router();

taskRouter.use(requireAuth);

interface IdParam {
  id: string;
}

// 1. GET ALL TASKS
taskRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await TaskModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// 2. GET SINGLE TASK BY ID
taskRouter.get("/:id", async (req: Request<IdParam>, res: Response, next: NextFunction) => {
  try {
    const task = await TaskModel.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      res.status(404).json({ message: "No task found with that ID" });
      return;
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// 3. CREATE TASK
taskRouter.post(
  "/",
  async (req: Request<unknown, unknown, NewTaskBody>, res: Response, next: NextFunction) => {
    try {
      const task = await TaskModel.create({
        ...req.body,
        userId: req.userId,
      });

      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }
);

// 4. UPDATE TASK BY ID
taskRouter.patch(
  "/:id",
  async (
    req: Request<IdParam, unknown, Partial<NewTaskBody>>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const task = await TaskModel.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true, runValidators: true }
      );

      if (!task) {
        res.status(404).json({ message: "No task found with that ID" });
        return;
      }

      res.json(task);
    } catch (err) {
      next(err);
    }
  }
);

// 5. DELETE TASK BY ID
taskRouter.delete("/:id", async (req: Request<IdParam>, res: Response, next: NextFunction) => {
  try {
    const task = await TaskModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      res.status(404).json({ message: "No task found with that ID" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});