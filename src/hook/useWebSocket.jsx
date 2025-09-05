import { useEffect } from "react";
import { getSocket } from "../services/socket";

export const useWebSocket = ({ reporteId, onMessage }) => {
  useEffect(() => {
    const socket = getSocket();

    // Conectar si no lo está
    if (!socket.connected) {
      socket.connect();
    }

    // Entrar a la sala
    socket.emit("join_room", reporteId);

    // Escuchar mensajes
    socket.on("recibir_mensaje", (data) => {
      if (data.reporte_id === reporteId) {
        onMessage?.(data);
      }
    });

    return () => {
      socket.emit("leave_room", reporteId);
      socket.off("recibir_mensaje");
    };
  }, [reporteId, onMessage]);
};
