import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { RegisterDto } from 'src/application/dto/register.dto';
import { Auth } from 'src/core/domain/entities/auth.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserValidationService } from '../../core/domain/services/user-validation.service';
import { EmailServicePort } from 'src/core/ports/email-service.port';
@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userService: UsersService,
    private readonly userValidationService: UserValidationService,
    @Inject('EmailServicePort') private readonly emailService: EmailServicePort,
  ) {}

  async execute(registerDto: RegisterDto) {
    this.userValidationService.validatePasswordOrThrow(registerDto.password);

    if (!this.userValidationService.isValidEmail(registerDto.email)) {
      throw new BadRequestException('Email inválido');
    }
    if (!this.userValidationService.isValidUsername(registerDto.username)) {
      throw new BadRequestException('Nome de usuário inválido');
    }

    const userExists = await this.userService.findByEmailOrUsername(
      registerDto.email,
      registerDto.username,
    );

    if (userExists) {
      throw new BadRequestException('Usuario ja registrado');
    }

    const auth = new Auth(
      uuidv4(),
      registerDto.email,
      registerDto.username,
      registerDto.password,
    );
    await auth.hashPassword();

    const user = await this.userService.create({
      id: auth.id,
      email: auth.email,
      username: auth.username,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: auth.getHashedPassword(),
    });

    const token = uuidv4();
    await this.emailService.sendVerificationEmail(user.email, token);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
