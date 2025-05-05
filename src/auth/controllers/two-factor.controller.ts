import {
  Body,
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/core/domain/repositories/user-repository.interface';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../infra/guards/jwt-auth.guard';
import { Auth2FAService } from '../services/auth-2fa.service';
import {
  Verify2FADto,
  Verify2FASchema,
} from 'src/application/dto/verify-2fa.dto';
import { authenticator } from '@otplib/preset-default';
@Controller('auth/2fa')
export class TwoFactorController {
  constructor(private readonly userRepository: UserRepository) {}

  @Post('enable')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@CurrentUser() user: UserEntity) {
    const secret = Auth2FAService.generateSecret();
    const qrCodeUrl = Auth2FAService.generateQRCodeUrl(user.email, secret);
    const qrCodeImage = await Auth2FAService.generateQRCodeImage(
      user.email,
      secret,
    );

    user.twoFactorSecret = secret;
    await this.userRepository.save(user);

    return {
      secret,
      qrCodeUrl,
      qrCodeImage,
    };
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verify(
    @CurrentUser() user: UserEntity,
    @Body(new ZodValidationPipe(Verify2FASchema)) dto: Verify2FADto,
  ) {
    if (!user.twoFactorSecret) {
      throw new UnauthorizedException('2FA ainda não foi habilitado');
    }

    const isValid = authenticator.check(dto.code, user.twoFactorSecret);
    if (!isValid) {
      throw new UnauthorizedException('Código 2FA inválido');
    }

    user.isTwoFactorEnabled = true;
    await this.userRepository.save(user);

    return { message: '2FA verificado com sucesso' };
  }
}
