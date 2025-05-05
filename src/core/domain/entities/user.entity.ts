import { User, UserSchema } from './user.schema';
import { UserRole } from './user-role.enum';

export class UserEntity {
  private props: User;

  constructor(data: Partial<User>) {
    this.props = UserSchema.parse({
      ...data,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      isTwoFactorEnabled: data.isTwoFactorEnabled ?? false,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get username(): string {
    return this.props.username;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get userRole(): UserRole {
    return this.props.userRole;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isTwoFactorEnabled(): boolean {
    return this.props.isTwoFactorEnabled;
  }

  set isTwoFactorEnabled(value: boolean) {
    this.props.isTwoFactorEnabled = value;
  }

  get twoFactorSecret(): string | null | undefined {
    return this.props.twoFactorSecret;
  }

  set twoFactorSecret(value: string | null | undefined) {
    this.props.twoFactorSecret = value;
  }

  isAdmin(): boolean {
    return this.props.userRole === UserRole.ADMIN;
  }

  verifyEmail(): void {
    this.props.isEmailVerified = true;
  }

  updateTimestamps(): void {
    this.props.updatedAt = new Date();
  }

  toObject(): User {
    return this.props;
  }
}
