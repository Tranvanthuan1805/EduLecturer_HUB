/* ==========================================================================
   EduLecturer Hub - Gradebook Component
   ========================================================================== */

import { store } from '../store.js';

let selectedCourseId = '';

export function renderGradebook() {
  const courses = store.getCourses();
  const selectEl = document.getElementById('gradebook-course-select');
  if (!selectEl) return;

  if (courses.length > 0 && !selectedCourseId) {
    selectedCourseId = courses[0].id;
  }

  selectEl.innerHTML = courses.map(c => `
    <option value="${c.id}" ${c.id === selectedCourseId ? 'selected' : ''}>
      ${c.name} (${c.code}) - ${c.studentCount} Học viên
    </option>
  `).join('');

  selectEl.onchange = (e) => {
    selectedCourseId = e.target.value;
    renderGradebookTable();
  };

  renderGradebookTable();
}

export function renderGradebookTable() {
  const tbody = document.getElementById('gradebook-tbody');
  if (!tbody) return;

  if (!selectedCourseId) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-muted text-center">Vui lòng chọn môn học.</td></tr>`;
    return;
  }

  const allStudents = store.getStudents();
  // Filter students enrolled in the selected course
  const enrolledStudents = allStudents.filter(s => s.enrolledCourses.includes(selectedCourseId));

  if (enrolledStudents.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 24px; color: var(--text-muted);">
          Chưa có học viên nào đăng ký môn học này.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = enrolledStudents.map(s => {
    const gradeObj = (s.grades && s.grades[selectedCourseId]) ? s.grades[selectedCourseId] : {
      attendanceScore: 10,
      assignmentScore: 0,
      midtermScore: 0,
      finalScore: 0,
      comment: ''
    };

    const att = parseFloat(gradeObj.attendanceScore || 0);
    const ass = parseFloat(gradeObj.assignmentScore || 0);
    const mid = parseFloat(gradeObj.midtermScore || 0);
    const fin = parseFloat(gradeObj.finalScore || 0);

    const total = ((att * 0.1) + (ass * 0.2) + (mid * 0.3) + (fin * 0.4)).toFixed(1);

    let rankBadge = `<span class="badge badge-emerald">Giỏi / Xuất sắc</span>`;
    if (total < 5.0) rankBadge = `<span class="badge badge-rose">Yếu / Chưa đạt</span>`;
    else if (total < 7.0) rankBadge = `<span class="badge badge-warning">Trung bình</span>`;
    else if (total < 8.5) rankBadge = `<span class="badge badge-primary">Khá</span>`;

    return `
      <tr>
        <td>
          <strong style="display: block;">${s.name}</strong>
          <small class="text-muted">${s.class}</small>
        </td>
        <td><code style="font-weight: 700; color: var(--primary);">${s.code}</code></td>

        <td>
          <input type="number" min="0" max="10" step="0.5" class="grade-input" value="${att}"
            onchange="window.app.onGradeInputChange('${s.id}', '${selectedCourseId}', 'attendanceScore', this.value)" />
        </td>
        <td>
          <input type="number" min="0" max="10" step="0.5" class="grade-input" value="${ass}"
            onchange="window.app.onGradeInputChange('${s.id}', '${selectedCourseId}', 'assignmentScore', this.value)" />
        </td>
        <td>
          <input type="number" min="0" max="10" step="0.5" class="grade-input" value="${mid}"
            onchange="window.app.onGradeInputChange('${s.id}', '${selectedCourseId}', 'midtermScore', this.value)" />
        </td>
        <td>
          <input type="number" min="0" max="10" step="0.5" class="grade-input" value="${fin}"
            onchange="window.app.onGradeInputChange('${s.id}', '${selectedCourseId}', 'finalScore', this.value)" />
        </td>

        <td>
          <strong style="font-size: 1.05rem; color: ${total < 5.0 ? 'var(--rose)' : 'var(--emerald)'};">
            ${total}
          </strong>
        </td>

        <td>${rankBadge}</td>

        <td>
          <input type="text" class="comment-input" value="${gradeObj.comment || ''}" placeholder="Nhập nhận xét..."
            onchange="window.app.onGradeInputChange('${s.id}', '${selectedCourseId}', 'comment', this.value)" />
        </td>
      </tr>
    `;
  }).join('');
}
