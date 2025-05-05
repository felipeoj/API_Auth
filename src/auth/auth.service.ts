import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/application/dto/register.dto';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { LoginDto } from 'src/application/dto/login.dto';
import { UserRepository } from 'src/core/domain/repositories/user-repository.interface';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { HashedPassword } from 'src/common/utils/hashedPassword.util';
@Injectable()
export class AuthService {
  configService: any;
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  create(dto: RegisterDto) {
    return this.registerUserUseCase.execute(dto);
  }

  async login({
    identifier,
    password,
  }: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user =
      (await this.userRepository.findByEmail?.(identifier)) ||
      (await this.userRepository.findByUsername?.(identifier));

    if (
      !user ||
      !(await HashedPassword.compare(password, user.toObject().password))
    ) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { id: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
