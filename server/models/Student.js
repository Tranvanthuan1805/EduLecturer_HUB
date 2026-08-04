/* ==========================================================================
   EduLecturer Hub - Student Mongoose Model
   ========================================================================== */

import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  attendanceScore: { type: Number, default: 10, min: 0, max: 10 },
  assignmentScore: { type: Number, default: 0, min: 0, max: 10 },
  midtermScore: { type: Number, default: 0, min: 0, max: 10 },
  finalScore: { type: Number, default: 0, min: 0, max: 10 },
  comment: { type: String, default: '' }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  class: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'WARNING', 'COMPLETED'], default: 'ACTIVE' },
  enrolledCourses: [{ type: String }], // Array of course codes/IDs
  attendance: { type: Number, default: 100, min: 0, max: 100 },
  avatar: { type: String, default: '' },
  grades: {
    type: Map,
    of: gradeSchema
  }
}, { timestamps: true });

export const StudentModel = mongoose.model('Student', studentSchema);
