import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const secretKey = process.env.ENCRYPTION_KEY;

export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    encryptedData: encrypted.toString('hex'),
    iv: iv.toString('hex'),
  };
}

export function decrypt(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, 'hex'),
    Buffer.from(iv, 'hex')
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString();
}
