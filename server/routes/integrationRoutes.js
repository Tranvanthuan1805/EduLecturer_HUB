/* ==========================================================================
   EduLecturer Hub - Integrations API Routes (Telegram & Google Sheets)
   ========================================================================== */

import express from 'express';
import { sendTelegramMessage, sendRiskStudentAlert, sendDailyTaskSummary } from '../services/telegramService.js';
import { syncGradebookToGoogleSheets, generateGradebookCSV } from '../services/googleSheetService.js';

const router = express.Router();

// 1. Telegram Alert Endpoint
router.post('/telegram/alert', async (req, res) => {
  try {
    const { type, student, reason, tasks } = req.body;

    if (type === 'RISK_STUDENT' && student) {
      const result = await sendRiskStudentAlert(student, reason || 'Nguy cơ cấm thi do vắng/điểm thấp');
      return res.json(result);
    }

    if (type === 'DAILY_TASKS' && tasks) {
      const result = await sendDailyTaskSummary(tasks);
      return res.json(result);
    }

    const customText = req.body.text || '📢 Thông báo từ hệ thống EduLecturer Hub!';
    const result = await sendTelegramMessage(customText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Google Sheets Sync Endpoint
router.post('/google-sheets/sync', async (req, res) => {
  try {
    const { gradebookData, courseName } = req.body;
    const result = await syncGradebookToGoogleSheets(gradebookData || [], courseName || 'Môn Học');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Export CSV Endpoint
router.post('/google-sheets/export-csv', async (req, res) => {
  try {
    const { students, courseId, courseName } = req.body;
    const csvContent = generateGradebookCSV(students || [], courseId, courseName || 'Mon_Hoc');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=BangDiem_${courseName || 'Edu'}.csv`);
    res.send('\uFEFF' + csvContent); // UTF-8 BOM for Excel / Sheets
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
