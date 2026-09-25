import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import studyRoutes from './routes/study.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

// Load .env from backend directory or root directory
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-ai-test-scenario'],
  })
);

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'StudyFlow AI Backend API is running' });
});

// Study routes
app.use('/api/study', studyRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[StudyFlow AI Backend] Server running on http://localhost:${PORT}`);
});
