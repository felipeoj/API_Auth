import { randomBytes } from 'crypto';
import { base32 } from 'rfc4648';
import { toDataURL } from 'qrcode';

export class Auth2FAService {
  private static readonly secretLength = 20;

  static generateSecret(): string {
    return base32.stringify(randomBytes(this.secretLength), {
      pad: false,
    });
  }
  static decodeSecret(secret: string): Buffer {
    if (!secret) {
      throw new Error('Segredo 2FA não pode ser vazio');
    }
    return Buffer.from(base32.parse(secret, { loose: true }));
  }

  static generateQRCodeUrl(
    email: string,
    secret: string,
    issuer = 'SecureApp',
  ): string {
    const encodedEmail = encodeURIComponent(email);
    const encodedSecret = encodeURIComponent(secret);
    const encodedIssuer = encodeURIComponent(issuer);
    return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${encodedSecret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
  }

  static async generateQRCodeImage(
    email: string,
    secret: string,
  ): Promise<string> {
    const url = this.generateQRCodeUrl(email, secret);
    const imageDataUrl: string = await toDataURL(url);
    return imageDataUrl;
  }
  static isValidSecret(secret: string): boolean {
    try {
      const buffer = this.decodeSecret(secret);
      return buffer.length === this.secretLength;
    } catch {
      return false;
    }
  }
}
