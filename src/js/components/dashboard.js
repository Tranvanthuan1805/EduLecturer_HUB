/* ==========================================================================
   EduLecturer Hub - Dashboard Component
   ========================================================================== */

import { store } from '../store.js';

export function renderDashboard() {
  const students = store.getStudents();
  const courses = store.getCourses();
  const tasks = store.getTasks();

  // 1. Calculate Stats
  const totalStudents = students.length;
  const totalCourses = courses.length;
  const pendingTasks = tasks.filter(t => t.status !== 'DONE').length;

  let totalGPA = 0;
  students.forEach(s => {
    totalGPA += parseFloat(store.calculateStudentGPA(s));
  });
  const avgScore = totalStudents > 0 ? (totalGPA / totalStudents).toFixed(1) : '0.0';

  // Update Stat Elements
  document.getElementById('stat-students-count').textContent = totalStudents;
  document.getElementById('stat-courses-count').textContent = totalCourses;
  document.getElementById('stat-tasks-count').textContent = pendingTasks;
  document.getElementById('stat-avg-score').textContent = avgScore;

  // 2. Render Risk / Need Attention Students
  const riskStudentsListEl = document.getElementById('risk-students-list');
  const riskStudents = students.filter(s => s.status === 'WARNING' || s.attendance < 75 || parseFloat(store.calculateStudentGPA(s)) < 5.0);

  if (riskStudents.length === 0) {
    riskStudentsListEl.innerHTML = `
      <div class="empty-state text-muted" style="padding: 20px; text-align: center;">
        <i class="fa-solid fa-circle-check text-emerald" style="font-size: 2rem; margin-bottom: 8px;"></i>
        <p>Tất cả học viên đều đang duy trì phong độ học tập tốt!</p>
      </div>
    `;
  } else {
    riskStudentsListEl.innerHTML = riskStudents.map(s => {
      const gpa = store.calculateStudentGPA(s);
      let reason = 'Cần hỗ trợ học tập';
      if (s.attendance < 75) reason = `Vắng nhiều (${s.attendance}% chuyên cần)`;
      else if (gpa < 5.0) reason = `ĐTB thấp (${gpa} điểm)`;

      return `
        <div class="risk-item">
          <div class="student-meta">
            <img src="${s.avatar}" alt="${s.name}" class="student-avatar" />
            <div class="student-info">
              <h4>${s.name} <span class="badge badge-rose" style="font-size:0.65rem;">${s.code}</span></h4>
              <p>Lớp: ${s.class} | ${s.enrolledCourses.length} môn học</p>
            </div>
          </div>
          <div class="risk-action" style="display: flex; gap: 6px; align-items: center;">
            <span class="risk-reason">${reason}</span>
            <button class="btn btn-sm btn-secondary" onclick="window.app.openStudentDetail('${s.id}')">
              <i class="fa-solid fa-eye"></i> Xem
            </button>
            <button class="btn btn-sm btn-danger" title="Gửi thông báo Telegram" onclick="window.app.sendTelegramRiskAlert('${s.id}')">
              <i class="fa-paper-plane fa-solid"></i> Telegram
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 3. Render Today Tasks Checklist
  const todayTasksListEl = document.getElementById('dashboard-tasks-list');
  const urgentTasks = tasks.filter(t => t.status !== 'DONE').slice(0, 5);

  if (urgentTasks.length === 0) {
    todayTasksListEl.innerHTML = `
      <div class="empty-state text-muted" style="padding: 20px; text-align: center;">
        <i class="fa-solid fa-sparkles text-amber" style="font-size: 1.8rem; margin-bottom: 8px;"></i>
        <p>Đã hoàn thành toàn bộ công việc!</p>
      </div>
    `;
  } else {
    todayTasksListEl.innerHTML = urgentTasks.map(t => {
      const course = store.getCourseById(t.courseId);
      const courseName = course ? course.name : 'Công việc chung';
      const isDone = t.status === 'DONE';

      return `
        <div class="today-task-item ${isDone ? 'done' : ''}">
          <input type="checkbox" class="custom-checkbox" ${isDone ? 'checked' : ''} onchange="window.app.toggleTaskDone('${t.id}', this.checked)" />
          <div style="flex: 1;">
            <span style="font-weight: 600; display: block;">${t.title}</span>
            <small class="text-muted" style="font-size: 0.72rem;"><i class="fa-solid fa-book"></i> ${courseName} | Hạn: ${t.dueDate}</small>
          </div>
        </div>
      `;
    }).join('');
  }

  // 4. Render Course Distribution Bars
  const distributionContainer = document.getElementById('course-distribution-bars');
  const maxStudents = Math.max(...courses.map(c => c.studentCount), 1);

  distributionContainer.innerHTML = courses.map(c => {
    const percentage = Math.round((c.studentCount / totalStudents) * 100) || 0;
    const barWidth = Math.round((c.studentCount / maxStudents) * 100);

    return `
      <div class="dist-bar-item">
        <div class="dist-info">
          <span><i class="fa-solid fa-bookmark" style="color: ${c.color}; margin-right: 6px;"></i> ${c.name} (${c.code})</span>
          <span>${c.studentCount} Học viên (${percentage}%)</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${barWidth}%; background: linear-gradient(90deg, ${c.color}, var(--primary));"></div>
        </div>
      </div>
    `;
  }).join('');
}
