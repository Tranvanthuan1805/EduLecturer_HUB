/* ==========================================================================
   EduLecturer Hub - Google Sheets Integration Service
   ========================================================================== */

/**
 * Đẩy dữ liệu bảng điểm học viên lên Google Sheets qua Webhook (Google Apps Script)
 * @param {Array} gradebookData Danh sách điểm số của môn học
 * @param {string} courseName Tên môn học
 */
export async function syncGradebookToGoogleSheets(gradebookData, courseName) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  const payload = {
    action: 'SYNC_GRADEBOOK',
    courseName: courseName,
    exportedAt: new Date().toISOString(),
    records: gradebookData
  };

  if (!webhookUrl || webhookUrl.includes('YourGoogleAppsScriptDeploymentId')) {
    console.log('📊 [Google Sheets Sync Mock]: Webhook URL chưa được cấu hình. Dữ liệu Payload chuẩn bị gửi:');
    console.log(payload);
    return { success: true, isMock: true, recordCount: gradebookData.length, message: 'Chế độ xem trước Payload Google Sheets' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    console.error('❌ Lỗi kết nối Google Sheets Webhook:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Tạo dữ liệu CSV tiêu chuẩn để tải về mở trực tiếp bằng Google Sheets / Excel
 */
export function generateGradebookCSV(students, courseId, courseName) {
  const headers = ['STT', 'MSSV', 'Họ và Tên', 'Lớp', 'Môn Học', 'Chuyên Cần (10%)', 'Bài Tập (20%)', 'Giữa Kỳ (30%)', 'Cuối Kỳ (40%)', 'ĐTB Môn', 'Nhận Xét'];
  
  const rows = students.map((s, idx) => {
    const grades = (s.grades && s.grades[courseId]) ? s.grades[courseId] : {
      attendanceScore: 10, assignmentScore: 0, midtermScore: 0, finalScore: 0, comment: ''
    };
    const att = parseFloat(grades.attendanceScore || 0);
    const ass = parseFloat(grades.assignmentScore || 0);
    const mid = parseFloat(grades.midtermScore || 0);
    const fin = parseFloat(grades.finalScore || 0);
    const total = ((att * 0.1) + (ass * 0.2) + (mid * 0.3) + (fin * 0.4)).toFixed(1);

    return [
      idx + 1,
      `"${s.code}"`,
      `"${s.name}"`,
      `"${s.class}"`,
      `"${courseName}"`,
      att,
      ass,
      mid,
      fin,
      total,
      `"${grades.comment || ''}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
