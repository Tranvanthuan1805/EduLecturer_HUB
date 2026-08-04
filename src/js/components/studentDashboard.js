/* ==========================================================================
   EduVerse Studio - Student Dashboard Component
   ========================================================================== */

import { store } from '../store.js';

let activeStudentId = '';

export function renderStudentDashboard(overrideStudentId = null) {
  const container = document.getElementById('view-student-portal');
  if (!container) return;

  const students = store.getStudents();
  if (students.length === 0) {
    container.innerHTML = `
      <div class="glass-panel" style="padding: 40px; text-align: center; color: var(--text-muted);">
        Chưa có dữ liệu học viên trong hệ thống.
      </div>
    `;
    return;
  }

  if (overrideStudentId) {
    activeStudentId = overrideStudentId;
  } else if (!activeStudentId || !students.find(s => s.id === activeStudentId)) {
    activeStudentId = students[0].id;
  }

  const currentStudent = store.getStudentById(activeStudentId);
  const gpa = store.calculateStudentGPA(currentStudent);
  const enrolledCount = currentStudent.enrolledCourses.length;

  // Render Student Selector & Header
  const studentOptionsHtml = students.map(s => `
    <option value="${s.id}" ${s.id === activeStudentId ? 'selected' : ''}>
      🎓 ${s.name} (${s.code} - Lớp ${s.class})
    </option>
  `).join('');

  // Course Cards HTML
  const courseCardsHtml = currentStudent.enrolledCourses.map(cId => {
    const course = store.getCourseById(cId);
    if (!course) return '';

    const grade = (currentStudent.grades && currentStudent.grades[cId]) ? currentStudent.grades[cId] : {
      attendanceScore: 10, assignmentScore: 0, midtermScore: 0, finalScore: 0, comment: ''
    };
    const att = parseFloat(grade.attendanceScore || 0);
    const ass = parseFloat(grade.assignmentScore || 0);
    const mid = parseFloat(grade.midtermScore || 0);
    const fin = parseFloat(grade.finalScore || 0);
    const courseGPA = ((att * 0.1) + (ass * 0.2) + (mid * 0.3) + (fin * 0.4)).toFixed(1);

    return `
      <div class="glass-panel" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid ${course.color};">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span class="badge badge-primary" style="background: ${course.color}22; color: ${course.color}; font-weight: 800;">${course.code}</span>
            <span class="badge badge-emerald">Đang diễn ra</span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 6px;">${course.name}</h3>
          <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 12px;"><i class="fa-regular fa-clock"></i> ${course.schedule}</p>
        </div>

        <div style="padding-top: 12px; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.78rem; color: var(--text-muted);">ĐTB Môn Học:</span>
          <strong style="font-size: 1.1rem; color: ${courseGPA < 5.0 ? 'var(--rose)' : 'var(--emerald)'};">${courseGPA} / 10</strong>
        </div>
      </div>
    `;
  }).join('');

  // Transcript Table Rows
  const transcriptRowsHtml = currentStudent.enrolledCourses.map(cId => {
    const course = store.getCourseById(cId);
    if (!course) return '';

    const g = (currentStudent.grades && currentStudent.grades[cId]) ? currentStudent.grades[cId] : {
      attendanceScore: 10, assignmentScore: 0, midtermScore: 0, finalScore: 0, comment: ''
    };
    const att = parseFloat(g.attendanceScore || 0);
    const ass = parseFloat(g.assignmentScore || 0);
    const mid = parseFloat(g.midtermScore || 0);
    const fin = parseFloat(g.finalScore || 0);
    const total = ((att * 0.1) + (ass * 0.2) + (mid * 0.3) + (fin * 0.4)).toFixed(1);

    let statusBadge = `<span class="badge badge-emerald">Đạt môn (Giỏi)</span>`;
    if (total < 5.0) statusBadge = `<span class="badge badge-rose">Nguy cơ cấm thi / Thi lại</span>`;
    else if (total < 7.0) statusBadge = `<span class="badge badge-warning">Khá / Trung bình</span>`;

    return `
      <tr>
        <td>
          <strong style="display: block;">${course.name}</strong>
          <code style="color: ${course.color}; font-weight: 700;">${course.code}</code>
        </td>
        <td class="text-center"><strong>${att}</strong></td>
        <td class="text-center"><strong>${ass}</strong></td>
        <td class="text-center"><strong>${mid}</strong></td>
        <td class="text-center"><strong>${fin}</strong></td>
        <td class="text-center">
          <strong style="font-size: 1.1rem; color: ${total < 5.0 ? 'var(--rose)' : 'var(--emerald)'};">${total}</strong>
        </td>
        <td>${statusBadge}</td>
        <td>
          <span style="font-style: italic; color: var(--text-sub); font-size: 0.83rem;">
            ${g.comment ? `"${g.comment}"` : 'Chưa có nhận xét từ Thầy/Cô'}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  // Resources & Submissions
  const studentResources = store.getResources();
  const studentSubmissions = store.getSubmissions(null, activeStudentId);

  const resourcesHtml = studentResources.length === 0 ? '<p class="text-muted" style="font-size: 0.85rem;">Chưa có tài liệu nào.</p>' :
    studentResources.map(r => {
      const course = store.getCourseById(r.courseId);
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-card-hover); border-radius: var(--radius-sm); margin-bottom: 8px;">
          <div>
            <strong style="display: block; font-size: 0.88rem;"><i class="fa-solid fa-file-pdf text-rose"></i> ${r.title}</strong>
            <small class="text-muted">${course ? course.name : 'Chung'} | Ngày đăng: ${r.uploadedAt}</small>
          </div>
          <a href="${r.url}" target="_blank" class="btn btn-sm btn-secondary"><i class="fa-solid fa-download"></i> Tải về</a>
        </div>
      `;
    }).join('');

  const submissionsHtml = studentSubmissions.length === 0 ? '<p class="text-muted" style="font-size: 0.85rem;">Chưa có bài tập nào đã nộp.</p>' :
    studentSubmissions.map(sub => {
      const course = store.getCourseById(sub.courseId);
      const isGraded = sub.status === 'GRADED';
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-card-hover); border-radius: var(--radius-sm); margin-bottom: 8px;">
          <div>
            <strong style="display: block; font-size: 0.88rem;">${sub.title}</strong>
            <small class="text-muted">${course ? course.name : 'Môn học'} | Nộp lúc: ${sub.submittedAt}</small>
          </div>
          <div>
            ${isGraded ? `<span class="badge badge-emerald" style="font-size:0.85rem;">${sub.score} / 10 Điểm</span>` : `<span class="badge badge-warning">Đang chờ chấm</span>`}
            <a href="${sub.link}" target="_blank" class="btn btn-sm btn-ghost"><i class="fa-solid fa-link"></i> Xem bài</a>
          </div>
        </div>
      `;
    }).join('');

  container.innerHTML = `
    <!-- Student Header & Selector -->
    <div class="toolbar glass-panel" style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <img src="${currentStudent.avatar}" alt="${currentStudent.name}" style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--primary);" />
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 800;">Portal Học Viên: ${currentStudent.name}</h2>
          <p class="text-muted" style="font-size: 0.82rem;">MSSV: <strong>${currentStudent.code}</strong> | Lớp sinh hoạt: <strong>${currentStudent.class}</strong></p>
        </div>
      </div>

      <div class="select-wrap">
        <label><i class="fa-solid fa-user-gear"></i> Xem giao diện của học sinh khác:</label>
        <select id="student-portal-selector" class="custom-select">
          ${studentOptionsHtml}
        </select>
      </div>
    </div>

    <!-- Student KPI Stats -->
    <div class="stats-grid" style="margin-bottom: 28px;">
      <div class="stat-card glass-panel">
        <div class="stat-icon bg-indigo-soft"><i class="fa-solid fa-book-open"></i></div>
        <div class="stat-details">
          <span class="stat-label">Môn Học Đã Đăng Ký</span>
          <h2 class="stat-value">${enrolledCount} Môn</h2>
          <span class="stat-sub">Đang theo học kỳ này</span>
        </div>
      </div>

      <div class="stat-card glass-panel">
        <div class="stat-icon bg-emerald-soft"><i class="fa-solid fa-award"></i></div>
        <div class="stat-details">
          <span class="stat-label">Điểm Tích Lũy (ĐTB)</span>
          <h2 class="stat-value" style="color: ${gpa < 5.0 ? 'var(--rose)' : 'var(--emerald)'};">${gpa}</h2>
          <span class="stat-trend positive"><i class="fa-solid fa-chart-line"></i> Xếp loại học lực khá/giỏi</span>
        </div>
      </div>

      <div class="stat-card glass-panel">
        <div class="stat-icon bg-amber-soft"><i class="fa-solid fa-user-check"></i></div>
        <div class="stat-details">
          <span class="stat-label">Tỷ Lệ Chuyên Cần</span>
          <h2 class="stat-value">${currentStudent.attendance}%</h2>
          <span class="stat-trend ${currentStudent.attendance < 80 ? 'warning' : 'positive'}">
            ${currentStudent.attendance < 80 ? '⚠️ Cảnh báo vắng' : '✓ Chuyên cần tốt'}
          </span>
        </div>
      </div>

      <div class="stat-card glass-panel">
        <div class="stat-icon bg-rose-soft"><i class="fa-solid fa-paper-plane"></i></div>
        <div class="stat-details">
          <span class="stat-label">Thông Báo Telegram</span>
          <h2 class="stat-value" style="font-size: 1.1rem; margin-top: 4px;">Đã Bật Notification</h2>
          <span class="stat-sub">Nhận điểm & nhắc lịch tức thì</span>
        </div>
      </div>
    </div>

    <!-- Enrolled Courses Grid -->
    <h3 style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
      <i class="fa-solid fa-graduation-cap text-indigo"></i> Môn Học Đang Theo Học
    </h3>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px;">
      ${courseCardsHtml}
    </div>

    <!-- Student Resources & Homework Submissions Section -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
      <!-- Downloadable Resources -->
      <div class="panel glass-panel">
        <div class="panel-header">
          <h3 class="panel-title"><i class="fa-solid fa-folder-open text-indigo"></i> Tài Liệu Bài Giảng & Slide</h3>
        </div>
        <div>
          ${resourcesHtml}
        </div>
      </div>

      <!-- Homework Submissions -->
      <div class="panel glass-panel">
        <div class="panel-header">
          <h3 class="panel-title"><i class="fa-solid fa-cloud-arrow-up text-emerald"></i> Lịch Sử Nộp Bài Tập</h3>
          <button class="btn btn-sm btn-primary" onclick="window.app.openSubmitHomeworkModal('${activeStudentId}')">
            <i class="fa-solid fa-plus"></i> Nộp Bài Tập Mới
          </button>
        </div>
        <div>
          ${submissionsHtml}
        </div>
      </div>
    </div>

    <!-- Grade Transcript & Teacher Notes -->
    <div class="panel glass-panel">
      <div class="panel-header">
        <div>
          <h3 class="panel-title"><i class="fa-solid fa-file-signature text-emerald"></i> Bảng Điểm Cá Nhân & Nhận Xét Từ Thầy Thanh</h3>
          <p class="panel-sub">Kết quả đánh giá định kỳ các cột điểm và đánh giá tư duy học tập</p>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="window.print()">
          <i class="fa-solid fa-print"></i> In kết quả
        </button>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Môn Học</th>
              <th class="text-center">Chuyên Cần (10%)</th>
              <th class="text-center">Bài Tập (20%)</th>
              <th class="text-center">Giữa Kỳ (30%)</th>
              <th class="text-center">Cuối Kỳ (40%)</th>
              <th class="text-center">ĐTB Môn</th>
              <th>Trạng Thái</th>
              <th>Nhận Xét Của Giảng Viên</th>
            </tr>
          </thead>
          <tbody>
            ${transcriptRowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Bind Student Selector dropdown
  const selectorEl = document.getElementById('student-portal-selector');
  if (selectorEl) {
    selectorEl.onchange = (e) => {
      renderStudentDashboard(e.target.value);
    };
  }
}
