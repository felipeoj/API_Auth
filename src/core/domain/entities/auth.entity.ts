import { HashedPassword } from '../../../common/utils/hashedPassword.util';
export class Auth {
  constructor(
    public readonly id: string,
    public email: string,
    public username: string,
    private password: string,
    public isEmailVerified: boolean = false,
  ) {}

  async hashPassword(): Promise<void> {
    this.password = await HashedPassword.hash(this.password);
  }

  async comparePassword(plainTextPassword: string): Promise<boolean> {
    return HashedPassword.compare(plainTextPassword, this.password);
  }
  getHashedPassword(): string {
    if (!this.password.startsWith('$2b$')) {
      throw new Error('Password not hashed');
    }
    return this.password;
  }
}
