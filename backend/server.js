import mongoose from 'mongoose';
import app from './app.js';
import configs from './configs.js';

// ============================================
// MongoDB Connection
// ============================================
const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(configs.MONGODB_URI, options);

    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// ============================================
// Start Server
// ============================================
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    const server = app.listen(configs.PORT, () => {
      console.log('');
      console.log('🚀 ============================================');
      console.log(`   Server running in ${configs.NODE_ENV} mode`);
      console.log(`   Port: ${configs.PORT}`);
      console.log(`   URL: http://localhost:${configs.PORT}`);
      console.log(`   Health: http://localhost:${configs.PORT}/api/health`);
      console.log('============================================');
      console.log('');
    });

    // ============================================
    // Graceful Shutdown
    // ============================================
    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);

      // Close server first (stop accepting new connections)
      server.close(async () => {
        console.log('✅ HTTP server closed');

        try {
          // Close database connection
          await mongoose.connection.close(false);
          console.log('✅ MongoDB connection closed');
          process.kill(process.pid, 'SIGTERM');
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.kill(process.pid, 'SIGTERM');
        }
      });

      // Force shutdown after 5 seconds (reduced from 10)
      setTimeout(() => {
        console.error('⚠️  Could not close connections in time, forcefully shutting down');
        process.kill(process.pid, 'SIGTERM');
      }, 5000).unref();
    };

    // Handle shutdown signals (once only to prevent duplicate prompts)
    process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.once('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle nodemon restart signal
    process.once('SIGUSR2', async () => {
      console.log('\n🔄 Nodemon restart detected...');
      await mongoose.connection.close(false);
      console.log('✅ MongoDB connection closed');
      process.kill(process.pid, 'SIGUSR2');
    });

    // Handle uncaught errors (only in production)
    if (configs.NODE_ENV === 'production') {
      process.once('uncaughtException', (error) => {
        console.error('❌ Uncaught Exception:', error);
        gracefulShutdown('UNCAUGHT_EXCEPTION');
      });

      process.once('unhandledRejection', (reason, promise) => {
        console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
        gracefulShutdown('UNHANDLED_REJECTION');
      });
    }

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();