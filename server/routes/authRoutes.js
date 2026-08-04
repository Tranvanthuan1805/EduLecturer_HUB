/* ==========================================================================
   EduVerse Studio - Authentication API Routes & Gmail Trigger
   ========================================================================== */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { StudentModel } from '../models/Student.js';
import { sendRegistrationWelcomeEmail, sendLoginSecurityAlertEmail } from '../services/emailService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'eduverse_secret_key_2026';

// 1. REGISTER USER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, code, userClass } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu' });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được sử dụng trên hệ thống!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role === 'TEACHER' ? 'TEACHER' : 'STUDENT';
    const studentCode = code || `SV${Math.floor(100000 + Math.random() * 900000)}`;
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`;

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      code: studentCode,
      class: userClass || 'K45-CNTT',
      avatar
    });

    await newUser.save();

    // If student role, also sync to StudentModel database
    if (userRole === 'STUDENT') {
      const existingStudent = await StudentModel.findOne({ code: studentCode });
      if (!existingStudent) {
        const newStudent = new StudentModel({
          code: studentCode,
          name,
          email,
          class: userClass || 'K45-CNTT',
          status: 'ACTIVE',
          enrolledCourses: ['INT2034', 'ENG102'],
          attendance: 100,
          avatar,
          grades: {}
        });
        await newStudent.save();
      }
    }

    // Send Welcome Email via Gmail API
    sendRegistrationWelcomeEmail({
      name,
      email,
      role: userRole,
      code: studentCode
    }).catch(err => console.error('Email send background error:', err));

    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Đăng ký tài khoản thành công! Thư chào mừng đã được gửi tới Gmail của bạn.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        code: newUser.code,
        class: newUser.class,
        avatar: newUser.avatar
      }
    });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký: ' + error.message });
  }
});

// 2. LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập Email và Mật khẩu' });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản với Email này!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu nhập vào không chính xác!' });
    }

    // Send Login Security Alert Email via Gmail API
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    sendLoginSecurityAlertEmail(user, clientIp).catch(err => console.error('Login email background error:', err));

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Đăng nhập thành công! Email thông báo an toàn đã được gửi tới Gmail của bạn.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        code: user.code,
        class: user.class,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập: ' + error.message });
  }
});

export default router;
