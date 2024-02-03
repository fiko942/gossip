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
    this.server = new Server({ auth: this, user: this.user });
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
   * The function `validateSession` checks if a session hash exists in the database, retrieves the
   * associated email, checks if the email exists in the user table, retrieves the alias associated
   * with the email, and returns an object with the alias if all checks pass, otherwise it returns
   * null.
   * @param {string} hash - The `hash` parameter is a string that represents the session hash. It is
   * used to query the `auth_session` table to validate the session.
   * @returns The function `validateSession` returns a Promise that resolves to either a
   * `ValidateSession` object or `null`.
   */
  public async validateSession(
    hash: string,
    {
      ip,
    }: {
      ip: string;
    }
  ): Promise<ValidateSession | null> {
    const sql: string = `SELECT email FROM auth_session WHERE session_hash = "${hash}" LIMIT 1`;
    const res: any = await this.database.query(sql);
    if (res.length < 1) {
      return null;
    }

    const { email } = res[0];
    const exists = await this.user.exists(email);
    if (!exists) {
      return null;
    }

    const aliasSql: string = `SELECT alias FROM user WHERE email = "${email}" LIMIT 1`;
    const resAlias: any = await this.database.query(aliasSql);

    // Update the ip from the current user
    const updateIpSql: string = `UPDATE user SET ip = "${ip}" WHERE email = "${email}"`;
    await this.database.query(updateIpSql);

    return {
      alias: resAlias[0].alias,
    };
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
