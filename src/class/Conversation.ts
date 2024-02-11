import Database from "./Database";

export default class Conversation {
  private database: Database;
  constructor({ database }: { database: Database }) {
    this.database = database;
  }

  public async getConversationList({
    search,
    limit,
  }: {
    search: string;
    limit: number;
  }): Promise<ConversationItem[]> {
    // const sql: string = `SELECT * FROM conversation WHERE users LIKE %'${}'%`
    return [];
  }
}
