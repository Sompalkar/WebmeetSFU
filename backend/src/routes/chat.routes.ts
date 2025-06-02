import { Router } from "express";
import { get } from "../controller/chat.controller";

const router = Router();

router.get("/chat", get); // ✅ Correct handler

export default router;
