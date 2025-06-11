import { createServer } from "http";
import next from "next";
import { initWebSocketServer, closeWebSocketServer, getWebSocketStats } from "./init";
import type { Server } from "http";
import { CONFIG } from "@/lib/constants/config";

const isDev = process.env.NODE_ENV !== "production";
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    console.log("🚀 Starting server...");
    console.log(`📍 Environment: ${isDev ? "development" : "production"}`);
    await app.prepare();
    console.log("✅ Next.js app prepared");

    const server = createServer((req, res) => handle(req, res));
    initWebSocketServer(server);
    console.log("✅ WebSocket server initialized");

    server.listen(CONFIG.WS_PORT, CONFIG.WS_HOST, () => {
      console.log(`✅ WebSocket Server running on http://${CONFIG.WS_HOST}:${CONFIG.WS_PORT}`);
      const stats = getWebSocketStats();
      console.log("📊 Server stats:", stats);
    });

    server.on("error", (err) => {
      console.error("❌ Server error:", err);
      process.exit(1);
    });

    shutDownWebSocket(server);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

function shutDownWebSocket(server: Server) {
  const shutdown = (signal: string) => {
    console.log(`\n📴 Received ${signal}, shutting down...`);
    closeWebSocketServer();

    server.close((err: unknown) => {
      if (err) {
        console.error("❌ Error during server shutdown:", err);
        process.exit(1);
      }
      console.log("✅ Server closed successfully");
      process.exit(0);
    });

    setTimeout(() => {
      console.error("⏰ Forcing shutdown after 10 seconds");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  if (isDev) {
    process.on("SIGUSR2", () => {
      console.log("🔄 Nodemon restart detected");
      shutdown("SIGUSR2");
    });
  }
}

startServer();
