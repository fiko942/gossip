export default {};

declare global {
  interface Profile {
    name: string;
    email: string;
    id: number;
    alias: string;
    avatar: string;
    banned: boolean;
    timezone: string;
    ip: string;
  }
}
