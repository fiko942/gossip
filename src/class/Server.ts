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
  public socketConnections: SocketConnection[];

  constructor({ auth, user }: { auth: Auth; user: User }) {
    this.port = 39466;
    this.auth = auth;
    this.user = user;
    this.socketConnections = [];
  }

  /**
   * The function is a middleware that checks if a request path requires authentication and validates
   * the session token before allowing access to the next middleware.
   * @param {Application} app - The `app` parameter is an instance of the `Application` class, which
   * represents the Express application. It is used to configure middleware and routes for the
   * application.
   */
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

  /**
   * The handleRouter function sets up the routes for authentication and user details.
   * @param {Application} app - The `app` parameter is an instance of the Express application. It is
   * used to define the routes and handle the incoming requests.
   */
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
    io.on("connection", async (socket) => {
      const ip = socket.handshake.address;
      const { session } = socket.handshake.query;
      if (typeof session !== "string") {
        return socket.disconnect(true);
      }
      const valid = await this.auth.validateSession(session, { ip });
      if (valid === null) {
        return socket.disconnect(true);
      }

      // Add socket to  the public route
      const s = {
        socket,
        alias: valid.alias,
        sessionHash: session,
      };
      this.socketConnections.push(s);

      socket.on("disconnect", () => {
        // Remove socket from global socket connnections
        this.socketConnections = this.socketConnections.filter((x) => x !== s);
      });

      socket.on("set-active-conversation", (data) => {
        console.log(data);
      });
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
    const io = new SocketServer(server, {
      cors: {
        methods: ["POST", "GET"],
        credentials: true,
        origin: "http://localhost:3000",
      },
    });
    this.handleSocket(io);

    server.listen(this.port, () => {
      console.log(
        `Application is currently running on port: ${this.port} ✅✅`
      );
    });
  }
}
