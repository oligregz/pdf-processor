import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { RateLimit } from './schemas/rate-limit.schema';
import { RateLimitActionEnum } from 'src/common/enums/rate-limit-action.enum';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRateLimitModel = {
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getModelToken(RateLimit.name),
          useValue: mockRateLimitModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should create a new user if one does not exist and return a token', async () => {
      const mockEmail = 'test@example.com';
      const mockUser = { id: 'uuid-123', email: mockEmail };
      const mockToken = 'mocked.jwt.token';

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      mockJwtService.sign.mockReturnValue(mockToken);

      mockRateLimitModel.create.mockResolvedValue(true);

      const result = await service.login(mockEmail);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: mockEmail,
        passwordHash: 'hashed_password_mock',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(mockRateLimitModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
          action: RateLimitActionEnum.SESSION_ACTIVE,
        }),
      );

      expect(result.accessToken).toBe(mockToken);
      expect(result.user.email).toBe(mockEmail);
      expect(result.expiresAt).toBeDefined();
    });
  });
});
