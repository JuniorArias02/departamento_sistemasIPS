import { io } from "socket.io-client";
import { WS } from "../const/api";
let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(WS, {
      autoConnect: false,
    });
  }
  return socket;
};
