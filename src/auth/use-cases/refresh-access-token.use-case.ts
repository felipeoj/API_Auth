import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/core/domain/repositories/user-repository.interface';

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    let payload: { id: string; email: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET!,
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    const user = await this.userRepository.findByIdAndEmail(
      payload.id,
      payload.email,
    );

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const accessToken = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      { expiresIn: '15m', secret: process.env.JWT_SECRET },
    );

    return { accessToken };
  }
}
