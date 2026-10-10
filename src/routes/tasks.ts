import { Router, type Request, type Response } from "express";
import { TaskModel } from "../models/task";
import { requireAuth } from "../middleware/auth";
import type { NewTaskBody } from "../types/index";

// 🔴 MUST HAVE `export const taskRouter` (NOT `const taskRouter` or `export const router`)
export const taskRouter = Router();

taskRouter.use(requireAuth);

interface IdParam {
  id: string;
}

// 1. GET ALL
taskRouter.get("/", async (req: Request, res: Response) => {
  const tasks = await TaskModel.find({ userId: req.userId }).sort({
    createdAt: -1,
  });
  res.json(tasks);
});

// 2. GET SINGLE BY ID
taskRouter.get("/:id", async (req: Request<IdParam>, res: Response) => {
  const task = await TaskModel.findOne({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!task) {
    res.status(404).json({ message: "No task with that id" });
    return;
  }

  res.json(task);
});

// 3. CREATE NEW
taskRouter.post(
  "/",
  async (req: Request<unknown, unknown, NewTaskBody>, res: Response) => {
    const task = await TaskModel.create({
      ...req.body,
      userId: req.userId,
    });

    res.status(201).json(task);
  }
);

// 4. UPDATE BY ID
taskRouter.patch(
  "/:id",
  async (
    req: Request<IdParam, unknown, Partial<NewTaskBody>>,
    res: Response
  ) => {
    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ message: "No task with that id" });
      return;
    }

    res.json(task);
  }
);

// 5. DELETE BY ID
taskRouter.delete("/:id", async (req: Request<IdParam>, res: Response) => {
  const task = await TaskModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!task) {
    res.status(404).json({ message: "No task with that id" });
    return;
  }

  res.status(204).send();
});