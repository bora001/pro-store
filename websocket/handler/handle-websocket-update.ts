import { WebSocketServer } from "ws";
import { broadcastToClients } from "./broad-cast-to-client";
import { PUBLISH_KEYS } from "../constants";

export const handleWebsocketUpdate = (
  wss: WebSocketServer | null,
  type: (typeof PUBLISH_KEYS)[keyof typeof PUBLISH_KEYS],
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
