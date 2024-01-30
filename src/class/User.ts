import Database from "./Database";
import Encryption from "./Encryption";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
// @ts-ignore
import satelize from "satelize";

export default class User {
  private database: Database;
  private encryption: Encryption;

  constructor({
    database,
    encryption,
  }: {
    database: Database;
    encryption: Encryption;
  }) {
    this.database = database;
    this.encryption = encryption;
  }

  /**
   * The exists function checks if a user with the given email or id exists in the database.
   * @param {number | string} emailOrId - The `emailOrId` parameter can be either a number or a string.
   * It represents either the email address or the ID of a user.
   * @returns The function `exists` returns a Promise that resolves to a boolean value.
   */
  public async exists(emailOrId: number | string): Promise<boolean> {
    let sql = "";
    if (typeof emailOrId === "string") {
      sql = `SELECT COUNT(*) FROM user WHERE email = "${emailOrId}" LIMIT 1`;
    } else {
      sql = `SELECT COUNT(*) FROM user WHERE id = "${emailOrId}"`;
    }

    const res = await this.database.query(sql);
    return res[0]["COUNT(*)"] > 0;
  }

  /**
   * The `generateSession` function generates a session hash for a given email, IP address, and user
   * agent, and stores it in the database.
   * @param {string} email - The email parameter is a string that represents the email address of the
   * user for whom the session is being generated.
   * @param  - - `email`: The email of the user for whom the session is being generated.
   * @returns The function `generateSession` returns a Promise that resolves to a string.
   */
  public async generateSession(
    email: string,
    {
      ip,
      userAgent,
    }: {
      ip: string;
      userAgent: string;
    }
  ): Promise<string> {
    const exists = await this.exists(email);
    if (!exists) {
      throw new Error(`User with email "${email}" doesn't exists`);
    }

    let sess = "";
    const chars: string =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890+";
    const len = 120;
    for (let i = 0; i < len; i++) {
      sess += chars[Math.floor(Math.random() * chars.length)];
    }

    // Hapus semua sesi dengan email tsb
    const delSql: string = `DELETE FROM auth_session WHERE email = "${email}"`;
    await this.database.query(delSql);
    const addSql: string = `INSERT INTO auth_session (email, session_hash, created, ip, user_agent) VALUES(
      "${email}",
      "${sess}",
      ${moment().unix()},
      "${ip}",
      "${userAgent}"
    )`;
    await this.database.query(addSql);
    return sess;
  }

  /**
   * The function creates a new user in a database with the provided name, email, avatar, banned
   * status, and IP address.
   * @param  - - `name`: The name of the user being created (string).
   */
  public async create({
    name,
    email,
    avatar,
    banned,
    ip,
  }: {
    name: string;
    email: string;
    avatar: string;
    banned: boolean;
    ip: string;
  }): Promise<void> {
    const alreadyExists = await this.exists(email);
    if (alreadyExists) {
      throw new Error(`User with email "${email}" is already exists!`);
    }

    // Get timezone from ip
    const timezone = await new Promise((resolve, reject) => {
      satelize.satelize({ ip }, (err: any, payload: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload ? payload.timezone : null);
        }
      });
    });
    const alias = uuidv4();

    const sql: string = `
      INSERT INTO user (
        name,
        email,
        password,
        avatar,
        alias,
        created,
        banned,
        ip,
        timezone,
        _password
      ) VALUES(
        "${name}",
        "${email}",
        null,
        "${avatar}",
        "${alias}",
        ${moment().unix()},
        ${banned ? 1 : 0},
        "${ip}",
        "${timezone || "Asia/Jakarta"}",
        null
      )
    `;
    await this.database.query(sql);
  }
}
