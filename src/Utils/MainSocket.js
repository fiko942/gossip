import config from "../config";
import { io } from "socket.io-client";

export default class MainSocket {
  socketUrl;
  constructor({ session }) {
    this.socketUrl = config.api.base
      .replace("https", "ws")
      .replace("http", "ws");

    this.socket = io(this.socketUrl, {
      query: {
        session: session,
      },
    });

    this.io = this.socket;
  }
}
