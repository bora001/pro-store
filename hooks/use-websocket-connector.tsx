import { CONFIG } from "@/lib/constants/config";
import { useEffect, useRef } from "react";

interface UseWebsocketConnectorProps {
  id: string;
  onMessage: (e: MessageEvent) => void;
  channels: string[];
  enabled?: boolean;
}

export const useWebsocketConnector = ({ id, onMessage, channels = [], enabled = true }: UseWebsocketConnectorProps) => {
  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (!enabled) return;
    ws.current = new WebSocket(`ws://${CONFIG.WS_HOST}:${CONFIG.WS_PORT}`);
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (channels.includes(data.type)) onMessage(e);
    };
    return () => ws.current?.close();
  }, [channels, enabled, id, onMessage]);
};
