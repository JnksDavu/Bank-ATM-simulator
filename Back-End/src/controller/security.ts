import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

const SECRET_KEY = "clubederegatasflamengo";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function encryptSessionId(sessionId: string): string {
  return CryptoJS.AES.encrypt(sessionId, SECRET_KEY).toString();
}

export function decryptSessionId(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
