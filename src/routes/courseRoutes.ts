import { Router } from 'express';
import { Course } from '../models/Course';

const router = Router();

// GET /api/courses - Fetch all courses
router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ code: 1 });
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

// GET /api/courses/:code - Fetch single course by code
router.get('/:code', async (req, res, next) => {
  try {
    const course = await Course.findOne({ code: req.params.code.toUpperCase() });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
});

export default router;