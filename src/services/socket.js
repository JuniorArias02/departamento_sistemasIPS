import { io } from "socket.io-client";
import { WS } from "../const/api";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(WS, {
      autoConnect: false,
      transports: ["websocket"], 
      reconnection: true,        
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,   
      reconnectionDelayMax: 5000
    });

    // Logs útiles
    socket.on("connect", () => {
      console.log("✅ Conectado al WS:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Desconectado:", reason);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log("🔄 Intentando reconectar:", attempt);
    });

    socket.on("reconnect", (attempt) => {
      console.log("✅ Reconectado después de", attempt, "intentos");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión:", err.message);
    });
  }
  return socket;
};
