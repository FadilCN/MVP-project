import { User } from "../models/userModel.js";
import { BlacklistedToken } from "../models/blacklisted_tokenModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const JWTkey = process.env.JWT_KEY;


export const createUser = async (req, res) => {
  const { email, password } = req.body; 

  const hashedpassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email:  email,
    password: hashedpassword
  });

  console.log("Sent to Database")
  res.status(201).json({ message: 'User created successfully' });;
};



export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
        if (!user) return res.status(404).json({message: 'User not found'});
  
  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({message: 'Invalid password'});

  // Generate JWT
  const token = jwt.sign({ userId: user._id }, JWTkey, { expiresIn: '1h' });

  res.json({ token });
  
};

// logout
export const logoutUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  // Save token to blacklist (example: MongoDB collection)
  await BlacklistedToken.create({ 
    token: token
   });

  res.json({ message: "Logged out successfully" });
};


export const getUserProjects = async (req, res) => {
  const userId = req.payload.userId;

  try {
    console.log("Fetching projects for user:", userId);
    const user = await User.findById(userId).populate("projects");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ 
      userId: user._id,
      projects: user.projects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user projects" });
  }
};