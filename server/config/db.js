/* ==========================================================================
   EduLecturer Hub - MongoDB Database Connection
   ========================================================================== */

import mongoose from 'mongoose';

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduteacher_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // Timeout 5s if local MongoDB is not running
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.warn(`💡 Hệ thống sẽ tự động hoạt động ở chế độ fallback và lưu dữ liệu an toàn!`);
    return false;
  }
}
