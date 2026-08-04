/* ==========================================================================
   EduLecturer Hub - Tasks (Kanban) Component
   ========================================================================== */

import { store } from '../store.js';

export function renderTasks() {
  const tasks = store.getTasks();

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const reviewTasks = tasks.filter(t => t.status === 'REVIEW');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  // Update counts
  document.getElementById('count-todo').textContent = todoTasks.length;
  document.getElementById('count-in-progress').textContent = inProgressTasks.length;
  document.getElementById('count-review').textContent = reviewTasks.length;
  document.getElementById('count-done').textContent = doneTasks.length;

  // Render columns
  renderKanbanColumn('kanban-todo', todoTasks);
  renderKanbanColumn('kanban-in-progress', inProgressTasks);
  renderKanbanColumn('kanban-review', reviewTasks);
  renderKanbanColumn('kanban-done', doneTasks);
}

function renderKanbanColumn(containerId, columnTasks) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (columnTasks.length === 0) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.8rem; border: 2px dashed var(--border-light); border-radius: var(--radius-sm);">
        Trống
      </div>
    `;
    return;
  }

  container.innerHTML = columnTasks.map(t => {
    const course = store.getCourseById(t.courseId);
    const courseCode = course ? course.code : 'Chung';

    let priorityBadge = `<span class="badge badge-secondary">Bình thường</span>`;
    if (t.priority === 'HIGH') priorityBadge = `<span class="badge badge-rose">🔥 Ưu tiên cao</span>`;
    if (t.priority === 'LOW') priorityBadge = `<span class="badge badge-emerald">Thấp</span>`;

    return `
      <div class="kanban-card" data-id="${t.id}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          ${priorityBadge}
          <span class="badge badge-primary" style="font-size: 0.68rem;">${courseCode}</span>
        </div>
        <div class="kanban-card-title">${t.title}</div>
        <div class="kanban-card-meta">
          <span><i class="fa-regular fa-calendar"></i> ${t.dueDate}</span>
          <div style="display: flex; gap: 4px;">
            <select class="custom-select" style="padding: 2px 6px; font-size: 0.72rem;" onchange="window.app.moveTaskStatus('${t.id}', this.value)">
              <option value="TODO" ${t.status === 'TODO' ? 'selected' : ''}>Cần Làm</option>
              <option value="IN_PROGRESS" ${t.status === 'IN_PROGRESS' ? 'selected' : ''}>Đang Làm</option>
              <option value="REVIEW" ${t.status === 'REVIEW' ? 'selected' : ''}>Chấm Bài</option>
              <option value="DONE" ${t.status === 'DONE' ? 'selected' : ''}>Hoàn Thành</option>
            </select>
            <button class="btn btn-sm btn-ghost" style="padding: 2px 6px;" onclick="window.app.deleteTaskItem('${t.id}')">
              <i class="fa-solid fa-trash text-rose"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
