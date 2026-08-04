/* ==========================================================================
   EduVerse Studio - Test Registration Mail to Any Email
   ========================================================================== */

import dotenv from 'dotenv';
import { sendRegistrationWelcomeEmail } from './services/emailService.js';

dotenv.config();

async function testSendToCustomEmail(recipientEmail) {
  console.log(`⏳ Đang thử nghiệm gửi Gmail tới địa chỉ bất kỳ: ${recipientEmail}...`);
  
  const result = await sendRegistrationWelcomeEmail({
    name: 'Học Sinh Mới (Test)',
    email: recipientEmail,
    role: 'STUDENT',
    code: 'SV202699'
  });

  console.log('📬 Kết quả gửi Gmail tới học viên:', result);
  process.exit(0);
}

// Test with recipient email
testSendToCustomEmail('duotechcompany.hr@gmail.com');
