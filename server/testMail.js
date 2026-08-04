/* ==========================================================================
   EduVerse Studio - Gmail Connection Test Script
   ========================================================================== */

import dotenv from 'dotenv';
import { sendRegistrationWelcomeEmail, sendLoginSecurityAlertEmail } from './services/emailService.js';

dotenv.config();

async function test() {
  process.env.GMAIL_USER = 'tranvanthuan2005tt@gmail.com';
  console.log(`⏳ Đang thử nghiệm gửi Gmail qua tài khoản: ${process.env.GMAIL_USER}...`);
  
  const result = await sendRegistrationWelcomeEmail({
    name: 'Thầy Thanh (Test)',
    email: process.env.GMAIL_USER,
    role: 'TEACHER',
    code: 'GV2026'
  });

  console.log('📬 Kết quả gửi Gmail chào mừng:', result);
  process.exit(0);
}

test();
