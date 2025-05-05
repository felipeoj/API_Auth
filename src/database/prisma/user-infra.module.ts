import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaUserRepository } from './prisma-user.repository';
import { UserRepository } from 'src/core/domain/repositories/user-repository.interface';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository, PrismaService],
})
export class UserInfraModule {}
