import { registerUserService, loginUserService, logoutUserService } from "../services/authService.js";

// Register new user
export const registerUser = async (req, res) => {
    const result = await registerUserService(req.body);
    res.json(result);
};

// Login user
export const loginUser = async (req, res) => {
    const result = await loginUserService(req.body);
    res.json(result);
};

// Logout user
export const logoutUser = async (req, res) => {
    const userId = req.body.userId || null;
    const result = await logoutUserService(userId);
    res.json(result);
};