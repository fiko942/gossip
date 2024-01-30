import Server from "./class/Server";
import Auth from "./class/Auth";

const auth = new Auth();
const server = new Server({ auth });

server.start();
