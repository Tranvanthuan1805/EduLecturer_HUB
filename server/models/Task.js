/* ==========================================================================
   EduLecturer Hub - Task Mongoose Model
   ========================================================================== */

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: String, default: '' },
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'], default: 'TODO' }
}, { timestamps: true });

export const TaskModel = mongoose.model('Task', taskSchema);
