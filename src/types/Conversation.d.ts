export default {};

declare global {
  interface ConversationItem {
    id: string;
    users: number[];
    usersCanSendMessage: number[];
    createdAt: number;
    isGroup: boolean;
    groupName: string | null;
    icon: string | null;
    pinned: boolean;
    last_chat: number | null;
  }
}
