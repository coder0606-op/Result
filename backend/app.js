import express from 'express';
import cors from 'cors';

import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import marksRoutes from './routes/marksRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/school', schoolRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
