"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

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
    const socket = io(socketUrl);
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

    return () => {
      socket.disconnect();
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
