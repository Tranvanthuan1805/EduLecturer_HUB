/* ==========================================================================
   EduVerse Studio - Home Landing Page Component
   ========================================================================== */

import { store } from '../store.js';

export function renderHomePage() {
  const container = document.getElementById('view-home');
  if (!container) return;

  const students = store.getStudents();
  const courses = store.getCourses();
  const tasks = store.getTasks();

  const totalStudentsCount = students.length || 45;
  const totalCoursesCount = courses.length || 4;
  const pendingTasksCount = tasks.filter(t => t.status !== 'DONE').length || 3;

  container.innerHTML = `
    <!-- 1. HERO BANNER SECTION -->
    <div class="home-hero-panel glass-panel" style="padding: 48px 40px; margin-bottom: 36px; text-align: center; position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(99, 102, 241, 0.15)); border: 1px solid rgba(99, 102, 241, 0.3);">
      <div style="max-width: 820px; margin: 0 auto; position: relative; z-index: 2;">
        <span class="badge badge-primary" style="padding: 6px 14px; font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 16px; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4);">
          ✨ Next-Gen Education Management Ecosystem
        </span>
        
        <h1 style="font-size: 2.8rem; font-weight: 800; line-height: 1.2; margin: 16px 0 20px 0; background: linear-gradient(135deg, #ffffff, #818cf8, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          EduVerse Studio & Hub
        </h1>
        
        <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 32px;">
          Giải pháp quản lý giảng dạy đa môn học toàn diện dành cho Giảng viên và Cổng học tập thông minh cá nhân hóa dành cho Sinh viên. Tích hợp MongoDB Cloud, Telegram Alert & Gmail tự động!
        </p>

        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" style="padding: 12px 28px; font-size: 1rem;" onclick="window.app.switchTab('dashboard')">
            <i class="fa-solid fa-rocket"></i> Khám Phá Teacher Studio
          </button>
          <button class="btn btn-secondary" style="padding: 12px 28px; font-size: 1rem;" onclick="window.app.openModal('modal-auth')">
            <i class="fa-solid fa-user-plus"></i> Đăng Ký / Đăng Nhập
          </button>
        </div>
      </div>
    </div>

    <!-- 2. CORE FEATURES GRID -->
    <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
      <i class="fa-solid fa-sparkles text-indigo"></i> Trụ Cột Tính Năng Nổi Bật
    </h2>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 36px;">
      <!-- Feature 1 -->
      <div class="glass-panel" style="padding: 24px; transition: var(--transition);" class="feature-hover-card">
        <div class="stat-icon bg-indigo-soft" style="margin-bottom: 16px;">
          <i class="fa-solid fa-chalkboard-user"></i>
        </div>
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 8px;">👨‍🏫 Teacher Studio</h3>
        <p class="text-muted" style="font-size: 0.85rem; line-height: 1.5;">
          Quản lý danh sách học viên đa môn học, phân lớp sinh hoạt, sắp xếp công việc giảng dạy theo mô hình Kanban thông minh.
        </p>
      </div>

      <!-- Feature 2 -->
      <div class="glass-panel" style="padding: 24px; transition: var(--transition);">
        <div class="stat-icon bg-emerald-soft" style="margin-bottom: 16px;">
          <i class="fa-solid fa-user-graduate"></i>
        </div>
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 8px;">🎓 Student Portal</h3>
        <p class="text-muted" style="font-size: 0.85rem; line-height: 1.5;">
          Cổng học viên riêng biệt xem bảng điểm cá nhân, theo dõi tỷ lệ chuyên cần, nộp bài tập online và nhận lời nhắn từ Thầy Thanh.
        </p>
      </div>

      <!-- Feature 3 -->
      <div class="glass-panel" style="padding: 24px; transition: var(--transition);">
        <div class="stat-icon bg-amber-soft" style="margin-bottom: 16px;">
          <i class="fa-solid fa-paper-plane"></i>
        </div>
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 8px;">🤖 Telegram & Gmail</h3>
        <p class="text-muted" style="font-size: 0.85rem; line-height: 1.5;">
          Gửi tin nhắn cảnh báo cấm thi trực tiếp qua Telegram Bot và tự động phát thư chào mừng / thông báo an toàn về hòm thư Gmail.
        </p>
      </div>

      <!-- Feature 4 -->
      <div class="glass-panel" style="padding: 24px; transition: var(--transition);">
        <div class="stat-icon bg-rose-soft" style="margin-bottom: 16px;">
          <i class="fa-solid fa-database"></i>
        </div>
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 8px;">📊 Cloud & Google Sheets</h3>
        <p class="text-muted" style="font-size: 0.85rem; line-height: 1.5;">
          Lưu trữ dữ liệu thời gian thực trên MongoDB Atlas Cloud 24/7 và xuất file bảng điểm chuẩn hóa Google Sheets / Excel 1-click.
        </p>
      </div>
    </div>

    <!-- 3. LIVE STATS COUNTER -->
    <div class="glass-panel" style="padding: 32px; margin-bottom: 36px; display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; gap: 20px; background: rgba(15, 23, 42, 0.6);">
      <div>
        <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--primary);">${totalStudentsCount}+</h2>
        <p class="text-muted" style="font-size: 0.85rem; font-weight: 600;">Học Viên Đang Quản Lý</p>
      </div>

      <div>
        <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--emerald);">${totalCoursesCount} Môn</h2>
        <p class="text-muted" style="font-size: 0.85rem; font-weight: 600;">Chương Trình Chuyên Ngành</p>
      </div>

      <div>
        <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--amber);">${pendingTasksCount} Việc</h2>
        <p class="text-muted" style="font-size: 0.85rem; font-weight: 600;">Nhiệm Vụ Đang Thực Hiện</p>
      </div>

      <div>
        <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--rose);">99.9%</h2>
        <p class="text-muted" style="font-size: 0.85rem; font-weight: 600;">Thời Gian Hoạt Động Cloud</p>
      </div>
    </div>

    <!-- 4. DUAL PORTAL QUICK ACTION CARDS -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div class="glass-panel" style="padding: 32px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(30, 41, 59, 0.8));">
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;"><i class="fa-solid fa-graduation-cap text-indigo"></i> Dành Cho Giảng Viên</h3>
        <p class="text-muted" style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 20px;">
          Truy cập trung tâm quản lý lớp học, nhập điểm số trực tiếp, theo dõi danh sách học viên vắng nhiều buổi và điều hành lịch giảng dạy.
        </p>
        <button class="btn btn-primary" onclick="window.app.switchTab('dashboard')">
          <span>Vào Teacher Studio</span> <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <div class="glass-panel" style="padding: 32px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(30, 41, 59, 0.8));">
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;"><i class="fa-solid fa-user-shield text-emerald"></i> Dành Cho Sinh Viên</h3>
        <p class="text-muted" style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 20px;">
          Xem kết quả học tập cá nhân, theo dõi chuyên cần, xem nhận xét chi tiết của Thầy Thanh và nộp bài tập đồ án trực tuyến.
        </p>
        <button class="btn btn-secondary" onclick="window.app.switchTab('student-portal')">
          <span>Vào Student Portal</span> <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}
