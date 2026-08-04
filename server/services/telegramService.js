/* ==========================================================================
   EduLecturer Hub - Telegram Bot Service
   ========================================================================== */

/**
 * Gửi thông báo đến Telegram qua Telegram Bot API
 * @param {string} text Nội dung tin nhắn
 */
export async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token.includes('YourTelegramBotTokenHere')) {
    console.log('📱 [Telegram Log Mock]: Bot Token chưa được cấu hình. Nội dung tin nhắn:');
    console.log(text);
    return { success: false, reason: 'TOKEN_NOT_CONFIGURED', mockSent: true };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    return { success: data.ok, data };
  } catch (error) {
    console.error('❌ Lỗi khi gửi Telegram:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Bắn thông báo Cảnh báo Học viên nguy cơ qua Telegram
 */
export async function sendRiskStudentAlert(student, reason) {
  const message = `
🚨 <b>CẢNH BÁO HỌC VIÊN CẦN HỖ TRỢ GẤP</b> 🚨
----------------------------------------
👤 <b>Học viên:</b> ${student.name} (${student.code})
🏫 <b>Lớp:</b> ${student.class}
📧 <b>Email:</b> ${student.email}
⚠️ <b>Lý do cảnh báo:</b> ${reason}
📅 <b>Thời gian báo cáo:</b> ${new Date().toLocaleString('vi-VN')}
----------------------------------------
👉 <i>Vui lòng liên hệ hỗ trợ hoặc gửi nhắc nhở tới học viên trên hệ thống EduLecturer Hub!</i>
  `;

  return await sendTelegramMessage(message);
}

/**
 * Bắn thông báo Lịch dạy & Việc cần làm trong ngày
 */
export async function sendDailyTaskSummary(tasks) {
  const pendingTasks = tasks.filter(t => t.status !== 'DONE');
  const taskListText = pendingTasks.map((t, idx) => `${idx + 1}. <b>[${t.priority}]</b> ${t.title} (Hạn: ${t.dueDate})`).join('\n');

  const message = `
📊 <b>BÁO CÁO CÔNG VIỆC GIẢNG VIÊN HÔM NAY</b> 📊
----------------------------------------
📝 <b>Tổng số công việc cần xử lý:</b> ${pendingTasks.length} việc
\n${taskListText}
----------------------------------------
💪 <i>Chúc Thầy Thanh một ngày làm việc hiệu quả và thành công!</i>
  `;

  return await sendTelegramMessage(message);
}
