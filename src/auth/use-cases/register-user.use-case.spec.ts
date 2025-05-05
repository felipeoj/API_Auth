import { RegisterUserUseCase } from './register-user.use-case';
import { UsersService } from 'src/users/users.service';
import { UserValidationService } from 'src/core/domain/services/user-validation.service';
import { EmailServicePort } from 'src/core/ports/email-service.port';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockUsersService: Partial<UsersService>;
  let mockValidationService: Partial<UserValidationService>;
  let mockEmailService: Partial<EmailServicePort>;

  beforeEach(() => {
    mockUsersService = {
      create: jest
        .fn()
        .mockResolvedValue({ id: '1', email: 'test@example.com' }),
      findByEmailOrUsername: jest.fn().mockResolvedValue(null),
    };

    mockValidationService = {
      isValidEmail: jest.fn().mockReturnValue(true),
      isValidUsername: jest.fn().mockReturnValue(true),
      validatePasswordOrThrow: jest.fn(),
    };

    mockEmailService = {
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new RegisterUserUseCase(
      mockUsersService as UsersService,
      mockValidationService as UserValidationService,
      mockEmailService as EmailServicePort,
    );
  });

  it('should register a user and send verification email', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'StrongPass123!',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
    };

    const result = await useCase.execute(dto);

    expect(mockValidationService.isValidEmail).toHaveBeenCalledWith(dto.email);
    expect(mockValidationService.isValidUsername).toHaveBeenCalledWith(
      dto.username,
    );
    expect(mockValidationService.validatePasswordOrThrow).toHaveBeenCalledWith(
      dto.password,
    );
    expect(mockUsersService.findByEmailOrUsername).toHaveBeenCalledWith(
      dto.email,
      dto.username,
    );
    expect(mockUsersService.create).toHaveBeenCalled();
    expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
      dto.email,
      expect.any(String),
    );
    expect(result).toHaveProperty('email', dto.email);
  });
});
