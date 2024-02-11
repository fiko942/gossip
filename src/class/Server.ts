import express, { Application, application } from "express";
import Auth from "./Auth";
import controller from "../controller";
// @ts-ignore
import cors from "cors";
import bodyParser from "body-parser";
import User from "./User";
import { Socket, Server as SocketServer } from "socket.io";
import http from "http";
import https from "https";

const requireAuthPaths: string[] = ["/"];

export default class Server {
  public port: number;
  private auth: Auth;
  private user: User;

  constructor({ auth, user }: { auth: Auth; user: User }) {
    this.port = 39466;
    this.auth = auth;
    this.user = user;
  }

  private anonymousGuard(app: Application): void {
    app.use(async (req, res, next) => {
      const i = requireAuthPaths.findIndex((x) => x === req.path);
      const sessionHash = req.header("X-Token");
      if (i >= 0 || typeof sessionHash === "string") {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const v = await this.auth.validateSession(sessionHash || "", {
          ip: ip as string,
        });
        if (v === null) {
          return res.json({
            error: true,
            msg: "(401) Unauthorized",
            statusCode: 401,
          });
        } else {
          return next();
        }
      } else {
        next();
      }
    });
  }

  private handleRouter(app: Application): void {
    app.get("/auth/google", (req, res) =>
      controller.auth.google(req, res, this.auth)
    );
    app.get("/auth/googleCallback", (req, res) =>
      controller.auth.googleCallback(req, res, this.auth)
    );
    app.post("/auth/validateSession", (req, res) =>
      controller.auth.validateSession(req, res, this.auth)
    );
    app.get("/user/detail", (req, res) =>
      controller.user.detail(req, res, this.user)
    );
  }

  private handleSocket(io: SocketServer): void {
    io.on("connection", (socket) => {
      console.log("new user connected");
    });
  }

  public start(): void {
    const app = express();

    // Apply middleware
    app.use(cors());
    app.use(bodyParser({ limit: "10MB", extended: true }));
    this.anonymousGuard(app);

    this.handleRouter(app);

    const server = http.createServer(app);
    const io = new SocketServer(server);
    this.handleSocket(io);

    server.listen(this.port, () => {
      console.log(
        `Application is currently running on port: ${this.port} ✅✅`
      );
    });
  }
}
