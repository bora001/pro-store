import { COMMON_CONFIG } from "@pro-store-monorepo/common";
import { useCallback, useEffect, useRef } from "react";

interface UseWebsocketConnectorProps {
  id: string;
  onMessage: (e: MessageEvent) => void;
  channels: string[];
  enabled?: boolean;
}

const MAX_RETRIES = 5; 
export const useWebsocketConnector = ({ id, onMessage, channels = [], enabled = true }: UseWebsocketConnectorProps) => {
  const ws = useRef<WebSocket | null>(null);
  const retryCount = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const connect = useCallback(() => {
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      console.log("⚠️ WebSocket is already connecting or connected");
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_WS_HOST : `${COMMON_CONFIG.WS_HOST}:${process.env.NEXT_PUBLIC_WS_PORT}`
    if (retryCount.current >= MAX_RETRIES) {
      console.error(`⚠️ WebSocket reconnection attempts exceeded the maximum (${MAX_RETRIES}), stopping...`);
      return;
    }
    ws.current = new WebSocket(`${protocol}://${host}`);

    ws.current.onopen = () => {
      retryCount.current = 0;
      console.log("✅ WebSocket connection successful");
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (channels.includes(data.type)) onMessage(e);
    };

    ws.current.onerror = (e) => {
      console.error("⚠️ WebSocket error occurred :", e);
    };


    ws.current.onclose = (event) => {
      console.log(`WebSocket closed. ⚠️code: ${event.code}, ⚠️reason: ${event.reason}, ⚠️wasClean: ${event.wasClean}`);
      if (retryCount.current < MAX_RETRIES) {
        retryCount.current++;
        const delay = Math.min(10000, 1000 * 2 ** retryCount.current);
        reconnectTimeout.current = setTimeout(connect, delay);
        console.warn(`🎡 Reconnecting... retrying in ${delay / 1000} seconds`);
      } else {
        console.error("🛑 Maximum reconnection attempts exceeded");
      }
    };
  },[channels, onMessage]);

  useEffect(() => {
    if (!enabled) return;
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close(1000, "🪓 Component unmounted");
      }
      ws.current = null;
    };
  }, [channels, connect, enabled, id, onMessage]);
};

