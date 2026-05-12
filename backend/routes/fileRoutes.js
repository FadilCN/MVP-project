import express from "express";
import * as fileControllers from "../controllers/fileControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, fileControllers.createFile);
router.get(
  "/project/:projectId",
  verifyToken,
  fileControllers.getFilesByProject,
);
router.get("/:id", verifyToken, fileControllers.getFileById);
router.put("/:id", verifyToken, fileControllers.updateFile);
router.delete("/:id", verifyToken, fileControllers.deleteFile);
router.put("/:projectId/:fileName", verifyToken, fileControllers.updateFileByName);

export default router;
