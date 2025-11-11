import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve('../.env') });

import jwt from "jsonwebtoken";
import configs from "./configs.js";

// Dummy user payload
const userPayload = {
    _id: "64ff3a2b9a8c1d0012345678", //example ObjectId
    email: "user@gmail.com",
    admin: false
};

console.log("JWT_SECRET =", configs.JWT_SECRET);

// Generate token
const token = jwt.sign(userPayload, configs.JWT_SECRET, {
    expiresIn: "1h", // valid for 1 hour
});

console.log("Dummy JWT token:");
console.log(token);