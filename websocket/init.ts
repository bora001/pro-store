import { Redis } from "ioredis";
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { PUBLISH_KEYS } from "./constants";
import { createRedisSubscriber } from "./subscriber";

let wss: WebSocketServer | null = null;
let subscriber: Redis | null = null;

export const initWebSocketServer = (server: Server): WebSocketServer => {
  if (wss) return wss;
  wss = new WebSocketServer({ server });
  subscriber = createRedisSubscriber(wss);
  subscriber.connect().catch((err) => console.error("❌ Failed to connect to Redis initially:", err));
  wss.on("connection", (ws) => {
    console.log(`🔗 New client connected (Total: ${wss?.clients.size})`);
    ws.on("close", () => console.log(`📴 Client disconnected (Total: ${wss?.clients.size})`));
    ws.on("error", (error) => console.error("❌ WebSocket client error:", error));
  });

  wss.on("error", (error) => console.error("❌ WebSocket server error:", error));
  return wss;
};

export const closeWebSocketServer = (): void => {
  console.log("🔌 Closing WebSocket server...");

  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.close(1000, "Server shutdown");
    });
    wss.close(() => console.log("✅ WebSocket server closed"));
    wss = null;
  }

  if (subscriber) {
    Object.values(PUBLISH_KEYS).forEach((key) => subscriber?.unsubscribe(key));
    subscriber.disconnect();
    subscriber = null;
    console.log("✅ Redis subscriber disconnected");
  }
};

export const getWebSocketStats = () => {
  return {
    isRunning: wss !== null,
    clientCount: wss?.clients.size || 0,
    redisConnected: subscriber?.status === "ready",
  };
};
