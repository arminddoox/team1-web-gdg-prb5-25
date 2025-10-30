// backend/app.js
import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = join(__filename, '..');

const app = express();

// -------------------------------------------------
// 1. Middleware
// -------------------------------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// -------------------------------------------------
// 2. API routes (prefixed with /api)
// -------------------------------------------------
app.use('/api', indexRouter);   // → GET /api
app.use('/api/users', usersRouter);

// -------------------------------------------------
// 3. Serve Vite production build (frontend/dist)
// -------------------------------------------------
const frontendDist = join(__dirname, '..', 'dist');

// Serve static assets
app.use(express.static(frontendDist));

// SPA fallback: any non-API route → index.html
app.get('*', (req, res, next) => {
  // Let API routes take precedence
  if (req.originalUrl.startsWith('/api')) return next();

  res.sendFile(join(frontendDist, 'index.html'));
});

// -------------------------------------------------
// 4. 404 & error handler (no Jade/Pug)
// -------------------------------------------------
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    // Show stack only in development
    error: req.app.get('env') === 'development' ? err : {}
  });
});

// -------------------------------------------------
// 5. Start server
// -------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;