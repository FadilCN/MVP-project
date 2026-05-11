import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BlacklistedToken } from "../models/blacklisted_tokenModel.js";
dotenv.config();

const JWTkey = process.env.JWT_KEY;

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Restricted no Header" });
  const token = authHeader.split(" ")[1];

  const isBlacklisted = await BlacklistedToken.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is invalidated" });
  }

  // const token = req.cookies.token;
  console.log("Token from header:", token);
  console.log("JWT Secret Key:", JWTkey);

  try {
    const decoded = jwt.verify(token, JWTkey);
    req.payload = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Restricted", error: err.message });
  }
};
