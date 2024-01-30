import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export default class Encryption {
  private encryptionMethod: string;
  constructor() {
    this.encryptionMethod = "aes-256-cbc";
  }

  private generateKey(): string {
    return uuidv4().toString();
  }

  public encrypt(text: string): EncryptRes {
    const key = this.generateKey();
    const cipher = crypto.createCipher(this.encryptionMethod, key);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return {
      hash: encrypted,
      key: key,
    };
  }

  public decrypt(param: DecryptParam): string {
    const { key } = param;
    const decipher = crypto.createDecipher(this.encryptionMethod, key);
    let decrypted = decipher.update(param.hash, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  }
}
