import express from "express";
import cors from "cors"; // Move import here
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import llmRoutes from "./routes/llmRoutes.js";

const app = express();

// 1. Global Middlewares (MUST come before routes)
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 2. Routes
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/files", fileRoutes);
app.use("/chats", chatRoutes);
app.use("/llm", llmRoutes);

export default app;