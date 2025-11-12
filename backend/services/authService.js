import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import configs from '../configs.js';

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

  if (!email.includes('@')) throw new Error('Invalid email format');

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
  if (!user) throw new Error('Invalid email or password'); // "or password" omitted for security

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error('Invalid email or password'); // "or email" omitted for security

  const token = jwt.sign({ id: user._id }, configs.JWT_SECRET, { expiresIn: configs.JWT_EXPIRES_IN });
  return { user, token };
};

/**
 * Logout user
 * (Real implementation could handle token blacklisting if needed)
 */
export const logoutUser = async (userId) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Update lastLogin (or add new field lastLogout)
  user.lastLogin = new Date(); // reuse existing field, or change to lastLogout
  await user.save();

  // Return confirmation
  return {
    message: 'User logged out successfully',
    userId: user._id,
    timestamp: new Date().toISOString(),
    note: 'Client should delete token (stateless logout)',
  };
};