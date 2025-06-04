"use server";

import { redis } from "@/lib/redis";

type SocketMessage = { channel: string; message: string };

export async function sendMessageToSocket({ channel, message }: SocketMessage) {
  await redis.publish(channel, message);
}
