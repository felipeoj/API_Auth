import * as bcrypt from 'bcrypt';

export class HashedPassword {
  private static readonly saltRounds = 10;

  static async hash(data: string): Promise<string> {
    if (!data) {
      throw new Error('Senha não pode ser vazia');
    }
    return bcrypt.hash(data, this.saltRounds);
  }
  static async compare(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }
  static isHashed(data: string): boolean {
    return data.startsWith('$2b$') || data.startsWith('$2a$');
  }
}
