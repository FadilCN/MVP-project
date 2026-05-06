import express from "express";
import * as userControllers from "../controllers/userControllers.js";

const router = express.Router();

router.post("/signup", userControllers.createUser);
router.post("/login", userControllers.loginUser)
router.post("/logout", userControllers.logoutUser);

export default router;



