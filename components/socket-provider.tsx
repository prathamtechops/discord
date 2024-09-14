"use client";
import { socket } from "@/app/socket";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type SocketContextTypes = {
  socket: Socket | null;
  isConnected: boolean;
  transport: string;
};

const SocketContext = createContext<SocketContextTypes>({
  socket: null,
  isConnected: false,
  transport: "N/A",
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
      console.log("Socket connected");
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
      setSocketInstance(socket);
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketInstance, isConnected, transport }}
    >
      {children}
    </SocketContext.Provider>
  );
};
