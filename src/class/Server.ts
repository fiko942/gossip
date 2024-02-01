import express, { Application, application } from "express";
import Auth from "./Auth";
import controller from "../controller";
// @ts-ignore
import cors from "cors";
import bodyParser from "body-parser";

export default class Server {
  public port: number;
  private auth: Auth;

  constructor({ auth }: { auth: Auth }) {
    this.port = 39466;
    this.auth = auth;
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
  }

  public start(): void {
    const app = express();

    // Apply middleware
    app.use(cors());
    app.use(bodyParser({ limit: "10MB", extended: true }));

    this.handleRouter(app);

    app.listen(this.port, () => {
      console.log(
        `Application is currently running on port: ${this.port} ✅✅`
      );
    });
  }
}
