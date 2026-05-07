import express from "express";
import * as userControllers from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", userControllers.createUser);
router.post("/login", userControllers.loginUser)
router.post("/logout", userControllers.logoutUser);
router.get("/projects", verifyToken, userControllers.getUserProjects);

export default router;



