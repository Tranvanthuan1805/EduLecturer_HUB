/* ==========================================================================
   EduLecturer Hub - Course Mongoose Model
   ========================================================================== */

import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  classCount: { type: String, default: '1 lớp' },
  studentCount: { type: Number, default: 0 },
  schedule: { type: String, default: 'Chưa xếp lịch' },
  color: { type: String, default: '#6366f1' },
  description: { type: String, default: '' }
}, { timestamps: true });

export const CourseModel = mongoose.model('Course', courseSchema);
