import Server from "./class/Server";
import Auth from "./class/Auth";
import Database from './class/Database'
import User from './class/User'

const database = new Database()
const auth = new Auth({database});
const user = new User({database});
const server = new Server({ auth });

server.start();
