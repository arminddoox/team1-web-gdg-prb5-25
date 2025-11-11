import * as authService from '../services/authService.js';

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.registerUser(email, password);
    res.json({ status: 'success', user });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json({ status: 'success', ...result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  try {
    const userId = req.body.userId || null;
    const result = await authService.logoutUser(userId);
    res.json({ status: 'success', ...result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};