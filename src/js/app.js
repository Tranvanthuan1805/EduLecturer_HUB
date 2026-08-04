/* ==========================================================================
   EduLecturer Hub - Main Application Controller
   ========================================================================== */

import { store } from './store.js';
import { renderDashboard } from './components/dashboard.js';
import { renderStudents, initStudentFilters, renderStudentsTable } from './components/students.js';
import { renderTasks } from './components/tasks.js';
import { renderGradebook, renderGradebookTable } from './components/gradebook.js';
import { renderCourses } from './components/courses.js';
import { renderStudentDashboard } from './components/studentDashboard.js';
import { renderHomePage } from './components/home.js';

const API_BASE = window.location.port === '5000' ? '' : 'http://localhost:5000';

class App {
  constructor() {
    this.currentTab = 'home';
    this.currentRole = 'TEACHER';
    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindThemeToggle();
    this.bindGlobalSearch();
    this.bindRoleSwitcher();
    this.bindModals();
    this.bindFormSubmits();
    this.updateBadges();

    initStudentFilters();

    // Initial Render
    this.renderCurrentTab();

    // Attach global reference for inline handlers in HTML strings
    window.app = this;
  }

  // --- ROLE SWITCHER ---
  bindRoleSwitcher() {
    const roleSelect = document.getElementById('global-role-switcher');
    if (!roleSelect) return;

    roleSelect.addEventListener('change', (e) => {
      this.setRole(e.target.value);
    });
  }

  setRole(role) {
    this.currentRole = role;
    const roleSelect = document.getElementById('global-role-switcher');
    if (roleSelect) roleSelect.value = role;

    const userDisplayName = document.getElementById('user-display-name');
    const userDisplayRole = document.getElementById('user-display-role');
    const userAvatarImg = document.getElementById('user-avatar-img');

    if (role === 'STUDENT') {
      const students = store.getStudents();
      const firstStudent = students[0] || { name: 'Sinh Viên', class: 'K45', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student' };
      if (userDisplayName) userDisplayName.textContent = firstStudent.name;
      if (userDisplayRole) userDisplayRole.textContent = `Học viên (${firstStudent.class})`;
      if (userAvatarImg) userAvatarImg.src = firstStudent.avatar;

      this.switchTab('student-portal');
    } else {
      if (userDisplayName) userDisplayName.textContent = 'TS. Nguyễn Văn Thanh';
      if (userDisplayRole) userDisplayRole.textContent = 'Giảng viên Cao cấp';
      if (userAvatarImg) userAvatarImg.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=LecturerThanh&backgroundColor=6366f1';

      this.switchTab('dashboard');
    }
  }

  // --- NAVIGATION ---
  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        if (tab) {
          this.switchTab(tab);
        }
      });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
      });
    }

    // Sidebar collapse toggle (76px vs 270px)
    const collapseBtn = document.getElementById('btn-sidebar-collapse');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('collapsed-margin');
      });
    }

    // Dashboard quick buttons
    const btnAllStudents = document.getElementById('btn-dashboard-view-all-students');
    if (btnAllStudents) btnAllStudents.onclick = () => this.switchTab('students');

    const btnKanban = document.getElementById('btn-dashboard-view-kanban');
    if (btnKanban) btnKanban.onclick = () => this.switchTab('tasks');
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    const appEl = document.getElementById('app');
    const landingNav = document.getElementById('landing-navbar');

    if (tabName === 'home') {
      if (appEl) appEl.classList.add('landing-mode');
      if (landingNav) landingNav.style.display = 'flex';
    } else {
      if (appEl) appEl.classList.remove('landing-mode');
      if (landingNav) landingNav.style.display = 'none';
    }

    // Update Nav active status
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.getAttribute('data-tab') === tabName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update View active status
    document.querySelectorAll('.tab-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${tabName}`);
    if (targetView) targetView.classList.add('active');

    // Update Topbar Title & Breadcrumb
    const titles = {
      home: { title: 'Trang Chủ - EduVerse Studio', sub: 'Nền tảng Quản lý & Học tập Đa môn Thông minh dành cho Giảng viên & Sinh viên', breadcrumb: 'Trang Chủ' },
      dashboard: { title: 'Teacher Dashboard Tổng Quan', sub: 'Xin chào Thầy Thanh, chúc Thầy một ngày làm việc hiệu quả!', breadcrumb: 'Teacher Dashboard' },
      students: { title: 'Quản Lý Danh Sách Học Viên', sub: 'Theo dõi tiến độ học tập và thông tin sinh viên theo từng môn', breadcrumb: 'Quản Lý Học Viên' },
      courses: { title: 'Danh Mục Môn Học & Phân Lớp', sub: 'Chương trình giảng dạy và phân bổ giảng dạy', breadcrumb: 'Môn Học & Lớp' },
      tasks: { title: 'Bảng Công Việc Giảng Viên (Kanban)', sub: 'Sắp xếp lịch trình soạn bài, chấm điểm và nhiệm vụ khoa', breadcrumb: 'Kanban Công Việc' },
      gradebook: { title: 'Sổ Điểm & Đánh Giá Tiến Độ', sub: 'Nhập điểm trực tiếp và đánh giá quá trình học tập', breadcrumb: 'Sổ Điểm & Đánh Giá' },
      'student-portal': { title: 'Student Portal - Góc Học Viên', sub: 'Xem kết quả học tập, điểm thi và nhận xét chuyên môn từ Giảng viên', breadcrumb: 'Student Portal' }
    };

    if (titles[tabName]) {
      document.getElementById('page-title').textContent = titles[tabName].title;
      document.getElementById('page-subtitle').textContent = titles[tabName].sub;
      const bEl = document.getElementById('breadcrumb-current-tab');
      if (bEl) bEl.textContent = titles[tabName].breadcrumb || titles[tabName].title;
    }

    this.renderCurrentTab();
    this.updateBadges();
  }

  renderCurrentTab() {
    switch (this.currentTab) {
      case 'home':
        renderHomePage();
        break;
      case 'dashboard':
        renderDashboard();
        break;
      case 'students':
        renderStudents();
        break;
      case 'courses':
        renderCourses();
        break;
      case 'tasks':
        renderTasks();
        break;
      case 'gradebook':
        renderGradebook();
        break;
      case 'student-portal':
        renderStudentDashboard();
        break;
    }
  }

  updateBadges() {
    const students = store.getStudents();
    const courses = store.getCourses();
    const tasks = store.getTasks();

    const pendingTasksCount = tasks.filter(t => t.status !== 'DONE').length;

    const bStudents = document.getElementById('badge-total-students');
    const bCourses = document.getElementById('badge-total-courses');
    const bTasks = document.getElementById('badge-pending-tasks');

    if (bStudents) bStudents.textContent = students.length;
    if (bCourses) bCourses.textContent = courses.length;
    if (bTasks) bTasks.textContent = pendingTasksCount;
  }

  // --- THEME TOGGLE ---
  bindThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      html.setAttribute('data-theme', newTheme);
      toggleBtn.querySelector('.theme-text').textContent = newTheme === 'dark' ? 'Chế độ tối' : 'Chế độ sáng';
    });
  }

  // --- GLOBAL SEARCH ---
  bindGlobalSearch() {
    const searchInput = document.getElementById('global-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) return;

      // If user types query and is on students tab, update table directly
      if (this.currentTab === 'students') {
        const studentSearchInput = document.getElementById('student-search-input');
        if (studentSearchInput) {
          studentSearchInput.value = query;
          studentSearchInput.dispatchEvent(new Event('input'));
        }
      }
    });
  }

  // --- MODALS HANDLERS ---
  bindModals() {
    // Quick Add Button
    const btnQuickAdd = document.getElementById('btn-quick-add');
    if (btnQuickAdd) btnQuickAdd.onclick = () => this.openAddStudentModal();

    // Student Add Button
    const btnAddStudent = document.getElementById('btn-add-student');
    if (btnAddStudent) btnAddStudent.onclick = () => this.openAddStudentModal();

    // Task Add Button
    const btnAddTask = document.getElementById('btn-add-task');
    if (btnAddTask) btnAddTask.onclick = () => this.openAddTaskModal();

    // Course Add Button
    const btnAddCourse = document.getElementById('btn-add-course');
    if (btnAddCourse) btnAddCourse.onclick = () => this.openAddCourseModal();

    // Close buttons
    const btnCloseStudent = document.getElementById('btn-close-modal-student');
    const btnCancelStudent = document.getElementById('btn-cancel-modal-student');
    if (btnCloseStudent) btnCloseStudent.onclick = () => this.closeModal('modal-student');
    if (btnCancelStudent) btnCancelStudent.onclick = () => this.closeModal('modal-student');

    const btnCloseTask = document.getElementById('btn-close-modal-task');
    const btnCancelTask = document.getElementById('btn-cancel-modal-task');
    if (btnCloseTask) btnCloseTask.onclick = () => this.closeModal('modal-task');
    if (btnCancelTask) btnCancelTask.onclick = () => this.closeModal('modal-task');

    const btnCloseDetail = document.getElementById('btn-close-modal-detail');
    if (btnCloseDetail) btnCloseDetail.onclick = () => this.closeModal('modal-student-detail');

    // Export Gradebook button
    const btnExportGradebook = document.getElementById('btn-export-gradebook');
    if (btnExportGradebook) btnExportGradebook.onclick = () => this.exportToGoogleSheets();

    this.bindAuthModals();
  }

  // --- AUTH MODAL HANDLERS ---
  bindAuthModals() {
    const btnOpenAuth = document.getElementById('btn-open-auth-modal');
    const btnCloseAuth = document.getElementById('btn-close-modal-auth');

    if (btnOpenAuth) {
      btnOpenAuth.onclick = () => {
        if (this.loggedInUser) {
          if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?')) {
            this.logout();
          }
        } else {
          this.openModal('modal-auth');
        }
      };
    }

    if (btnCloseAuth) btnCloseAuth.onclick = () => this.closeModal('modal-auth');

    const tabLoginBtn = document.getElementById('tab-auth-login');
    const tabRegisterBtn = document.getElementById('tab-auth-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    if (tabLoginBtn && tabRegisterBtn && formLogin && formRegister) {
      tabLoginBtn.onclick = () => {
        tabLoginBtn.style.color = 'var(--primary)';
        tabRegisterBtn.style.color = 'var(--text-muted)';
        formLogin.style.display = 'block';
        formRegister.style.display = 'none';
      };

      tabRegisterBtn.onclick = () => {
        tabRegisterBtn.style.color = 'var(--primary)';
        tabLoginBtn.style.color = 'var(--text-muted)';
        formRegister.style.display = 'block';
        formLogin.style.display = 'none';
      };
    }

    // Register Form Submit
    if (formRegister) {
      formRegister.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;
        const code = document.getElementById('register-code').value;

        try {
          const res = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, code })
          });
          const data = await res.json();

          if (!res.ok) {
            alert('❌ ' + (data.message || 'Đăng ký thất bại!'));
            return;
          }

          alert(`🎉 ${data.message}\n📩 Hệ thống đã gửi một Thư chào mừng kèm thông tin tài khoản đến Gmail: ${email}`);
          this.loginSuccess(data.user);
          this.closeModal('modal-auth');
        } catch (err) {
          console.error('API Error:', err);
          alert(`❌ Không thể kết nối tới Server API tại ${API_BASE}. Vui lòng kiểm tra kết nối mạng!`);
        }
      };
    }

    // Login Form Submit
    if (formLogin) {
      formLogin.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
          const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();

          if (!res.ok) {
            alert('❌ ' + (data.message || 'Đăng nhập thất bại!'));
            return;
          }

          alert(`🔐 ${data.message}\n📩 Email cảnh báo an toàn thời gian thực đã được gửi tới Gmail: ${email}`);
          this.loginSuccess(data.user);
          this.closeModal('modal-auth');
        } catch (err) {
          console.error('API Error:', err);
          alert(`❌ Không thể kết nối tới Server API tại ${API_BASE}. Vui lòng kiểm tra kết nối mạng!`);
        }
      };
    }

    this.checkAuthSession();
  }

  loginSuccess(user) {
    this.loggedInUser = user;
    sessionStorage.setItem('EDUVERSE_USER', JSON.stringify(user));

    const authBtnText = document.getElementById('auth-btn-text');
    if (authBtnText) authBtnText.textContent = `Đăng Xuất (${user.name})`;

    // Automatically set role and switch view
    this.setRole(user.role || 'STUDENT');
  }

  logout() {
    this.loggedInUser = null;
    sessionStorage.removeItem('EDUVERSE_USER');

    const authBtnText = document.getElementById('auth-btn-text');
    if (authBtnText) authBtnText.textContent = 'Đăng Nhập / Đăng Ký';

    this.setRole('TEACHER');
    alert('Đã đăng xuất khỏi hệ thống!');
  }

  checkAuthSession() {
    const raw = sessionStorage.getItem('EDUVERSE_USER');
    if (raw) {
      try {
        const user = JSON.parse(raw);
        this.loginSuccess(user);
      } catch (e) {}
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  openAddStudentModal(studentId = null) {
    const form = document.getElementById('form-student');
    form.reset();

    const titleEl = document.getElementById('modal-student-title');
    const studentIdInput = document.getElementById('student-id');
    const checkboxGrid = document.getElementById('student-courses-checkboxes');

    const courses = store.getCourses();
    let selectedCourses = [];

    if (studentId) {
      const s = store.getStudentById(studentId);
      if (s) {
        titleEl.textContent = 'Chỉnh Sửa Thông Tin Học Viên';
        studentIdInput.value = s.id;
        document.getElementById('student-name').value = s.name;
        document.getElementById('student-code').value = s.code;
        document.getElementById('student-email').value = s.email;
        document.getElementById('student-phone').value = s.phone || '';
        document.getElementById('student-class').value = s.class;
        document.getElementById('student-status').value = s.status;
        selectedCourses = s.enrolledCourses || [];
      }
    } else {
      titleEl.textContent = 'Thêm Học Viên Mới';
      studentIdInput.value = '';
    }

    // Populate Courses Checkboxes
    checkboxGrid.innerHTML = courses.map(c => `
      <label class="checkbox-item">
        <input type="checkbox" name="enrolled_course" value="${c.id}" ${selectedCourses.includes(c.id) ? 'checked' : ''} />
        <span>${c.name} (${c.code})</span>
      </label>
    `).join('');

    this.openModal('modal-student');
  }

  openAddTaskModal() {
    const form = document.getElementById('form-task');
    form.reset();

    const courseSelect = document.getElementById('task-course');
    const courses = store.getCourses();

    courseSelect.innerHTML = `<option value="">-- Công việc chung / Không chọn --</option>` +
      courses.map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('');

    // Default due date = tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('task-due-date').value = tomorrow.toISOString().split('T')[0];

    this.openModal('modal-task');
  }

  openAddCourseModal() {
    const name = prompt('Nhập tên môn học mới:');
    if (!name) return;
    const code = prompt('Nhập mã môn học (VD: INT301):');
    if (!code) return;

    store.addCourse({
      name: name,
      code: code,
      classCount: '1 lớp',
      schedule: 'Thứ 2 (08:00 - 10:30)',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });

    alert('Đã thêm môn học thành công!');
    this.renderCurrentTab();
    this.updateBadges();
  }

  // --- FORM SUBMITS ---
  bindFormSubmits() {
    const studentForm = document.getElementById('form-student');
    if (studentForm) {
      studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('student-id').value;
        const name = document.getElementById('student-name').value;
        const code = document.getElementById('student-code').value;
        const email = document.getElementById('student-email').value;
        const phone = document.getElementById('student-phone').value;
        const studentClass = document.getElementById('student-class').value;
        const status = document.getElementById('student-status').value;

        const checkedBoxes = document.querySelectorAll('input[name="enrolled_course"]:checked');
        const enrolledCourses = Array.from(checkedBoxes).map(cb => cb.value);

        if (enrolledCourses.length === 0) {
          alert('Vui lòng chọn ít nhất 1 môn học cho học viên!');
          return;
        }

        if (id) {
          store.updateStudent(id, { name, code, email, phone, class: studentClass, status, enrolledCourses });
        } else {
          store.addStudent({ name, code, email, phone, class: studentClass, status, enrolledCourses });
        }

        this.closeModal('modal-student');
        this.renderCurrentTab();
        this.updateBadges();
      });
    }

    const taskForm = document.getElementById('form-task');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const courseId = document.getElementById('task-course').value;
        const priority = document.getElementById('task-priority').value;
        const dueDate = document.getElementById('task-due-date').value;
        const status = document.getElementById('task-status').value;

        store.addTask({ title, courseId, priority, dueDate, status });

        this.closeModal('modal-task');
        this.renderCurrentTab();
        this.updateBadges();
      });
    }
  }

  // --- STUDENT DETAILS MODAL ---
  openStudentDetail(studentId) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    document.getElementById('detail-student-name').textContent = `Hồ Sơ Học Viên: ${student.name}`;

    const bodyEl = document.getElementById('student-detail-body');
    const gpa = store.calculateStudentGPA(student);

    const enrolledCoursesHtml = student.enrolledCourses.map(cId => {
      const course = store.getCourseById(cId);
      if (!course) return '';
      const grades = (student.grades && student.grades[cId]) ? student.grades[cId] : {
        attendanceScore: 10, assignmentScore: 0, midtermScore: 0, finalScore: 0, comment: ''
      };

      return `
        <div style="background: var(--bg-card-hover); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 12px; border: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="color: ${course.color};"><i class="fa-solid fa-book"></i> ${course.name} (${course.code})</h4>
            <span class="badge badge-primary">${course.schedule}</span>
          </div>

          <div class="form-row" style="grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 10px;">
            <div>
              <small class="text-muted">Chuyên cần (10%)</small>
              <input type="number" min="0" max="10" step="0.5" class="grade-input" style="width:100%; margin-top:4px;"
                value="${grades.attendanceScore}"
                onchange="window.app.onGradeInputChange('${student.id}', '${cId}', 'attendanceScore', this.value)" />
            </div>
            <div>
              <small class="text-muted">Bài tập (20%)</small>
              <input type="number" min="0" max="10" step="0.5" class="grade-input" style="width:100%; margin-top:4px;"
                value="${grades.assignmentScore}"
                onchange="window.app.onGradeInputChange('${student.id}', '${cId}', 'assignmentScore', this.value)" />
            </div>
            <div>
              <small class="text-muted">Giữa kỳ (30%)</small>
              <input type="number" min="0" max="10" step="0.5" class="grade-input" style="width:100%; margin-top:4px;"
                value="${grades.midtermScore}"
                onchange="window.app.onGradeInputChange('${student.id}', '${cId}', 'midtermScore', this.value)" />
            </div>
            <div>
              <small class="text-muted">Cuối kỳ (40%)</small>
              <input type="number" min="0" max="10" step="0.5" class="grade-input" style="width:100%; margin-top:4px;"
                value="${grades.finalScore}"
                onchange="window.app.onGradeInputChange('${student.id}', '${cId}', 'finalScore', this.value)" />
            </div>
          </div>

          <div>
            <small class="text-muted">Nhận xét chuyên môn của Thầy/Cô:</small>
            <input type="text" class="comment-input" style="margin-top: 4px;" value="${grades.comment || ''}"
              placeholder="Nhập nhận xét về thái độ, bài làm..."
              onchange="window.app.onGradeInputChange('${student.id}', '${cId}', 'comment', this.value)" />
          </div>
        </div>
      `;
    }).join('');

    bodyEl.innerHTML = `
      <div style="display: flex; gap: 20px; align-items: center; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color);">
        <img src="${student.avatar}" alt="${student.name}" style="width: 72px; height: 72px; border-radius: 50%;" />
        <div style="flex: 1;">
          <h3 style="margin-bottom: 4px;">${student.name} <span class="badge badge-primary">${student.code}</span></h3>
          <p class="text-muted" style="font-size: 0.85rem;">
            Lớp: <strong>${student.class}</strong> | Email: ${student.email} | SĐT: ${student.phone || 'Chưa cập nhật'}
          </p>
        </div>
        <div style="text-align: right;">
          <small class="text-muted">Điểm Trung Bình (ĐTB)</small>
          <h2 style="color: ${gpa < 5.0 ? 'var(--rose)' : 'var(--emerald)'}; font-size: 2rem;">${gpa}</h2>
        </div>
      </div>

      <h4 style="margin-bottom: 12px;"><i class="fa-solid fa-graduation-cap"></i> Kết Quả Học Tập Theo Môn</h4>
      ${enrolledCoursesHtml}

      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button class="btn btn-secondary" onclick="window.app.openAddStudentModal('${student.id}')">
          <i class="fa-solid fa-pen"></i> Sửa thông tin
        </button>
        <button class="btn btn-primary" onclick="window.app.closeModal('modal-student-detail')">Đóng</button>
      </div>
    `;

    this.openModal('modal-student-detail');
  }

  // --- ACTIONS & EVENTS ---
  confirmDeleteStudent(id, name) {
    if (confirm(`Bạn có chắc chắn muốn xóa học viên ${name} khỏi hệ thống?`)) {
      store.deleteStudent(id);
      this.renderCurrentTab();
      this.updateBadges();
    }
  }

  toggleTaskDone(taskId, isDone) {
    store.updateTaskStatus(taskId, isDone ? 'DONE' : 'TODO');
    this.renderCurrentTab();
    this.updateBadges();
  }

  moveTaskStatus(taskId, newStatus) {
    store.updateTaskStatus(taskId, newStatus);
    this.renderCurrentTab();
    this.updateBadges();
  }

  deleteTaskItem(taskId) {
    store.deleteTask(taskId);
    this.renderCurrentTab();
    this.updateBadges();
  }

  onGradeInputChange(studentId, courseId, field, value) {
    const numVal = field === 'comment' ? value : parseFloat(value) || 0;
    store.updateStudentGrade(studentId, courseId, { [field]: numVal });
    
    // Refresh tables if currently visible
    if (this.currentTab === 'gradebook') renderGradebookTable();
    if (this.currentTab === 'students') renderStudentsTable();
  }

  // --- INTEGRATION HANDLERS (Telegram & Google Sheets) ---
  async sendTelegramRiskAlert(studentId) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    const gpa = store.calculateStudentGPA(student);
    let reason = 'Cần hỗ trợ học tập';
    if (student.attendance < 75) reason = `Vắng nhiều buổi (${student.attendance}% chuyên cần)`;
    else if (gpa < 5.0) reason = `ĐTB môn quá thấp (${gpa} điểm)`;

    try {
      const res = await fetch(`${API_BASE}/api/integrations/telegram/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'RISK_STUDENT',
          student: student,
          reason: reason
        })
      });
      const data = await res.json();
      alert(`🚀 Đã gửi cảnh báo Telegram cho học viên ${student.name} thành công!\n(Nội dung: ${reason})`);
    } catch (e) {
      alert(`📲 Đã giả lập gửi cảnh báo Telegram thành công cho học viên: ${student.name}\n(Nội dung: ${reason})`);
    }
  }

  async exportToGoogleSheets() {
    const selectEl = document.getElementById('gradebook-course-select');
    const courseId = selectEl ? selectEl.value : '';
    const course = store.getCourseById(courseId);
    const courseName = course ? course.name : 'Mon_Hoc';

    const allStudents = store.getStudents();
    const enrolledStudents = allStudents.filter(s => s.enrolledCourses.includes(courseId));

    if (enrolledStudents.length === 0) {
      alert('Không có học viên nào để xuất dữ liệu!');
      return;
    }

    // 1. Download CSV File for Google Sheets / Excel
    const headers = ['STT', 'MSSV', 'Họ và Tên', 'Lớp', 'Môn Học', 'Chuyên Cần (10%)', 'Bài Tập (20%)', 'Giữa Kỳ (30%)', 'Cuối Kỳ (40%)', 'ĐTB Môn', 'Nhận Xét'];
    const rows = enrolledStudents.map((s, idx) => {
      const g = (s.grades && s.grades[courseId]) ? s.grades[courseId] : { attendanceScore: 10, assignmentScore: 0, midtermScore: 0, finalScore: 0, comment: '' };
      const att = parseFloat(g.attendanceScore || 0);
      const ass = parseFloat(g.assignmentScore || 0);
      const mid = parseFloat(g.midtermScore || 0);
      const fin = parseFloat(g.finalScore || 0);
      const total = ((att * 0.1) + (ass * 0.2) + (mid * 0.3) + (fin * 0.4)).toFixed(1);

      return [idx + 1, `"${s.code}"`, `"${s.name}"`, `"${s.class}"`, `"${courseName}"`, att, ass, mid, fin, total, `"${g.comment || ''}"`].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BangDiem_${course ? course.code : 'Export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`📊 Đã xuất file CSV bảng điểm môn ${courseName} thành công!\nBạn có thể mở trực tiếp bằng Google Sheets hoặc Excel.`);
  }

  openSubmitHomeworkModal(studentId) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    const title = prompt('Nhập tên bài tập nộp (VD: Đồ án bài 2):');
    if (!title) return;

    const link = prompt('Nhập link nộp bài (GitHub / Google Drive / Figma / Vercel link):');
    if (!link) return;

    const courseId = student.enrolledCourses[0] || 'C01';

    store.addSubmission({
      studentId: student.id,
      courseId: courseId,
      title: title,
      link: link
    });

    alert(`🎉 Đã nộp bài tập "${title}" thành công cho Thầy Thanh!`);
    renderStudentDashboard(studentId);
  }

  filterStudentsByCourse(courseId) {
    this.switchTab('students');
    const filterSelect = document.getElementById('student-filter-course');
    if (filterSelect) {
      filterSelect.value = courseId;
      filterSelect.dispatchEvent(new Event('change'));
    }
  }
}

// Instantiate App
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
