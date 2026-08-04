/* ==========================================================================
   EduLecturer Hub - Courses Component
   ========================================================================== */

import { store } from '../store.js';

export function renderCourses() {
  const container = document.getElementById('courses-grid-container');
  if (!container) return;

  const courses = store.getCourses();
  const allStudents = store.getStudents();

  if (courses.length === 0) {
    container.innerHTML = `
      <div style="grid-column: span 3; text-align: center; padding: 40px; color: var(--text-muted);" class="glass-panel">
        <i class="fa-solid fa-book-open" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
        Chưa có môn học nào. Hãy nhấn nút "Thêm Môn Học Mới" để tạo môn giảng dạy đầu tiên!
      </div>
    `;
    return;
  }

  container.innerHTML = courses.map(c => {
    const enrolledStudents = allStudents.filter(s => s.enrolledCourses.includes(c.id));
    const avatars = enrolledStudents.slice(0, 4).map(s => 
      `<img src="${s.avatar}" alt="${s.name}" title="${s.name}" style="width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--bg-sidebar); margin-left: -8px;" />`
    ).join('');

    const extraCount = enrolledStudents.length > 4 ? enrolledStudents.length - 4 : 0;

    return `
      <div class="course-card glass-panel">
        <div class="course-header">
          <div>
            <span class="course-code" style="color: ${c.color};">${c.code}</span>
            <h3 class="course-title">${c.name}</h3>
          </div>
          <span class="badge badge-primary" style="background: ${c.color}22; color: ${c.color};">
            ${c.studentCount} Sinh viên
          </span>
        </div>

        <p class="text-muted" style="font-size: 0.82rem; margin: 8px 0 16px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${c.description || 'Chương trình giảng dạy chính thức dành cho sinh viên chuyên ngành.'}
        </p>

        <div class="course-meta-tags">
          <span class="badge badge-secondary"><i class="fa-solid fa-layer-group"></i> ${c.classCount}</span>
          <span class="badge badge-warning"><i class="fa-regular fa-clock"></i> ${c.schedule}</span>
        </div>

        <div class="course-footer">
          <div style="display: flex; align-items: center; padding-left: 8px;">
            ${avatars}
            ${extraCount > 0 ? `<span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); margin-left: 6px;">+${extraCount}</span>` : ''}
          </div>

          <button class="btn btn-sm btn-ghost" onclick="window.app.filterStudentsByCourse('${c.id}')">
            <span>Danh sách lớp</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}
