# 🚀 Hướng Dẫn Khởi Tạo, Đẩy Code Lên GitHub & Lấy Tên Miền (Domain) Cho Học Viên Truy Cập

Hệ thống **EduLecturer Hub** được thiết kế sẵn sàng để đưa lên kho lưu trữ **GitHub** và triển khai trực tiếp lên tên miền công khai miễn phí (**Vercel**, **Netlify** hoặc **Render**).

---

## 📌 Bước 1: Đẩy Dự Án Lên GitHub Repository

1. Mở Terminal (PowerShell / Command Prompt) và di chuyển vào thư mục dự án:
   ```bash
   cd C:\Users\duotech\.gemini\antigravity-ide\scratch\eduteacher_hub
   ```

2. Khởi tạo Git repository và commit dữ liệu:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - EduLecturer Hub System"
   ```

3. Truy cập [GitHub.com](https://github.com) -> Tạo một Repository mới (tên ví dụ: `eduteacher-hub`).

4. Đẩy dự án lên GitHub:
   ```bash
   git remote add origin https://github.com/TENTAIKHOAN/eduteacher-hub.git
   git branch -M main
   git push -u origin main
   ```

---

## 🌐 Bước 2: Triển Khai Lấy Domain Trực Tuyến Miễn Phí (2 Phương Án)

### 🟢 Phương Án A: Dùng Vercel (Khuyên dùng cho Frontend Web - Siêu nhanh)
1. Đăng nhập [Vercel.com](https://vercel.com) bằng tài khoản GitHub.
2. Nhấn **"Add New Project"** -> Chọn Repository `eduteacher-hub` vừa đẩy lên.
3. Nhấn **"Deploy"**. Vercel sẽ tự động cấp cho bạn tên miền trực tuyến miễn phí dạng:
   👉 **`https://eduteacher-hub.vercel.app`**
4. Gửi đường link này cho học viên và lưu bookmark trên điện thoại/máy tính để Thầy/Cô sử dụng mọi lúc mọi nơi!

### 🔵 Phương Án B: Dùng Render.com (Triển khai cả Backend Node.js API & MongoDB)
1. Đăng nhập [Render.com](https://render.com).
2. Tạo **Web Service** mới -> Kết nối với Repo `eduteacher-hub` trên GitHub.
3. Nhập biến môi trường (Environment Variables):
   - `MONGODB_URI`: Đường dẫn kết nối MongoDB Atlas (Cloud)
   - `TELEGRAM_BOT_TOKEN`: Token lấy từ Telegram `@BotFather`
   - `TELEGRAM_CHAT_ID`: ID nhóm/kênh Telegram nhận thông báo
4. Nhấn **Create Web Service**. Render sẽ cấp tên miền backend:
   👉 **`https://eduteacher-hub.onrender.com`**

---

## 🤖 Bước 3: Hướng Dẫn Kết Nối Telegram Bot

1. Mở ứng dụng Telegram, tìm kiếm bot **`@BotFather`**.
2. Gửi lệnh `/newbot` và đặt tên cho Bot (ví dụ: `EduTeacherAlert_Bot`).
3. Sao chép chuỗi **HTTP API Token** (Ví dụ: `7890123456:AAFx...`).
4. Dán Token vào file `.env` hoặc cấu hình biến môi trường trên Render/Vercel:
   ```env
   TELEGRAM_BOT_TOKEN=7890123456:AAFx_YourTokenHere
   TELEGRAM_CHAT_ID=ID_Telegram_Cua_Thay
   ```
5. Nhấn nút **"Telegram"** bên cạnh tên học sinh cần hỗ trợ trên hệ thống, tin nhắn cảnh báo sẽ lập tức được gửi tới điện thoại của Thầy/Cô!

---

## 📊 Bước 4: Hướng Dẫn Kết Nối Đồng Bộ Google Sheets

1. Trong tab **Sổ Điểm & Tiến Độ**, chọn môn học cần kết xuất.
2. Nhấn nút **"Xuất Bảng Điểm"**:
   - Hệ thống sẽ tự động tải về file `.csv` chuẩn hóa font chữ tiếng Việt (UTF-8).
   - Thầy/Cô chỉ cần kéo mở file này bằng **Google Sheets** hoặc **Excel** để lưu trữ và chia sẻ cho Ban Giám Hiệu.

---

🎉 **EduLecturer Hub** - Chúc Thầy Thanh quản lý lớp học và công việc đạt hiệu quả cao nhất!
