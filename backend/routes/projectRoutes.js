import express from "express";
import * as projectControllers from "../controllers/projectControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, projectControllers.createProject);
router.get("/", verifyToken, projectControllers.getProjects);
router.get("/:id", verifyToken, projectControllers.getProjectById);
router.put("/:id", verifyToken, projectControllers.updateProject);
router.delete("/:id", verifyToken, projectControllers.deleteProject);

export default router;


