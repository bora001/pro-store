import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { COMMON_CONFIG } from "@pro-store-monorepo/common";
import { Message } from "@/types";

interface UseWebsocketConnectorProps {
  id: string;
  onMessage: (e: MessageEvent) => void;
  channels: string[];
  enabled?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  maxRetryDelay?: number;
}

interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  retryCount: number;
}

const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_MAX_RETRY_DELAY = 10000;

export const useWebsocketConnector = ({
  id,
  onMessage,
  channels = [],
  enabled = true,
  maxRetries = DEFAULT_MAX_RETRIES,
  retryDelay = DEFAULT_RETRY_DELAY,
  maxRetryDelay = DEFAULT_MAX_RETRY_DELAY,
}: UseWebsocketConnectorProps) => {
  const stateRef = useRef<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    retryCount: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);
  const connectRef = useRef<() => void>(null);
  const onMessageRef = useRef(onMessage);
  const channelsRef = useRef(channels);
  const [state, setState] = useState<WebSocketState>(stateRef.current);

  const wsUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_WS_HOST
        : `${COMMON_CONFIG.WS_HOST}:${process.env.NEXT_PUBLIC_WS_PORT}`;
    return `${protocol}://${host}`;
  }, []);

  const updateState = useCallback((updates: Partial<WebSocketState>) => {
    stateRef.current = { ...stateRef.current, ...updates };
    setState(stateRef.current);
  }, []);

  const cleanup = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      wsRef.current.close(1000, "cleanup");
      wsRef.current = null;
    }

    updateState({
      connected: false,
      connecting: false,
      error: null,
      retryCount: 0,
    });
  }, [updateState]);

  const connect = useCallback(() => {
    if (!enabled || !isMounted.current) return;
    if (wsRef.current) {
      const state = wsRef.current.readyState;
      if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
        console.log(`⚠️ Already connected/connecting for ${id}`);
        return;
      }
      if (state === WebSocket.CLOSING) {
        setTimeout(() => connect(), 100);
        return;
      }
    }

    if (stateRef.current.retryCount >= maxRetries) {
      const errorMsg = `❌ Max retries exceeded for ${id}`;
      console.error(errorMsg);
      updateState({ error: errorMsg, connecting: false });
      return;
    }
    updateState({ connecting: true, error: null });

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        if (!isMounted.current) return;
        updateState({
          connected: true,
          connecting: false,
          retryCount: 0,
        });
        console.log(`✅ Connected to WebSocket (${id})`);
      };

      wsRef.current.onmessage = (event) => {
        if (!isMounted.current) return;

        try {
          const data = JSON.parse(event.data);
          if (channelsRef.current.includes(data.type)) {
            onMessageRef.current(event);
          }
        } catch (err) {
          console.error(`❌ Failed to parse message for ${id}:`, err);
        }
      };

      wsRef.current.onerror = (event) => {
        if (!isMounted.current) return;

        console.warn(`⚠️ WebSocket error for ${id}:`, event);
        updateState({ error: "WebSocket error", connecting: false });
      };

      wsRef.current.onclose = (event) => {
        if (!isMounted.current) return;
        console.log(`WebSocket closed for ${id}. Code: ${event.code}, Reason: ${event.reason}`);

        const shouldReconnect = enabled && event.code !== 1000 && stateRef.current.retryCount < maxRetries;
        updateState({ connected: false, connecting: false });

        if (shouldReconnect) {
          const nextRetry = stateRef.current.retryCount + 1;
          const delay = Math.min(retryDelay * 2 ** (nextRetry - 1), maxRetryDelay);

          updateState({ retryCount: nextRetry });
          console.warn(`🔁 Reconnecting ${id} in ${delay / 1000}s (attempt ${nextRetry})`);

          reconnectTimer.current = setTimeout(() => {
            if (isMounted.current && enabled && connectRef.current) {
              connectRef.current();
            }
          }, delay);
        } else if (event.code !== 1000) {
          updateState({ error: "WebSocket disconnected" });
        }
      };
    } catch (err) {
      console.error(`❌ Connection failed for ${id}:`, err);
      updateState({
        error: "Failed to connect",
        connected: false,
        connecting: false,
      });
    }
  }, [enabled, id, maxRetries, retryDelay, maxRetryDelay, updateState, wsUrl]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const reconnect = useCallback(() => {
    cleanup();

    reconnectTimer.current = setTimeout(() => {
      if (isMounted.current && enabled && connectRef.current) {
        connectRef.current();
      }
    }, 100);
  }, [cleanup, enabled]);

  const sendMessage = useCallback(
    (message: Message) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          const payload = typeof message === "string" ? message : JSON.stringify(message);
          wsRef.current.send(payload);
          return true;
        } catch (err) {
          console.error(`❌ Send failed for ${id}:`, err);
          return false;
        }
      }
      console.warn(`⚠️ WebSocket not open for ${id}`);
      return false;
    },
    [id]
  );

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    channelsRef.current = channels;
  }, [channels]);

  useEffect(() => {
    isMounted.current = true;

    if (enabled) {
      connect();
    } else {
      cleanup();
    }

    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [id, enabled, connect, cleanup]);

  return {
    ...state,
    disconnect,
    reconnect,
    sendMessage,
  };
};
