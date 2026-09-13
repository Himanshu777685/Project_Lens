import { Router } from "express";
import cookieParser from "cookie-parser";
import { register, login, logout, me } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(cookieParser());
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
