import Server from "./class/Server";
import Auth from "./class/Auth";
import Database from "./class/Database";
import User from "./class/User";
import Encryption from "./class/Encryption";

const encryption = new Encryption();
const database = new Database();
const user = new User({ database, encryption });
const auth = new Auth({ database, encryption, user });
const server = new Server({ auth, user });

server.start();
