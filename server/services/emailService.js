/* ==========================================================================
   EduVerse Studio - Gmail Email Notification Service (Nodemailer)
   ========================================================================== */

import nodemailer from 'nodemailer';

/**
 * Khởi tạo Gmail Transporter
 */
function createTransporter() {
  const user = process.env.GMAIL_USER || 'duotechcompany.hr@gmail.com';
  let pass = process.env.GMAIL_APP_PASSWORD || '';
  pass = pass.replace(/\s+/g, ''); // Remove any spaces

  if (!pass) {
    console.log('📧 [Gmail Log Mock Mode]: Chưa cấu hình GMAIL_APP_PASSWORD trong .env');
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: pass
    }
  });
}

/**
 * Gửi Email Thông Báo Đăng Ký Tài Khoản Thành Công
 */
export async function sendRegistrationWelcomeEmail(user) {
  const transporter = createTransporter();
  const roleText = user.role === 'TEACHER' ? 'Giảng Viên' : 'Học Viên';

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #6366f1; font-size: 28px; margin: 0;">🎓 EduVerse Studio</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Hệ sinh thái Học tập & Quản lý Giáo dục Thông minh</p>
      </div>

      <div style="background: rgba(30, 41, 59, 0.8); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px;">
        <h2 style="color: #10b981; font-size: 20px; margin-top: 0;">🎉 CHÀO MỪNG BẠN ĐẾN VỚI EDUVERSE!</h2>
        <p style="font-size: 15px; line-height: 1.6;">Xin chào <strong>${user.name}</strong>,</p>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
          Tài khoản của bạn đã được khởi tạo thành công trên hệ thống <strong>EduVerse Studio</strong>.
        </p>

        <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0; font-size: 14px;"><strong>Họ và tên:</strong> ${user.name}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Email đăng ký:</strong> ${user.email}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Vai trò hệ thống:</strong> <span style="color: #6366f1; font-weight: bold;">${roleText}</span></p>
          ${user.code ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Mã Sinh Viên (MSSV):</strong> ${user.code}</p>` : ''}
        </div>

        <p style="font-size: 14px; color: #94a3b8;">
          Bây giờ bạn có thể đăng nhập và truy cập vào Dashboard cá nhân của mình mọi lúc mọi nơi!
        </p>
      </div>

      <div style="text-align: center; color: #64748b; font-size: 12px;">
        <p>© 2026 EduVerse Studio. Trân trọng,</p>
        <p><strong>TS. Nguyễn Văn Thanh</strong> - Giảng viên Cao cấp</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`📩 [Mock Email Sent]: Đã giả lập gửi Email Đăng Ký tới Gmail: ${user.email}`);
    return { success: true, isMock: true };
  }

  try {
    await transporter.sendMail({
      from: `"EduVerse Studio" <${process.env.GMAIL_USER || 'duotechcompany.hr@gmail.com'}>`,
      to: user.email,
      subject: `🎉 [EduVerse Studio] Thư chào mừng & Đăng ký tài khoản thành công - ${user.name}`,
      html: htmlContent
    });
    console.log(`✅ Đã gửi email chào mừng tới Gmail: ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Lỗi gửi Email chào mừng qua Gmail:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Gửi Email Thông Báo Đăng Nhập An Toàn (Login Security Alert)
 */
export async function sendLoginSecurityAlertEmail(user, ipAddress = '127.0.0.1') {
  const transporter = createTransporter();
  const timeString = new Date().toLocaleString('vi-VN');

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #6366f1; font-size: 28px; margin: 0;">🎓 EduVerse Studio</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Thông Báo Cảnh Báo Đăng Nhập An Toàn</p>
      </div>

      <div style="background: rgba(30, 41, 59, 0.8); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px;">
        <h2 style="color: #38bdf8; font-size: 18px; margin-top: 0;">🔐 ĐĂNG NHẬP HỆ THỐNG THÀNH CÔNG</h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
          Tài khoản Gmail <strong>${user.email}</strong> vừa thực hiện đăng nhập vào hệ thống <strong>EduVerse Studio</strong>.
        </p>

        <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0; font-size: 13px;">📅 <strong>Thời gian đăng nhập:</strong> ${timeString}</p>
          <p style="margin: 4px 0; font-size: 13px;">🌐 <strong>Địa chỉ IP:</strong> ${ipAddress}</p>
          <p style="margin: 4px 0; font-size: 13px;">👤 <strong>Người đăng nhập:</strong> ${user.name} (${user.role})</p>
        </div>

        <p style="font-size: 13px; color: #f43f5e;">
          ⚠️ <em>Nếu đây không phải là thao tác của bạn, vui lòng đổi mật khẩu tài khoản ngay lập tức!</em>
        </p>
      </div>

      <div style="text-align: center; color: #64748b; font-size: 12px;">
        <p>© 2026 EduVerse Studio. Đảm bảo an toàn tài khoản.</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`📩 [Mock Email Sent]: Đã giả lập gửi Email Cảnh báo Đăng nhập tới Gmail: ${user.email}`);
    return { success: true, isMock: true };
  }

  try {
    await transporter.sendMail({
      from: `"EduVerse Security" <${process.env.GMAIL_USER || 'duotechcompany.hr@gmail.com'}>`,
      to: user.email,
      subject: `🔔 [Cảnh báo bảo mật] Thông báo đăng nhập tài khoản EduVerse Studio`,
      html: htmlContent
    });
    console.log(`✅ Đã gửi email cảnh báo đăng nhập tới Gmail: ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Lỗi gửi Email đăng nhập qua Gmail:', error.message);
    return { success: false, error: error.message };
  }
}
