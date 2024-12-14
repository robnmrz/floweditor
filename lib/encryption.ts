const ALG = "aes-256-cbc"; // key lenght 32 bytes
import crypto from "crypto";
import "server-only"; // prevent any part of this code to be exposed to the client

export const symmetricEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("encryption key is not defined");
  }

  const iv = crypto.randomBytes(16); // initialization vector
  const cipher = crypto.createCipheriv(ALG, Buffer.from(key, "hex"), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const symmetricDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("encryption key is not defined");
  }
  const textParts = encrypted.split(":");
  const iv = Buffer.from(textParts.shift() as string, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, "hex"), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
