import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/core/domain/repositories/user-repository.interface';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { Request } from 'express';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request & { cookies?: Record<string, string> }) =>
          req?.cookies?.refresh_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findByIdAndEmail(
      payload.id,
      payload.email,
    );
    if (!user) throw new UnauthorizedException('Refresh token inválido');
    return user;
  }
}
