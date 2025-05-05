import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  interface PrismaUserMock {
    id: string;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  }

  it('should call prisma.user.create when creating a user', async () => {
    const mockUser: PrismaUserMock = {
      id: '123',
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedpass',
      firstName: 'Test',
      lastName: 'User',
    };

    const createMock = jest.fn().mockResolvedValue(mockUser);
    prismaService.user.create = createMock;

    const result = await service.create({ ...mockUser });

    expect(createMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'test@example.com',
        username: 'testuser',
      }) as Partial<PrismaUserMock>,
    });

    expect(result).toEqual(mockUser);
  });
});
