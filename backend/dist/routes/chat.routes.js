"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controller/chat.controller");
const router = (0, express_1.Router)();
router.get("/chat", chat_controller_1.get); // ✅ Correct handler
exports.default = router;
