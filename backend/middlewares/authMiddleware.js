import jwt from 'jsonwebtoken';
import configs from '../configs.js';
import User from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'Token missing from header' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, configs.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
    }

    // Fetch full user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found or token invalid' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error in authentication middleware', error: error.message });
  }
};