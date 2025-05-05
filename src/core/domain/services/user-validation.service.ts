import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/core/domain/repositories/user-repository.interface';

@Injectable()
export class UserValidationService {
  constructor(private readonly userRepository: UserRepository) {}

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  }

  validatePasswordOrThrow(password: string): void {
    if (!this.isValidPassword(password)) {
      throw new BadRequestException(
        'A senha deve conter pelo menos 8 caracteres, maiúsculas, minúsculas, números e caracteres especiais.',
      );
    }
  }
  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !user;
  }

  async isUsernameUnique(username: string): Promise<boolean> {
    const user = await this.userRepository.findByUsername(username);
    return !user;
  }
}
