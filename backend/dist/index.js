"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// ✅ Setup WebSocket server
const wss = new ws_1.Server({ server: httpServer });
wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    ws.on("message", (message) => {
        console.log("Received:", message.toString());
        // Echo back
        ws.send(`You said: ${message}`);
    });
});
app.use("/api/v1", user_routes_1.default);
app.use("/api/v1", chat_routes_1.default);
httpServer.listen(4000, () => {
    console.log("🚀 Server running at http://localhost:4000");
});
