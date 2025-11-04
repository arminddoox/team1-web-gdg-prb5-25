// utils.js
// Shared helper functions for the frontend.
// Keep this file small and pure. Split into /utils/ folder only when it grows big.

// ============================================
// Environment & Debug
// ============================================
export const isBrowser = typeof window !== "undefined";
export const IS_DEV = import.meta.env.DEV;

export const logger = {
  log: (...args) => IS_DEV && console.log(...args),
  info: (...args) => IS_DEV && console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
};

// ============================================
// Classname helper (Tailwind-friendly)
// ============================================
export function cx(...args) {
  return args
    .flatMap(a => {
      if (!a) return [];
      if (typeof a === "string") return a.split(" ");
      if (Array.isArray(a)) return a;
      if (typeof a === "object")
        return Object.entries(a)
          .filter(([, v]) => v)
          .map(([k]) => k);
      return [];
    })
    .join(" ");
}

// ============================================
// Debounce & Throttle
// ============================================
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = (fn, limit = 300) => {
  let waiting = false;
  return (...args) => {
    if (!waiting) {
      fn(...args);
      waiting = true;
      setTimeout(() => (waiting = false), limit);
    }
  };
};

// ============================================
// Storage (JSON-safe wrapper)
// ============================================
export const storage = {
  get: (key) => {
    if (!isBrowser) return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key) => {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },
};

// ============================================
// Date & Time Formatting
// ============================================
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

// ============================================
// Query String Utils
// ============================================
export const buildQuery = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

export const parseQuery = (queryString = "") =>
  queryString
    .replace(/^\?/, "")
    .split("&")
    .filter(Boolean)
    .reduce((acc, pair) => {
      const [k, v] = pair.split("=");
      acc[decodeURIComponent(k)] = decodeURIComponent(v);
      return acc;
    }, {});

// ============================================
// Misc Helpers
// ============================================
export const uid = (prefix = "") =>
  prefix + (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 9)).replace("-", "");

export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const assert = (cond, msg = "Assertion failed") => {
  if (!cond) throw new Error(msg);
};

// ============================================
// Default Export
// ============================================
export default {
  isBrowser,
  IS_DEV,
  logger,
  cx,
  debounce,
  throttle,
  storage,
  formatDate,
  timeAgo,
  buildQuery,
  parseQuery,
  uid,
  validateEmail,
  assert,
};
