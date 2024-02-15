import Database from "./Database";

export default class Conversation {
  private database: Database;
  constructor({ database }: { database: Database }) {
    this.database = database;
  }

  public async getConversationList({
    userId,
    search,
    limit,
  }: {
    userId: number;
    search: string;
    limit: number;
  }): Promise<ConversationItem[]> {
    const sql: string = `SELECT * FROM conversation WHERE users LIKE "%|${userId}|%" ORDER BY last_chat DESC`;
    const res: any = await this.database.query(sql);
    let c: ConversationItem[] = [];
    for (const item of res) {
      c.push({
        id: item.id,
        users: item.users
          .split("|")
          .map((x: any) => parseInt(x.trim()))
          .filter((x: any) => !isNaN(x)),
        usersCanSendMessage: item.user_can_send_message
          .split("|")
          .map((x: any) => parseInt(x.trim()))
          .filter((x: any) => !isNaN(x)),
        createdAt: item.created_at,
        isGroup: item.is_group == 1,
        groupName: item.group_name,
        icon: item.icon,
        pinned: item.pinned == 1,
        last_chat: item.last_chat,
      });
    }
    return c;
  }
}
