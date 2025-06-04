import { CONFIG } from "@/lib/constants/config";
import { useEffect, useRef } from "react";

interface UseWebsocketConnectorProps {
  id: string;
  onMessage: (e: MessageEvent) => void;
  channels: string[];
}

export const useWebsocketConnector = ({ id, onMessage, channels = [] }: UseWebsocketConnectorProps) => {
  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    ws.current = new WebSocket(`ws://${CONFIG.WS_HOST}:${CONFIG.WS_PORT}`);
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (channels.includes(data.type)) onMessage(e);
    };
    return () => ws.current?.close();
  }, [channels, id, onMessage]);
};
