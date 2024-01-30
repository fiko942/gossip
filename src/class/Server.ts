import express, { Application, application } from "express";
import Auth from "./Auth";
import controller from "../controller";

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
  }

  public start(): void {
    const app = express();

    this.handleRouter(app);

    app.listen(this.port, () => {
      console.log(
        `Application is currently running on port: ${this.port} ✅✅`
      );
    });
  }
}
