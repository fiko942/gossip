export default {};

declare global {
  interface Authorization {
    google: {
      clientId: string;
      clientSecret: string;
      scopes: string[];
    };
  }

  interface ValidateSession {
    alias: string;
  }
}
