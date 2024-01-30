export default {};

declare global {
  interface DecryptParam {
    key: string;
    hash: string;
  }

  interface EncryptRes {
    key: string;
    hash: string;
  }
}
