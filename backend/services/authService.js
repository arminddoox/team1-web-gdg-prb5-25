import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import configs from '../configs.js';

/* ============================
   Placeholder Functions (MVP)
   ============================ */

// These can be used during early testing before connecting DB
export const registerUserPlaceholder = async (userData) => {
  return { message: "registerUserService - user created (placeholder)", data: userData };
};

export const loginUserPlaceholder = async (credentials) => {
  return { message: "loginUserService - login successful (placeholder)", data: credentials };
};

export const logoutUserPlaceholder = async (userId) => {
  return { message: "logoutUserService - user logged out (placeholder)", userId };
};

/* ============================
   Real Service Functions
   ============================ */

/**
 * Register a new user in the database
 * @param {string} email
 * @param {string} password
 */
export const registerUser = async (email, password) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already exists');

  const passwordHash = await bcrypt.hash(password, Number(configs.BCRYPT_SALT_ROUNDS));
  const user = await User.create({ email, passwordHash });
  return user;
};

/**
 * Login a user and return JWT token
 * @param {string} email
 * @param {string} password
 */
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: user._id }, configs.JWT_SECRET, { expiresIn: configs.JWT_EXPIRES_IN });
  return { user, token };
};

/**
 * Logout user placeholder
 * (Real implementation could handle token blacklisting if needed)
 */
export const logoutUser = async (userId) => {
  // For now, just a placeholder
  return { message: "User logged out", userId };
};