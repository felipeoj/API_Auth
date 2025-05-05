import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterSchema } from '../application/dto/register.dto';
import { UserRepository } from 'src/core/domain/repositories/user-repository.interface';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { LoginDto } from 'src/application/dto/login.dto';
import { Response } from 'express';
import { HandleRefreshTokenUseCase } from './use-cases/handle-refresh-token.use-case';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly handleRefreshTokenUseCase: HandleRefreshTokenUseCase,
  ) {}

  @Post('signup')
  create(
    @Body(new ZodValidationPipe(RegisterSchema)) registerDto: RegisterDto,
  ) {
    return this.authService.create(registerDto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // ISSO VALE POR 7 DIAS NAO POSSO ESQUECER
    });

    return { accessToken };
  }

  @Post('refresh')
  async refreshAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.handleRefreshTokenUseCase.execute(req, res);
  }
}
