// utils.js
/**
 * 🧩 Backend utils — Compact edition (Option 2)
 * For a small 2-person Express + Mongoose project.
 *
 * Included:
 *  - logger (dev-friendly)
 *  - ApiError class
 *  - asyncHandler (express wrapper)
 *  - respondSuccess / respondError
 *  - hashPassword / comparePassword (bcrypt)
 *  - signToken / verifyToken (jsonwebtoken)
 *  - pick / omit (object shaping)
 *  - uid (small unique id)
 *  - safeJsonParse, sleep, retry (light optional helpers)
 *
 * Keep this file focused — split into /utils/ when it grows.
 * Author: Armin Đỗ
 * Updated: 2025-11-04
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import configs from './configs.js';

// ---------- flags ----------
export const isProd = configs.NODE_ENV === 'production';
export const isDev = !isProd;

// ---------- logger ----------
export const logger = {
  info: (...args) => console.log('ℹ️', ...args),
  warn: (...args) => console.warn('⚠️', ...args),
  error: (...args) => console.error('❌', ...args),
  debug: (...args) => { if (isDev) console.debug('🔍', ...args); },
};

// ---------- ApiError ----------
export class ApiError extends Error {
  constructor(status = 500, message = 'Internal Server Error', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }
}

// ---------- express async helper ----------
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ---------- response helpers ----------
export const respondSuccess = (res, data = null, meta = {}) =>
  res.status(200).json({ status: 'success', data, meta });

export const respondError = (res, status = 400, message = 'Bad Request', details = null) =>
  res.status(status).json({ status: 'error', message, details });

// ---------- password helpers ----------
export const hashPassword = async (plain) => {
  const rounds = Number(configs.BCRYPT_SALT_ROUNDS) || 10;
  return bcrypt.hash(plain, rounds);
};

export const comparePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

// ---------- jwt helpers ----------
const JWT_SECRET = configs.JWT_SECRET;
const JWT_EXPIRES_IN = configs.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET && isProd) {
  // fail early in production
  throw new Error('JWT_SECRET is required in production');
}

export const signToken = (payload, options = {}) => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, ...options });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // normalize to ApiError for controllers/middlewares
    throw new ApiError(401, 'Invalid or expired token');
  }
};

// ---------- object helpers ----------
export const pick = (obj = {}, keys = []) =>
  keys.reduce((acc, k) => {
    if (Object.prototype.hasOwnProperty.call(obj, k)) acc[k] = obj[k];
    return acc;
  }, {});

export const omit = (obj = {}, keys = []) => {
  const s = new Set(keys);
  return Object.keys(obj).reduce((acc, k) => {
    if (!s.has(k)) acc[k] = obj[k];
    return acc;
  }, {});
};

// ---------- misc ----------
export const uid = (prefix = '') =>
  prefix + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)));

// ---------- small helpers (optional) ----------
export const safeJsonParse = (s, fallback = null) => {
  try { return JSON.parse(s); } catch { return fallback; }
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const retry = async (fn, attempts = 3, delayMs = 300, backoff = 2) => {
  let lastErr;
  let wait = delayMs;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); } catch (err) {
      lastErr = err;
      if (i + 1 < attempts) await sleep(wait);
      wait *= backoff;
    }
  }
  throw lastErr;
};

// ---------- default export ----------
export default {
  isProd, isDev, logger, ApiError, asyncHandler,
  respondSuccess, respondError,
  hashPassword, comparePassword,
  signToken, verifyToken,
  pick, omit, uid,
  safeJsonParse, sleep, retry,
};
