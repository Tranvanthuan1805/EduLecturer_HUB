/* ==========================================================================
   EduLecturer Hub - Express API Server Entry Point
   ========================================================================== */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/integrations', integrationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EduLecturer Hub API Server is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend assets for production / standalone host
app.use(express.static(path.join(__dirname, '../')));

app.listen(PORT, () => {
  console.log(`🚀 EduLecturer Hub Server listening on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints available at http://localhost:${PORT}/api/`);
});
