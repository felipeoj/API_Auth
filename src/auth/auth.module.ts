import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth2FAService } from './services/auth-2fa.service';
import { UserInfraModule } from 'src/database/prisma/user-infra.module';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { UsersModule } from 'src/users/users.module';
import { UserValidationService } from 'src/core/domain/services/user-validation.service';
import { TwoFactorController } from './controllers/two-factor.controller';
import { JwtStrategy } from './infra/strategies/jwt.strategy';
import { HandleRefreshTokenUseCase } from './use-cases/handle-refresh-token.use-case';
import { RefreshAccessTokenUseCase } from './use-cases/refresh-access-token.use-case';
import { EmailService } from 'src/infra/email/email.service';
@Module({
  imports: [
    ConfigModule,
    UserInfraModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  controllers: [AuthController, TwoFactorController],
  providers: [
    AuthService,
    Auth2FAService,
    RegisterUserUseCase,
    UserValidationService,
    JwtStrategy,
    HandleRefreshTokenUseCase,
    {
      provide: 'EmailServicePort',
      useClass: EmailService,
    },
    {
      provide: 'EMAIL_CLIENT',
      useValue: {
        send: () => ({ toPromise: async () => {} }),
      },
    },
    RefreshAccessTokenUseCase,
  ],
  exports: [JwtModule, PassportModule, JwtStrategy],
})
export class AuthModule {}
