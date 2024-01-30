import Server from "./class/Server";
import Auth from "./class/Auth";
import Database from './class/Database'

const database = new Database()
const auth = new Auth({database});
const server = new Server({ auth });

server.start();
