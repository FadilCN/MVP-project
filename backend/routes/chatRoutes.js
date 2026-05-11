import express from "express";
import * as chatControllers from "../controllers/chatControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, chatControllers.createChat);
router.get("/:projectId", verifyToken, chatControllers.getChat);
router.put("/:projectId", verifyToken, chatControllers.updateChat);

export default router;
