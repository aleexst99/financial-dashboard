import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    setRefreshToken: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('fake-token'),
  };
  const mockConfigService = {
    get: jest.fn().mockReturnValue('fake-config-value'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
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

  it('throws the same generic error whether the user does not exist or the password is wrong', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'ghost@test.com', password: 'anything' }),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      service.login({ email: 'ghost@test.com', password: 'anything' }),
    ).rejects.toThrow('Invalid credentials');
  });

  it('rejects a login with the wrong password for an existing user', async () => {
    const hashedPassword = await bcrypt.hash('correctPassword', 10);
    mockUsersService.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: hashedPassword,
    });

    await expect(
      service.login({ email: 'test@test.com', password: 'wrongPassword' }),
    ).rejects.toThrow('Invalid credentials');
  });
});
