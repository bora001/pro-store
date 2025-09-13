import { Redis } from "ioredis";

import { handleWebsocketUpdate } from "./handler/handle-websocket-update";
import { WebSocketServer } from "ws";
import { COMMON_CONSTANTS } from "@pro-store-monorepo/common";

export const createRedisSubscriber = (wss: WebSocketServer | null): Redis => {
  const subscriber = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 10000,
    enableOfflineQueue: false,
  });

  subscriber.on("connect", () => {
    console.log("✅ Connected to Redis");
    // re-subscribe when reconnect
    Object.values(COMMON_CONSTANTS.PUBLISH_KEYS).forEach((key) => {
      subscriber.subscribe(key, (err, count) => {
        if (err) {
          console.error("❌ Failed to subscribe after reconnection:", err);
          return;
        }
        console.log(`✅ Re-subscribed to ${key} (${count} channels)`);
      });
    });
  });

  subscriber.on("close", () => console.log("🔌 Redis connection closed"));
  subscriber.on("reconnecting", (ms: number) => console.log(`🔄 Reconnecting to Redis in ${ms}ms...`));
  subscriber.on("error", (err) => console.error("❌ Redis subscriber error:", err));
  subscriber.on("message", (channel, message) => handleWebsocketUpdate(wss, channel, message));
  return subscriber;
};
