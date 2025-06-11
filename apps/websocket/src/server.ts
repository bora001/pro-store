import { createServer } from "http";
import { initWebSocketServer, closeWebSocketServer, getWebSocketStats } from "./init";
import type { Server } from "http";

const isDev = process.env.NODE_ENV !== "production";
function startServer() {
  try {
    console.log("🚀 Starting WebSocket server...");
    console.log(`📍 Environment: ${isDev ? "development" : "production"}`);
    const port = process.env.PORT || process.env.NEXT_PUBLIC_WS_PORT;
    const host = process.env.HOST || "0.0.0.0";
    const server = createServer((req, res) => {
      res.writeHead(200);
      res.end("WebSocket server is running\n");
    });
    
    initWebSocketServer(server);
    console.log("✅ WebSocket server initialized");

    server.listen(+port, host, () => {
      console.log(`✅ WebSocket Server running on http://${host}:${port}`);
      const stats = getWebSocketStats();
      console.log("📊 Server stats:", stats);
    });

    server.on("error", (err) => {
      console.error("❌ Server error:", err);
      process.exit(1);
    });

    shutDownWebSocket(server);
  } catch (error) {
    console.error("❌ Failed to start WebSocket server:", error);
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
