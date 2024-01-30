import mysql, { Pool } from "mysql";

export default class Database {
  private pool: Pool;
  constructor() {
    this.pool = mysql.createPool({
      host: "103.28.53.92",
      user: "tobelsof_fiko",
      password: "TobelLord1_",
      database: "tobelsof_gossip",
      connectionLimit: 10,
    });
  }

  public query(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          return reject(err.message);
        }

        conn.on("error", (msg) => {
          conn.release();
          reject(msg?.toString());
        });

        conn.query(sql, (err, result) => {
          conn.release();
          if (err) {
            return reject(err.message);
          }
          return resolve(result);
        });
      });
    });
  }
}
