/* ==========================================================================
   EduLecturer Hub - MongoDB Database Connection
   ========================================================================== */

import mongoose from 'mongoose';
import dns from 'dns';

// Force Public Google DNS for resolving MongoDB Atlas SRV records reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('DNS server override skipped:', e.message);
}

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduteacher_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.warn(`💡 Hệ thống sẽ tự động hoạt động ở chế độ fallback và lưu dữ liệu an toàn!`);
    return false;
  }
}
