import { Socket } from "socket.io";

export default {};

declare global {
  interface SocketConnection {
    socket: Socket;
    alias: string;
    sessionHash: string;
    userId: number;
  }
}
