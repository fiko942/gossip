import { google, Auth as OAuth2 } from "googleapis";
import Server from "./Server";
import Database from './Database'

export default class Auth {
  private authorization: Authorization;
  private server: Server;
  private oAuth2Client: any;
  private database: Database

  constructor({database}: {
    database: Database
  }) {
    this.database = database
    this.server = new Server({ auth: this });
    this.authorization = {
      google: {
        clientSecret: "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",
        clientId:
          "26393309797-h2etcqq3la6b9tc6a65qp4kf1g8hk4m5.apps.googleusercontent.com",
        scopes: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      },
    };

    this.oAuth2Client = new google.auth.OAuth2(
      this.authorization.google.clientId,
      this.authorization.google.clientSecret,
      `http://localhost:${this.server.port}/auth/googleCallback`
    );
  }

  public Google(): string {
    return this.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.authorization.google.scopes,
    });
  }

  public async googleCallback(code: string): Promise<void> {
    const { tokens } = await this.oAuth2Client.getToken(code);
    await this.oAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: this.oAuth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();
    if (!data) {
      throw new Error("Invalid received data");
    }
  }
}
