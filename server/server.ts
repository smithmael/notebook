// server/server.ts
import { ENV } from './src/config/env';
import app from './src/config/app';

const PORT = parseInt(ENV.PORT, 10);

// Validate critical environment variables
const validateEnvironment = () => {
  const errors: string[] = [];

  if (!ENV.DATABASE_URL) {
    errors.push('DATABASE_URL is not set in environment variables');
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
      
      // Close server
      server.close(() => {
        console.log('✅ HTTP server closed');
      });
      
      // Close database connection
      try {
        // Dynamic import for default export
        const prismaModule = await import('./src/lib/prisma');
        const prisma = prismaModule.default; // Access default export
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

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
const server = startServer();

export default server;