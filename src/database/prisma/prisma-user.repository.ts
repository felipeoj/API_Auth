import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserRepository } from 'src/core/domain/repositories/user-repository.interface';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { UserRole } from 'src/core/domain/entities/user-role.enum';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: UserEntity): Promise<void> {
    const data = user.toObject();

    await this.prisma.user.update({
      where: { id: data.id },
      data: {
        twoFactorSecret: data.twoFactorSecret,
        updatedAt: new Date(),
      },
    });
  }

  async findByIdAndEmail(
    id: string,
    email: string,
  ): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, email },
    });

    if (!user) return null;

    return new UserEntity({
      ...user,
      userRole: user.userRole as UserRole,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    if (!email) return null;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return new UserEntity({
      ...user,
      userRole: user.userRole as UserRole,
    });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    if (!username) return null;

    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return null;

    return new UserEntity({
      ...user,
      userRole: user.userRole as UserRole,
    });
  }
}
