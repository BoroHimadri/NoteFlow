"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { createClient } from "@/src/services/supabase/client";

export function useCollabSocket(roomId: string, onContentChange: (html: string) => void, onInitialState?: (html: string) => void) {
  const socketRef = useRef<Socket | null>(null);
  const onContentChangeRef = useRef(onContentChange);
  const onInitialStateRef = useRef(onInitialState);

  useEffect(() => {
    onContentChangeRef.current = onContentChange;
  }, [onContentChange]);
  useEffect(() => {
    onInitialStateRef.current = onInitialState;
  }, [onInitialState]);

  useEffect(() => {
    if (!roomId || roomId === "undefined") return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    let socket: Socket | null = null;
    let cancelled = false;

    const connect = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      socket = io(socketUrl, {
        auth: { token: session?.access_token ?? "" },
      });
      socketRef.current = socket;
      socket.emit("join-room", roomId);

      socket.on("content-change", (data) => {
        if (data.roomId === roomId && data.html !== undefined) {
          onContentChangeRef.current(data.html);
        }
      });
      socket.on("initial-state", (data) => {
        if (data.roomId === roomId && data.html !== undefined) {
          onInitialStateRef.current?.(data.html);
        }
      });
    };

    connect();

    return () => {
      cancelled = true;
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  const emitChange = useCallback((html: string) => {
    if (socketRef.current) {
      socketRef.current.emit("content-change", { roomId, html });
    }
  }, [roomId]);

  const syncState = useCallback((html: string) => {
    if (socketRef.current) {
      socketRef.current.emit("sync-state", { roomId, html });
    }
  }, [roomId]);

  return { emitChange, syncState };
}
