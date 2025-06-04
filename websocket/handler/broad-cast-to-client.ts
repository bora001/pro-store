import { WebSocketServer } from "ws";

export const broadcastToClients = (wss: WebSocketServer | null, message: string): void => {
  if (!wss || wss.clients.size === 0) return;
  let successCount = 0;
  let errorCount = 0;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
        successCount++;
      } catch (err) {
        console.error("❌ Failed to send message to client:", err);
        errorCount++;
      }
    }
  });

  if (errorCount > 0) console.warn(`⚠️  Failed to send to ${errorCount} clients (${successCount} successful)`);
};
