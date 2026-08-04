/* ==========================================================================
   EduLecturer Hub - Students Component
   ========================================================================== */

import { store } from '../store.js';

let currentCourseFilter = 'ALL';
let currentStatusFilter = 'ALL';
let currentSearchQuery = '';

export function renderStudents() {
  populateCourseFilterDropdown();
  renderStudentsTable();
}

function populateCourseFilterDropdown() {
  const courses = store.getCourses();
  const selectEl = document.getElementById('student-filter-course');
  if (!selectEl) return;

  const currentVal = selectEl.value;
  selectEl.innerHTML = `<option value="ALL">Tất cả các môn học (${courses.length})</option>` +
    courses.map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('');
  selectEl.value = currentVal || 'ALL';
}

export function renderStudentsTable() {
  const tbody = document.getElementById('students-table-body');
  if (!tbody) return;

  let students = store.getStudents();

  // Apply course filter
  if (currentCourseFilter !== 'ALL') {
    students = students.filter(s => s.enrolledCourses.includes(currentCourseFilter));
  }

  // Apply status filter
  if (currentStatusFilter !== 'ALL') {
    students = students.filter(s => s.status === currentStatusFilter);
  }

  // Apply search query
  if (currentSearchQuery.trim() !== '') {
    const q = currentSearchQuery.toLowerCase();
    students = students.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.class.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }

  if (students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 2.2rem; margin-bottom: 10px; display: block;"></i>
          Không tìm thấy học viên phù hợp với bộ lọc.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = students.map(s => {
    const gpa = store.calculateStudentGPA(s);
    
    // Status Badge
    let statusBadge = `<span class="badge badge-emerald">Đang học tốt</span>`;
    if (s.status === 'WARNING') statusBadge = `<span class="badge badge-rose">Cần hỗ trợ</span>`;
    if (s.status === 'COMPLETED') statusBadge = `<span class="badge badge-primary">Đã hoàn thành</span>`;

    // Enrolled Course Tags
    const enrolledTags = s.enrolledCourses.map(cId => {
      const course = store.getCourseById(cId);
      return course ? `<span class="badge badge-secondary" style="margin-right: 4px; margin-bottom: 4px;">${course.code}</span>` : '';
    }).join('');

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${s.avatar}" alt="${s.name}" style="width: 38px; height: 38px; border-radius: 50%;" />
            <div>
              <strong style="display: block; font-size: 0.9rem;">${s.name}</strong>
              <small class="text-muted">${s.email}</small>
            </div>
          </div>
        </td>
        <td><code style="font-weight: 700; color: var(--primary);">${s.code}</code></td>
        <td><div style="max-width: 220px; display: flex; flex-wrap: wrap;">${enrolledTags}</div></td>
        <td><strong>${s.class}</strong></td>
        <td>
          <span style="font-weight: 700; color: ${s.attendance < 80 ? 'var(--rose)' : 'var(--emerald)'};">
            ${s.attendance}%
          </span>
        </td>
        <td>
          <span style="font-weight: 800; font-size: 0.95rem; color: ${gpa < 5.0 ? 'var(--rose)' : 'var(--emerald)'};">
            ${gpa}
          </span>
        </td>
        <td>${statusBadge}</td>
        <td class="text-right">
          <button class="btn btn-sm btn-secondary" title="Xem & Chỉnh sửa chi tiết" onclick="window.app.openStudentDetail('${s.id}')">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn btn-sm btn-danger" title="Xóa học viên" onclick="window.app.confirmDeleteStudent('${s.id}', '${s.name}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

export function initStudentFilters() {
  const courseSelect = document.getElementById('student-filter-course');
  const statusSelect = document.getElementById('student-filter-status');
  const searchInput = document.getElementById('student-search-input');

  if (courseSelect) {
    courseSelect.addEventListener('change', (e) => {
      currentCourseFilter = e.target.value;
      renderStudentsTable();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      currentStatusFilter = e.target.value;
      renderStudentsTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderStudentsTable();
    });
  }
}
