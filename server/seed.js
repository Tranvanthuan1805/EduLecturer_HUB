/* ==========================================================================
   EduLecturer Hub - MongoDB Data Seeder Script
   ========================================================================== */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { StudentModel } from './models/Student.js';
import { CourseModel } from './models/Course.js';
import { TaskModel } from './models/Task.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduteacher_db';

const initialCourses = [
  {
    code: 'INT2034',
    name: 'Lập Trình Web Modern (React & JS)',
    classCount: '2 lớp (K45-CNTT1, K45-CNTT2)',
    studentCount: 45,
    schedule: 'Thứ 2 & Thứ 4 (07:00 - 09:30)',
    color: '#6366f1',
    description: 'Phát triển ứng dụng Web toàn diện với HTML, CSS3, JavaScript ES6+, ReactJS và REST APIs.'
  },
  {
    code: 'ENG102',
    name: 'Tiếng Anh Giao Tiếp Nâng Cao K45',
    classCount: '3 lớp (K45-NNA, K45-QTKD)',
    studentCount: 52,
    schedule: 'Thứ 3 & Thứ 5 (13:00 - 15:30)',
    color: '#10b981',
    description: 'Rèn luyện kỹ năng thuyết trình, làm việc nhóm và giao tiếp bằng Tiếng Anh trong môi trường công sở.'
  },
  {
    code: 'MATH101',
    name: 'Toán Cao Cấp & Xung Đột Thuật Toán',
    classCount: '1 lớp (K45-KHDL)',
    studentCount: 38,
    schedule: 'Thứ 6 (07:30 - 11:30)',
    color: '#f59e0b',
    description: 'Đại số tuyến tính, giải tích ma trận và ứng dụng trong trí tuệ nhân tạo.'
  },
  {
    code: 'DB201',
    name: 'Hệ Quản Trị Cơ Sở Dữ Liệu SQL',
    classCount: '2 lớp (K45-CNTT3, K45-HTTT)',
    studentCount: 41,
    schedule: 'Thứ 7 (08:00 - 11:30)',
    color: '#8b5cf6',
    description: 'Thiết kế cơ sở dữ liệu quan hệ, tối ưu hóa truy vấn SQL và phân tích dữ liệu.'
  }
];

const initialStudents = [
  {
    code: 'SV202601',
    name: 'Trần Thị Mai Anh',
    email: 'maianh.tran@student.edu.vn',
    phone: '0912 345 678',
    class: 'K45-CNTT1',
    status: 'ACTIVE',
    enrolledCourses: ['INT2034', 'DB201'],
    attendance: 95,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MaiAnh&backgroundColor=b6e3f4',
    grades: {
      'INT2034': { attendanceScore: 10, assignmentScore: 9.0, midtermScore: 8.5, finalScore: 9.0, comment: 'Học viên xuất sắc, hăng hái phát biểu.' },
      'DB201': { attendanceScore: 9.5, assignmentScore: 8.5, midtermScore: 9.0, finalScore: 8.8, comment: 'Tư duy SQL logic tốt.' }
    }
  },
  {
    code: 'SV202602',
    name: 'Nguyễn Quốc Bảo',
    email: 'baonguyen@student.edu.vn',
    phone: '0987 654 321',
    class: 'K45-CNTT1',
    status: 'WARNING',
    enrolledCourses: ['INT2034', 'MATH101'],
    attendance: 65,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuocBao&backgroundColor=c0aedc',
    grades: {
      'INT2034': { attendanceScore: 6.0, assignmentScore: 5.5, midtermScore: 4.5, finalScore: 5.0, comment: 'Vắng 3 buổi không phép. Cần hỗ trợ nộp bài tập gấp.' },
      'MATH101': { attendanceScore: 7.0, assignmentScore: 6.0, midtermScore: 5.0, finalScore: 5.5, comment: 'Chưa nắm rõ phần Ma trận.' }
    }
  },
  {
    code: 'SV202603',
    name: 'Lê Hoàng Minh',
    email: 'minh.le@student.edu.vn',
    phone: '0903 112 233',
    class: 'K45-NNA',
    status: 'ACTIVE',
    enrolledCourses: ['ENG102'],
    attendance: 90,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HoangMinh&backgroundColor=d1d4f9',
    grades: {
      'ENG102': { attendanceScore: 9.0, assignmentScore: 8.5, midtermScore: 8.0, finalScore: 8.5, comment: 'Phát âm chuẩn, giao tiếp tự tin.' }
    }
  }
];

const initialTasks = [
  {
    title: 'Soạn giáo án & Slide Bài 5: React State & Hooks',
    courseId: 'INT2034',
    priority: 'HIGH',
    dueDate: '2026-08-06',
    status: 'IN_PROGRESS'
  },
  {
    title: 'Chấm 45 bài kiểm tra giữa kỳ Tiếng Anh Giao Tiếp',
    courseId: 'ENG102',
    priority: 'HIGH',
    dueDate: '2026-08-05',
    status: 'REVIEW'
  },
  {
    title: 'Nhập điểm chuyên cần tuần 4 môn SQL lên hệ thống Khoa',
    courseId: 'DB201',
    priority: 'MEDIUM',
    dueDate: '2026-08-08',
    status: 'TODO'
  }
];

async function seed() {
  try {
    console.log(`⏳ Đang kết nối tới MongoDB tại: ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('✅ Đã kết nối MongoDB thành công!');

    // Clear existing collections
    await StudentModel.deleteMany({});
    await CourseModel.deleteMany({});
    await TaskModel.deleteMany({});

    console.log('🌱 Đang nạp dữ liệu mẫu vào MongoDB database...');
    await CourseModel.insertMany(initialCourses);
    await StudentModel.insertMany(initialStudents);
    await TaskModel.insertMany(initialTasks);

    console.log('🎉 Nạp dữ liệu MongoDB thành công!');
    console.log(`- Courses: ${initialCourses.length}`);
    console.log(`- Students: ${initialStudents.length}`);
    console.log(`- Tasks: ${initialTasks.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi nạp dữ liệu MongoDB:', error);
    process.exit(1);
  }
}

seed();
