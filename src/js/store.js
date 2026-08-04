/* ==========================================================================
   EduLecturer Hub - State Management & Data Store
   ========================================================================== */

const STORAGE_KEY = 'EDULECTURER_HUB_DATA_V1';

// Initial Mock Data for first-time load
const initialData = {
  courses: [
    {
      id: 'C01',
      code: 'INT2034',
      name: 'Lập Trình Web Modern (React & JS)',
      classCount: '2 lớp (K45-CNTT1, K45-CNTT2)',
      studentCount: 45,
      schedule: 'Thứ 2 & Thứ 4 (07:00 - 09:30)',
      color: '#6366f1',
      description: 'Phát triển ứng dụng Web toàn diện với HTML, CSS3, JavaScript ES6+, ReactJS và REST APIs.'
    },
    {
      id: 'C02',
      code: 'ENG102',
      name: 'Tiếng Anh Giao Tiếp Nâng Cao K45',
      classCount: '3 lớp (K45-NNA, K45-QTKD)',
      studentCount: 52,
      schedule: 'Thứ 3 & Thứ 5 (13:00 - 15:30)',
      color: '#10b981',
      description: 'Rèn luyện kỹ năng thuyết trình, làm việc nhóm và giao tiếp bằng Tiếng Anh trong môi trường công sở.'
    },
    {
      id: 'C03',
      code: 'MATH101',
      name: 'Toán Cao Cấp & Xung Đột Thuật Toán',
      classCount: '1 lớp (K45-KHDL)',
      studentCount: 38,
      schedule: 'Thứ 6 (07:30 - 11:30)',
      color: '#f59e0b',
      description: 'Đại số tuyến tính, giải tích ma trận và ứng dụng trong trí tuệ nhân tạo.'
    },
    {
      id: 'C04',
      code: 'DB201',
      name: 'Hệ Quản Trị Cơ Sở Dữ Liệu SQL',
      classCount: '2 lớp (K45-CNTT3, K45-HTTT)',
      studentCount: 41,
      schedule: 'Thứ 7 (08:00 - 11:30)',
      color: '#8b5cf6',
      description: 'Thiết kế cơ sở dữ liệu quan hệ, tối ưu hóa truy vấn SQL và phân tích dữ liệu.'
    }
  ],

  students: [
    {
      id: 'STU_101',
      code: 'SV202601',
      name: 'Trần Thị Mai Anh',
      email: 'maianh.tran@student.edu.vn',
      phone: '0912 345 678',
      class: 'K45-CNTT1',
      status: 'ACTIVE',
      enrolledCourses: ['C01', 'C04'],
      attendance: 95,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MaiAnh&backgroundColor=b6e3f4',
      grades: {
        'C01': { attendanceScore: 10, assignmentScore: 9.0, midtermScore: 8.5, finalScore: 9.0, comment: 'Học viên xuất sắc, hăng hái phát biểu.' },
        'C04': { attendanceScore: 9.5, assignmentScore: 8.5, midtermScore: 9.0, finalScore: 8.8, comment: 'Tư duy SQL logic tốt.' }
      }
    },
    {
      id: 'STU_102',
      code: 'SV202602',
      name: 'Nguyễn Quốc Bảo',
      email: 'baonguyen@student.edu.vn',
      phone: '0987 654 321',
      class: 'K45-CNTT1',
      status: 'WARNING',
      enrolledCourses: ['C01', 'C03'],
      attendance: 65,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuocBao&backgroundColor=c0aedc',
      grades: {
        'C01': { attendanceScore: 6.0, assignmentScore: 5.5, midtermScore: 4.5, finalScore: 5.0, comment: 'Vắng 3 buổi không phép. Cần hỗ trợ nộp bài tập gấp.' },
        'C03': { attendanceScore: 7.0, assignmentScore: 6.0, midtermScore: 5.0, finalScore: 5.5, comment: 'Chưa nắm rõ phần Ma trận.' }
      }
    },
    {
      id: 'STU_103',
      code: 'SV202603',
      name: 'Lê Hoàng Minh',
      email: 'minh.le@student.edu.vn',
      phone: '0903 112 233',
      class: 'K45-NNA',
      status: 'ACTIVE',
      enrolledCourses: ['C02'],
      attendance: 90,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HoangMinh&backgroundColor=d1d4f9',
      grades: {
        'C02': { attendanceScore: 9.0, assignmentScore: 8.5, midtermScore: 8.0, finalScore: 8.5, comment: 'Phát âm chuẩn, giao tiếp tự tin.' }
      }
    },
    {
      id: 'STU_104',
      code: 'SV202604',
      name: 'Phạm Phương Thảo',
      email: 'thaopham@student.edu.vn',
      phone: '0934 888 999',
      class: 'K45-QTKD',
      status: 'ACTIVE',
      enrolledCourses: ['C02', 'C04'],
      attendance: 100,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhuongThao&backgroundColor=ffd5dc',
      grades: {
        'C02': { attendanceScore: 10, assignmentScore: 9.5, midtermScore: 9.5, finalScore: 9.8, comment: 'Điểm tối đa phần Thuyết trình.' },
        'C04': { attendanceScore: 10, assignmentScore: 9.0, midtermScore: 8.5, finalScore: 9.0, comment: 'Nỗ lực học tập rất cao.' }
      }
    },
    {
      id: 'STU_105',
      code: 'SV202605',
      name: 'Đặng Tuấn Kiệt',
      email: 'kiet.dang@student.edu.vn',
      phone: '0971 222 333',
      class: 'K45-KHDL',
      status: 'WARNING',
      enrolledCourses: ['C03'],
      attendance: 70,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TuanKiet&backgroundColor=ffdfbf',
      grades: {
        'C03': { attendanceScore: 7.0, assignmentScore: 4.0, midtermScore: 3.5, finalScore: 4.0, comment: 'Nguy cơ cấm thi môn Toán Cao Cấp do thiếu điểm BTVN.' }
      }
    },
    {
      id: 'STU_106',
      code: 'SV202606',
      name: 'Vũ Thu Trang',
      email: 'trang.vu@student.edu.vn',
      phone: '0966 555 444',
      class: 'K45-CNTT2',
      status: 'COMPLETED',
      enrolledCourses: ['C01', 'C02', 'C04'],
      attendance: 98,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThuTrang&backgroundColor=c0aedc',
      grades: {
        'C01': { attendanceScore: 10, assignmentScore: 9.5, midtermScore: 9.0, finalScore: 9.2, comment: 'Đã hoàn thành xuất sắc đồ án.' },
        'C02': { attendanceScore: 9.5, assignmentScore: 9.0, midtermScore: 8.8, finalScore: 9.0, comment: 'Tốt.' },
        'C04': { attendanceScore: 10, assignmentScore: 9.2, midtermScore: 9.5, finalScore: 9.5, comment: 'Xuất sắc.' }
      }
    }
  ],

  tasks: [
    {
      id: 'TASK_01',
      title: 'Soạn giáo án & Slide Bài 5: React State & Hooks',
      courseId: 'C01',
      priority: 'HIGH',
      dueDate: '2026-08-06',
      status: 'IN_PROGRESS'
    },
    {
      id: 'TASK_02',
      title: 'Chấm 45 bài kiểm tra giữa kỳ Tiếng Anh Giao Tiếp',
      courseId: 'C02',
      priority: 'HIGH',
      dueDate: '2026-08-05',
      status: 'REVIEW'
    },
    {
      id: 'TASK_03',
      title: 'Nhập điểm chuyên cần tuần 4 môn SQL lên hệ thống Khoa',
      courseId: 'C04',
      priority: 'MEDIUM',
      dueDate: '2026-08-08',
      status: 'TODO'
    },
    {
      id: 'TASK_04',
      title: 'Gửi thông báo nhắc nhở 2 sinh viên nguy cơ cấm thi môn Toán',
      courseId: 'C03',
      priority: 'HIGH',
      dueDate: '2026-08-04',
      status: 'TODO'
    },
    {
      id: 'TASK_05',
      title: 'Họp Chuyên môn Bộ môn Công nghệ Phần mềm',
      courseId: '',
      priority: 'LOW',
      dueDate: '2026-08-10',
      status: 'DONE'
    }
  ],

  resources: [
    {
      id: 'RES_01',
      courseId: 'C01',
      title: 'Slide Bài Giảng 01: Kiến Trúc React & ES6 Syntax',
      type: 'PDF',
      url: 'https://cdn.example.com/slides-react-01.pdf',
      uploadedAt: '2026-08-01'
    },
    {
      id: 'RES_02',
      courseId: 'C02',
      title: 'Tài Liệu Mẫu: 50 Mẫu Thuyết Trình Tiếng Anh Công Sở',
      type: 'DOCX',
      url: 'https://cdn.example.com/english-presentation.docx',
      uploadedAt: '2026-08-02'
    }
  ],

  submissions: [
    {
      id: 'SUB_01',
      studentId: 'STU_101',
      courseId: 'C01',
      title: 'Đồ án Giữa kỳ: Xây dựng Todo Web App với React',
      submittedAt: '2026-08-03 14:30',
      status: 'GRADED',
      score: 9.0,
      link: 'https://github.com/maianh/react-todo-app'
    },
    {
      id: 'SUB_02',
      studentId: 'STU_102',
      courseId: 'C01',
      title: 'Bài tập 02: Thiết kế giao diện HTML/CSS',
      submittedAt: '2026-08-02 18:10',
      status: 'PENDING',
      score: null,
      link: 'https://github.com/quocbao/html-assignment'
    }
  ]
};

class DataStore {
  constructor() {
    this.data = this.loadFromStorage();
  }

  loadFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveToStorage(initialData);
      return JSON.parse(JSON.stringify(initialData));
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing stored data, resetting to default.', e);
      this.saveToStorage(initialData);
      return JSON.parse(JSON.stringify(initialData));
    }
  }

  saveToStorage(dataToSave) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave || this.data));
  }

  // --- COURSES API ---
  getCourses() {
    return this.data.courses;
  }

  getCourseById(id) {
    return this.data.courses.find(c => c.id === id);
  }

  addCourse(courseObj) {
    const newCourse = {
      id: 'C_' + Date.now(),
      code: courseObj.code || 'COUR_' + Math.floor(Math.random() * 1000),
      name: courseObj.name,
      classCount: courseObj.classCount || '1 lớp',
      studentCount: 0,
      schedule: courseObj.schedule || 'Chưa xếp lịch',
      color: courseObj.color || '#6366f1',
      description: courseObj.description || ''
    };
    this.data.courses.push(newCourse);
    this.saveToStorage();
    return newCourse;
  }

  // --- STUDENTS API ---
  getStudents() {
    return this.data.students;
  }

  getStudentById(id) {
    return this.data.students.find(s => s.id === id);
  }

  addStudent(studentData) {
    const newStudent = {
      id: 'STU_' + Date.now(),
      code: studentData.code,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone || '',
      class: studentData.class,
      status: studentData.status || 'ACTIVE',
      enrolledCourses: studentData.enrolledCourses || [],
      attendance: 100,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(studentData.name)}&backgroundColor=b6e3f4`,
      grades: {}
    };
    // Initialize default grades object for enrolled courses
    newStudent.enrolledCourses.forEach(cId => {
      newStudent.grades[cId] = {
        attendanceScore: 10,
        assignmentScore: 0,
        midtermScore: 0,
        finalScore: 0,
        comment: ''
      };
    });

    this.data.students.push(newStudent);
    this.updateCourseStudentCounts();
    this.saveToStorage();
    return newStudent;
  }

  updateStudent(id, studentData) {
    const idx = this.data.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.students[idx] = {
        ...this.data.students[idx],
        ...studentData
      };
      this.updateCourseStudentCounts();
      this.saveToStorage();
      return this.data.students[idx];
    }
    return null;
  }

  deleteStudent(id) {
    this.data.students = this.data.students.filter(s => s.id !== id);
    this.updateCourseStudentCounts();
    this.saveToStorage();
  }

  updateStudentGrade(studentId, courseId, gradeData) {
    const student = this.getStudentById(studentId);
    if (student) {
      if (!student.grades) student.grades = {};
      student.grades[courseId] = {
        ...student.grades[courseId],
        ...gradeData
      };
      this.saveToStorage();
    }
  }

  // --- TASKS API ---
  getTasks() {
    return this.data.tasks;
  }

  addTask(taskData) {
    const newTask = {
      id: 'TASK_' + Date.now(),
      title: taskData.title,
      courseId: taskData.courseId || '',
      priority: taskData.priority || 'MEDIUM',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      status: taskData.status || 'TODO'
    };
    this.data.tasks.push(newTask);
    this.saveToStorage();
    return newTask;
  }

  updateTaskStatus(taskId, newStatus) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      this.saveToStorage();
    }
  }

  deleteTask(taskId) {
    this.data.tasks = this.data.tasks.filter(t => t.id !== taskId);
    this.saveToStorage();
  }

  // --- RESOURCES API ---
  getResources(courseId = null) {
    if (!this.data.resources) this.data.resources = [];
    if (courseId) {
      return this.data.resources.filter(r => r.courseId === courseId);
    }
    return this.data.resources;
  }

  addResource(resourceData) {
    if (!this.data.resources) this.data.resources = [];
    const newRes = {
      id: 'RES_' + Date.now(),
      courseId: resourceData.courseId,
      title: resourceData.title,
      type: resourceData.type || 'PDF',
      url: resourceData.url || '#',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    this.data.resources.push(newRes);
    this.saveToStorage();
    return newRes;
  }

  // --- SUBMISSIONS API ---
  getSubmissions(filterCourseId = null, filterStudentId = null) {
    if (!this.data.submissions) this.data.submissions = [];
    let list = this.data.submissions;
    if (filterCourseId) list = list.filter(s => s.courseId === filterCourseId);
    if (filterStudentId) list = list.filter(s => s.studentId === filterStudentId);
    return list;
  }

  addSubmission(subData) {
    if (!this.data.submissions) this.data.submissions = [];
    const newSub = {
      id: 'SUB_' + Date.now(),
      studentId: subData.studentId,
      courseId: subData.courseId,
      title: subData.title,
      submittedAt: new Date().toLocaleString('vi-VN'),
      status: 'PENDING',
      score: null,
      link: subData.link || '#'
    };
    this.data.submissions.push(newSub);
    this.saveToStorage();
    return newSub;
  }

  gradeSubmission(submissionId, score) {
    const sub = this.data.submissions.find(s => s.id === submissionId);
    if (sub) {
      sub.score = parseFloat(score);
      sub.status = 'GRADED';
      this.saveToStorage();
    }
  }

  // Helper calculations
  updateCourseStudentCounts() {
    this.data.courses.forEach(c => {
      c.studentCount = this.data.students.filter(s => s.enrolledCourses.includes(c.id)).length;
    });
  }

  calculateStudentGPA(student) {
    if (!student.grades || Object.keys(student.grades).length === 0) return 0;
    let totalScore = 0;
    let count = 0;
    Object.values(student.grades).forEach(g => {
      const avg = (g.attendanceScore * 0.1) + (g.assignmentScore * 0.2) + (g.midtermScore * 0.3) + (g.finalScore * 0.4);
      totalScore += avg;
      count++;
    });
    return count > 0 ? (totalScore / count).toFixed(1) : 0;
  }
}

export const store = new DataStore();
