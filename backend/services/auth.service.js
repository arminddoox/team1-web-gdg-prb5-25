import User from '../models/user.model.js';
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
 * @returns {object} { user, token }
 */
export const registerUser = async (email, password) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already exists');

  if (!email.includes('@')) throw new Error('Invalid email format');

  const passwordHash = await bcrypt.hash(password, Number(configs.BCRYPT_SALT_ROUNDS));
  const user = await User.create({ email, passwordHash });

  // Generate JWT token with id and email
  const token = jwt.sign(
    { 
      id: user._id,
      email: user.email  // ← ADD EMAIL HERE
    },
    configs.JWT_SECRET,
    { expiresIn: configs.JWT_EXPIRES_IN }
  );

  const userSafe = user.toObject();
  delete userSafe.passwordHash;

  return { user: userSafe, token };
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

  // Generate JWT token with id and email
  const token = jwt.sign(
    { 
      id: user._id,
      email: user.email  // ← ADD EMAIL HERE
    },
    configs.JWT_SECRET,
    { expiresIn: configs.JWT_EXPIRES_IN }
  );

  const userSafe = user.toObject();
  delete userSafe.passwordHash;

  return { user: userSafe, token };
};

/**
 * Logout user
 * (Real implementation could handle token blacklisting if needed)
 */
export const logoutUser = async (userId) => {
  // If no userId provided, just return success (stateless logout)
  if (!userId) {
    return {
      message: 'User logged out successfully (stateless)',
      timestamp: new Date().toISOString(),
      note: 'Client should delete token',
    };
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    // Don't throw error, just return success (user might be deleted)
    return {
      message: 'User logged out successfully',
      timestamp: new Date().toISOString(),
      note: 'Client should delete token',
    };
  }

  // Update lastLogin (or add new field lastLogout)
    user.lastLogin = new Date();
    await user.save();

  // Return confirmation
  return {
    message: 'User logged out successfully',
    userId: user._id,
    timestamp: new Date().toISOString(),
    note: 'Client should delete token (stateless logout)',
  };
};