import jwt from "jsonwebtoken";
import configs from "../configs.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer token
    try {
        const decoded = jwt.verify(token, configs.JWT_SECRET);
        req.user = decoded; // attach user info
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};