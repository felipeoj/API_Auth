import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/core/domain/repositories/user-repository.interface';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (
          req: Request & { cookies?: Record<string, string> },
        ): string | null => {
          return (req?.cookies?.accessToken as string) ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findByIdAndEmail(
      payload.id,
      payload.email,
    );

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado ou removido');
    }

    return user;
  }
}
