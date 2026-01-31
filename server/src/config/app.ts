// server/src/config/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from '../routes';
import { errorHandler, notFoundHandler } from '../middlewares/error.middleware';
import prisma from '../lib/prisma'; // ✅ DEFAULT IMPORT
import { ENV } from './env';

const app: Application = express();

// Middleware
app.use(cors({
  origin: ENV.CORS_ORIGIN || '*'
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));



app.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Notebook API is running',
    endpoints: {
      health: '/api/health',
      base: '/api'
    }
  });
});

// Test DB connection on startup
prisma.$connect()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch((e: unknown) => {
    const message = e instanceof Error ? e.message : 'Unknown database error';
    console.error('❌ DB Connection Error:', message);
    process.exit(1);
  });

// Routes
app.use('/api', routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;