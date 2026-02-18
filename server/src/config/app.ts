import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url'; // ✅ Required for ESM
import routes from '../routes/index';
import { errorHandler, notFoundHandler } from '../middlewares/error.middleware';
import prisma from '../lib/prisma';
import { ENV } from './env'; 
import analyticsRoutes from '../routes/analytics.routes';

// ✅ Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// 1. 🛡️ Dynamic CORS Configuration
app.use(cors({
  origin: [ENV.CORS_ORIGIN, 'http://127.0.0.1:5173', 'http://localhost:5173'], 
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], // ✅ Added PATCH for updates
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

// 2. Security & Middleware
app.use(helmet({
  // ✅ Essential: Allows your frontend to load the images and PDFs from your /uploads folder
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));

// 3. Database Connection
prisma.$connect()
  .then(() => console.log('✅ PostgreSQL Connected (Prisma v7)'))
  .catch((err) => console.error('❌ Database connection failed:', err));

// 4. Routes
app.use('/api', routes);
app.use('/api/analytics', analyticsRoutes);

// ✅ Serve Static Files (The "Real" Fix)
// This points to the /uploads folder in your server root
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// 5. Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;