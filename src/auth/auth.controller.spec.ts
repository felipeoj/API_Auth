import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/core/domain/repositories/user-repository.interface';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { HandleRefreshTokenUseCase } from './use-cases/handle-refresh-token.use-case';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: RegisterUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: HandleRefreshTokenUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UserRepository,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
