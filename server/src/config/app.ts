import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from '../routes/index';
import { errorHandler, notFoundHandler } from '../middlewares/error.middleware';
import prisma from '../lib/prisma';
import { ENV } from './env'; 
import analyticsRoutes from '../routes/analytics.routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

app.use(cors({
  origin: [ENV.CORS_ORIGIN, 'http://127.0.0.1:5173', 'http://localhost:5173'], 
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://res.cloudinary.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      frameSrc: ["'self'", "https://res.cloudinary.com"], 
      objectSrc: ["'self'", "https://res.cloudinary.com"],
    },
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));

prisma.$connect()
  .then(() => console.log('✅ PostgreSQL Connected (Prisma v7)'))
  .catch((err) => console.error('❌ Database connection failed:', err));

app.use('/api', routes);
app.use('/api/analytics', analyticsRoutes);

// Static files fallback
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;