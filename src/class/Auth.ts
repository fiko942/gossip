import { google, Auth as OAuth2 } from "googleapis";
import Server from "./Server";
import Database from "./Database";
import { v4 as uuidv4 } from "uuid";
import Encryption from "./Encryption";
import User from "./User";
import { Request } from "express";

export default class Auth {
  private authorization: Authorization;
  private server: Server;
  private oAuth2Client: any;
  private database: Database;
  private encryption: Encryption;
  private user: User;

  constructor({
    database,
    encryption,
    user,
  }: {
    database: Database;
    encryption: Encryption;
    user: User;
  }) {
    this.encryption = encryption;
    this.user = user;
    this.database = database;
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

  /**
   * The Google function returns the authorization URL for generating an access token with offline
   * access and specified scopes.
   * @returns a string.
   */
  public Google(): string {
    return this.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.authorization.google.scopes,
    });
  }

  /**
   * The function generates a unique token using the uuidv4 library.
   * @returns A string value is being returned.
   */
  public generateToken(): string {
    return uuidv4();
  }

  /**
   * The function `googleCallback` handles the callback from Google OAuth, retrieves user information,
   * checks if the user exists, creates a new user if necessary, generates a session, and returns the
   * session token.
   * @param {string} code - The `code` parameter is a string that represents the authorization code
   * received from the Google OAuth2 authentication flow. This code is used to exchange for an access
   * token and refresh token.
   * @param {Request} req - The `req` parameter is of type `Request`, which is likely an object
   * representing an HTTP request. It could contain information such as headers, query parameters, and
   * request body.
   * @returns an authentication session token.
   */
  public async googleCallback(code: string, req: Request): Promise<string> {
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

    const userExists: boolean = await this.user.exists(data.email as string);
    const ip = req.header("x-forwared-for") || req.connection.remoteAddress;
    if (!userExists) {
      await this.user.create({
        name: data.name as string,
        email: data.email as string,
        avatar: data.picture as string,
        banned: false,
        ip: ip as string,
      });
    }
    const authSession = await this.user.generateSession(data.email as string, {
      ip: ip || "",
      userAgent: req.header("user-agent") || "",
    });
    return authSession;
  }
}
