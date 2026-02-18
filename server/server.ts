// server/server.ts
import { ENV } from './src/config/env.js'; 
import app from './src/config/app.js';
import cloudinary from './src/config/cloudinary.js'; // ✅ Added for health check

const PORT = parseInt(ENV.PORT, 10);

// Validate critical environment variables
const validateEnvironment = () => {
  const errors: string[] = [];

  if (!ENV.DATABASE_URL) {
    errors.push('DATABASE_URL is not set in environment variables');
  }

  // ✅ Verify Cloudinary variables are loaded from the updated ENV object
  if (!ENV.CLOUDINARY_NAME || !ENV.CLOUDINARY_API_KEY) {
    errors.push('Cloudinary configuration is missing in .env');
  }

  if (!ENV.JWT_SECRET || ENV.JWT_SECRET === 'your-secret-key') {
    console.warn('⚠️  JWT_SECRET is using default value. Consider changing it in production.');
  }

  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    process.exit(1);
  }
};

// Graceful shutdown handler
const setupGracefulShutdown = (server: any) => {
  const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'] as const;
  
  signals.forEach(signal => {
    process.on(signal, async () => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('✅ HTTP server closed');
      });
      
      try {
        const prismaModule = await import('./src/lib/prisma');
        const prisma = prismaModule.default; 
        await prisma.$disconnect();
        console.log('✅ Database connection closed');
      } catch (error) {
        console.error('❌ Error closing database connection:', error);
      }
      
      console.log('👋 Server shutdown complete');
      process.exit(0);
    });
  });
};

// Start server
const startServer = () => {
  validateEnvironment();
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n🚀 Server started successfully');
    console.log('==============================');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
    console.log(`🔗 CORS Origin: ${ENV.CORS_ORIGIN}`);
    
    // ✅ CLOUDINARY STATUS LOG [cite: 2026-02-17]
    const cloudName = cloudinary.config().cloud_name;
    console.log(`☁️  Cloudinary: ${cloudName === 'bookstore' ? '✅ Connected (bookstore)' : `⚠️ Check Name (${cloudName})`}`);
    
    console.log(`🗄️  Database: ${ENV.DATABASE_URL.includes('localhost') ? 'Local PostgreSQL' : 'Remote Database'}`);
    console.log('==============================');
    console.log(`📡 Local URL: http://localhost:${PORT}`);
    console.log(`🌐 Network URL: http://0.0.0.0:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log('==============================\n');
  });

  setupGracefulShutdown(server);
  return server;
};

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const server = startServer();
export default server;