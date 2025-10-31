import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import createError from 'http-errors';
import configs from './configs.js';

// Routes would be imported here
// import authRoutes from './routes/auth.js';
// import habitRoutes from './routes/habits.js';
// import routineRoutes from './routes/routines.js';

const app = express();

// ============================================
// Security Middleware (helmet)
// ============================================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// ============================================
// CORS Configuration
// ============================================
app.use(cors({
  origin: configs.CORS_ORIGIN.split(',').map(origin => origin.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============================================
// Body Parsing Middleware
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// Request Logging (Simple)
// ============================================
if (configs.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// ============================================
// API Routes
// ============================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});
// app.use('/api/auth', authRoutes);
// app.use('/api/habits', habitRoutes);
// app.use('/api/routines', routineRoutes);

// ============================================
// 404 Handler
// ============================================
app.use((req, res, next) => {
  next(createError(404, `Cannot ${req.method} ${req.path}`));
});

// ============================================
// Error Handler Middleware
// ============================================
app.use((err, req, res, next) => {
  // Set default error status
  err.statusCode = err.statusCode || err.status || 500;
  err.message = err.message || 'Internal Server Error';
  
  // Log error
  if (configs.NODE_ENV !== 'test') {
    console.error('Error:', {
      message: err.message,
      statusCode: err.statusCode,
      stack: configs.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
  
  // Send error response
  res.status(err.statusCode).json({
    status: 'error',
    statusCode: err.statusCode,
    message: err.message,
    ...(configs.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;