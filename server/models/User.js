/* ==========================================================================
   EduVerse Studio - User Mongoose Model
   ========================================================================== */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['TEACHER', 'STUDENT'], default: 'STUDENT' },
  code: { type: String, default: '' }, // MSSV if Student
  class: { type: String, default: 'K45-CNTT' },
  avatar: { type: String, default: '' }
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);
