import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { RefreshAccessTokenUseCase } from './refresh-access-token.use-case';

@Injectable()
export class HandleRefreshTokenUseCase {
  constructor(
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<{ accessToken: string }> {
    const refreshToken = (req.cookies as { refreshToken?: string })
      .refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token ausente');
    }

    const { accessToken } =
      await this.refreshAccessTokenUseCase.execute(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    return { accessToken };
  }
}
