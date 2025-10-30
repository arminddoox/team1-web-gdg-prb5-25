// backend/app.js
import 'dotenv/config'; // NECESSARY – loads .env (PORT, etc.)

import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

import createError from 'http-errors';   // NECESSARY for 404/error handler
import logger from 'morgan';               // OPTIONAL – dev logging only
import cookieParser from 'cookie-parser';   // OPTIONAL – only if you use cookies

// Import API routes
import indexRouter from './routes/index.js';   // NECESSARY if you have /api
import usersRouter from './routes/users.js';   // NECESSARY if you have /api/users

// ——————————————————————————————————————
// 1. MIDDLEWARE
// ——————————————————————————————————————
const app = express();

// NECESSARY for JSON APIs
app.use(express.json());

// NECESSARY if you accept form POSTs (e.g. from frontend)
app.use(express.urlencoded({ extended: false }));

// OPTIONAL – only if you read/write cookies
app.use(cookieParser());

// OPTIONAL – great for dev, noisy in prod
app.use(logger('dev'));

// ——————————————————————————————————————
// 2. API ROUTES (prefixed with /api)
// ——————————————————————————————————————
app.use('/api', indexRouter);       // NECESSARY
app.use('/api/users', usersRouter); // NECESSARY

// ——————————————————————————————————————
// 3. SERVE VITE PRODUCTION BUILD (frontend/dist)
// ——————————————————————————————————————
const __filename = fileURLToPath(import.meta.url);
const __dirname  = join(__filename, '..');
const distPath   = join(__dirname, '..', 'frontend', 'dist');

// NECESSARY – fail fast if build is missing
if (!existsSync(distPath)) {
  console.error('ERROR: frontend/dist not found! Run: npm run build');
  process.exit(1);
}

// NECESSARY – serve JS/CSS/images
app.use(express.static(distPath));

// NECESSARY – SPA fallback
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();
  const indexFile = join(distPath, 'index.html');
  if (existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    next(createError(500, 'index.html missing'));
  }
});

// ——————————————————————————————————————
// 4. 404 & ERROR HANDLER
// ——————————————————————————————————————
// NECESSARY – catch unknown routes
app.use((req, res, next) => {
  next(createError(404));
});

// NECESSARY – JSON error response
app.use((err, req, res) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

// ——————————————————————————————————————
// 5. START SERVER
// ——————————————————————————————————————
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;