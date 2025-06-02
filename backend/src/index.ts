import express from "express";
import { createServer } from "http";
import { Server as WebSocketServer } from "ws";
import cors from "cors"
import userRoutes from "./routes/user.routes";
import chatroutes from "./routes/chat.routes";
import cookieParser from "cookie-parser";
const app = express();
const httpServer = createServer(app);
app.use(cookieParser());


app.use( express.json())
app.use(cors())

// ✅ Setup WebSocket server
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", (message) => {
        console.log("Received:", message.toString());

        // Echo back
        ws.send(`You said: ${message}`);
    });
});





app.use("/api/v1", userRoutes);

app.use("/api/v1", chatroutes);


httpServer.listen(4000, () => {
    console.log("🚀 Server running at http://localhost:4000");
});
