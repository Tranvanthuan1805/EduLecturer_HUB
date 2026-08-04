/* ==========================================================================
   EduLecturer Hub - Course API Routes
   ========================================================================== */

import express from 'express';
import { CourseModel } from '../models/Course.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const courses = await CourseModel.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCourse = new CourseModel(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
