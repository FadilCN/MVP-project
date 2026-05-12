import express from "express";
import * as llmControllers from "../controllers/llmControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/response", verifyToken, llmControllers.getResponse);


export default router;
