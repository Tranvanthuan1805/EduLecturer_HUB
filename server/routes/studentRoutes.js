/* ==========================================================================
   EduLecturer Hub - Student API Routes
   ========================================================================== */

import express from 'express';
import { StudentModel } from '../models/Student.js';

const router = express.Router();

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single student
router.get('/:id', async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create student
router.post('/', async (req, res) => {
  try {
    const newStudent = new StudentModel(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const updated = await StudentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    await StudentModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
