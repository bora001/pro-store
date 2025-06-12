import { WebSocketServer } from "ws";
import { broadcastToClients } from "./broad-cast-to-client";
import { COMMON_CONSTANTS } from "@pro-store-monorepo/common";

export const handleWebsocketUpdate = (
  wss: WebSocketServer | null,
  type: (typeof COMMON_CONSTANTS.PUBLISH_KEYS)[keyof typeof COMMON_CONSTANTS.PUBLISH_KEYS],
  message: string
): void => {
  try {
    const data = JSON.parse(message);
    const payload = { type, data };
    broadcastToClients(wss, JSON.stringify(payload));
    console.log("📡 Broadcasted update:", payload.type);
  } catch (err) {
    console.error("❌ Failed to parse message from Redis:", err);
  }
};
